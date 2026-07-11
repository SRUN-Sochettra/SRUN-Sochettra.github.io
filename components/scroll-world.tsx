"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { projects, site, type Scene } from "@/data/portfolio";

/* ------------------------------------------------------------------ *
 * Scroll-world background renderer
 *
 * Cold-start strategy (the actual first-visit win):
 *  - Per-scene lazy load + next-scene prefetch (only current + next leg).
 *  - Bounded-concurrency image queue (no 96-request burst per scene).
 *  - Coarse "keyframe-first" fill: every Nth frame loads first so the
 *    scrub has full-range coverage almost immediately, then the gaps
 *    fill in. pickFrame() already degrades to nearest-ready frame.
 *  - Optional lower-res mobile frame set (flip HAS_MOBILE_FRAMES once
 *    /public/world/frames-mobile/<folder>/NNN.webp assets exist).
 *  - First-scene loading skeleton that preserves stage geometry (no CLS).
 *
 * ASSET PIPELINE (not code - do these in your encode scripts):
 *  - Reduce frames to ~48-60 per scene, then set FRAME_COUNT below.
 *  - Recompress WebP at q70-75, cap width ~1280-1600px (desktop set).
 *  - Optionally emit a narrower mobile set under /world/frames-mobile.
 * ------------------------------------------------------------------ */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const NARROW_QUERY = "(max-width: 760px)";
const DPR_CAP = 2;

// On-disk frames per scene folder. VERIFIED = 96 (001-096) in the repo.
// When you re-encode to a shorter sequence, change this single constant
// to match the new highest frame number (e.g. 60).
const FRAME_COUNT = 96;

// Load every Nth frame first (coarse pass), then backfill the rest.
const KEYFRAME_STRIDE = 8;

// Flip to true ONLY after the mobile frame set actually exists on disk,
// otherwise narrow viewports would 404 every frame. Path convention:
//   /public/world/frames-mobile/<folder>/NNN.webp
const HAS_MOBILE_FRAMES = false;

const pad = (n: number, len = 2) => String(n).padStart(len, "0");
const stillPath = (folder: string) => `/world/stills/${folder}.svg`;

export default function ScrollWorld({ scenes }: { scenes: readonly Scene[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const isNarrow = window.matchMedia(NARROW_QUERY).matches;
    const useMobileFrames = HAS_MOBILE_FRAMES && isNarrow;
    const framesRoot = useMobileFrames ? "/world/frames-mobile" : "/world/frames";
    const framePath = (folder: string, n: number) =>
      `${framesRoot}/${folder}/${pad(n, 3)}.webp`;

    // Fewer parallel connections on constrained mobile links.
    const MAX_CONCURRENT = isNarrow ? 3 : 6;

    // Folder names mirror scene order: "01-origin" ... "07-contact".
    const folders = scenes.map((s, i) => `${pad(i + 1)}-${s.id}`);

    let dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    let activeScene = -1;
    let raf = 0;
    let rafPending = false;
    let inView = true;
    let disposed = false;
    let firstFramePainted = false;

    // ---- Image cache (no eviction; frames are small + immutably cached) ----
    const cache = new Map<string, HTMLImageElement>();
    const isReady = (img?: HTMLImageElement) =>
      !!img && img.complete && img.naturalWidth > 0;

    // ---- Bounded-concurrency load queue (priority = front of queue) --------
    const queue: string[] = [];
    const queued = new Set<string>();
    let inFlight = 0;

    const pump = () => {
      if (disposed) return;
      while (inFlight < MAX_CONCURRENT && queue.length > 0) {
        const src = queue.shift();
        if (!src) break;
        if (cache.has(src)) continue; // already loading or loaded
        const img = new Image();
        img.decoding = "async";
        cache.set(src, img);
        inFlight++;
        img.onload = () => {
          inFlight--;
          requestPaint();
          pump();
        };
        img.onerror = () => {
          inFlight--;
          pump(); // keep draining even if one frame is missing
        };
        img.src = src;
      }
    };

    const enqueue = (src: string, front = false) => {
      if (cache.has(src) || queued.has(src)) return;
      queued.add(src);
      if (front) queue.unshift(src);
      else queue.push(src);
      pump();
    };

    const ensureScene = (index: number, priority = false) => {
      if (index < 0 || index >= folders.length) return;
      const folder = folders[index];
      enqueue(stillPath(folder), priority); // instant poster fallback
      // Coarse keyframes first (full-range coverage fast), then backfill.
      for (let n = 1; n <= FRAME_COUNT; n += KEYFRAME_STRIDE) enqueue(framePath(folder, n), priority);
      for (let n = 1; n <= FRAME_COUNT; n++) enqueue(framePath(folder, n));
    };

    // Nearest ready frame <=/>= target, else the still, else null.
    const pickFrame = (index: number, target: number) => {
      const folder = folders[index];
      for (let off = 0; off < FRAME_COUNT; off++) {
        const lo = target - off;
        const hi = target + off;
        if (lo >= 1) {
          const img = cache.get(framePath(folder, lo));
          if (isReady(img)) return img!;
        }
        if (hi <= FRAME_COUNT) {
          const img = cache.get(framePath(folder, hi));
          if (isReady(img)) return img!;
        }
      }
      const still = cache.get(stillPath(folder));
      return isReady(still) ? still! : null;
    };

    const drawCover = (img: HTMLImageElement, w: number, h: number) => {
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      let dw: number, dh: number;
      if (ir > cr) {
        dh = h;
        dw = h * ir;
      } else {
        dw = w;
        dh = w / ir;
      }
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const calcProgress = () => {
      const range = Math.max(1, root.offsetHeight - window.innerHeight);
      return Math.min(1, Math.max(0, (window.scrollY - root.offsetTop) / range));
    };

    const calcScene = (progress: number) => {
      const weights = scenes.map((s) => s.distance);
      const total = weights.reduce((a, b) => a + b, 0);
      let pos = progress * total;
      let i = 0;
      while (i < weights.length - 1 && pos > weights[i]) {
        pos -= weights[i];
        i++;
      }
      const raw = Math.min(1, Math.max(0, pos / weights[i]));
      const [lead, trail] = scenes[i].linger;
      let local: number;
      if (raw <= lead) local = 0;
      else if (raw >= 1 - trail) local = 1;
      else local = (raw - lead) / (1 - lead - trail);
      return { sceneIndex: i, local };
    };

    const updateRail = (index: number) => {
      root.querySelectorAll<HTMLElement>(".rail a").forEach((a, i) => {
        a.dataset.active = String(i === index);
      });
    };

    const hideSkeleton = () => {
      if (firstFramePainted) return;
      firstFramePainted = true;
      const el = skeletonRef.current;
      if (el) el.dataset.visible = "false";
    };

    const paint = () => {
      if (disposed || !inView) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const { sceneIndex, local } = calcScene(calcProgress());
      if (sceneIndex !== activeScene) {
        activeScene = sceneIndex;
        updateRail(sceneIndex);
        ensureScene(sceneIndex, true); // active leg jumps the queue
        ensureScene(sceneIndex + 1); // prefetch the next leg
      }
      // Reduced motion: hold the first frame per scene (no per-scroll scrub).
      const frameNo = reducedMotion
        ? 1
        : Math.min(
            FRAME_COUNT,
            Math.max(1, Math.round(local * (FRAME_COUNT - 1)) + 1),
          );
      const img = pickFrame(sceneIndex, frameNo);
      ctx.clearRect(0, 0, w, h);
      if (img) {
        drawCover(img, w, h);
        hideSkeleton();
      }
    };

    function requestPaint() {
      if (rafPending || disposed) return;
      rafPending = true;
      raf = window.requestAnimationFrame(() => {
        rafPending = false;
        paint();
      });
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };

    root.dataset.mode = reducedMotion ? "reduced" : "scroll";
    ensureScene(0, true);
    resize();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("orientationchange", resize);
    window.addEventListener("scroll", requestPaint, { passive: true });

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            inView = e.isIntersecting;
            if (inView) requestPaint();
          }
        },
        { threshold: 0 },
      );
      io.observe(root);
    }

    const onVis = () => {
      if (!document.hidden && inView) requestPaint();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      if (raf) window.cancelAnimationFrame(raf);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      window.removeEventListener("scroll", requestPaint);
      queue.length = 0;
      queued.clear();
    };
  }, [scenes]);

  const lastIndex = scenes.length - 1;
  const mailtoHref = "mailto:" + site.email;

  return (
    <div ref={rootRef} className="world" aria-label="Seven-scene portfolio journey">
      <style>{`
        .world-skeleton {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.6s var(--ease, ease);
          background:
            radial-gradient(120% 80% at 20% 30%, color-mix(in srgb, var(--paper) 5%, transparent), transparent 60%),
            var(--carbon, #121515);
        }
        .world-skeleton::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            transparent 30%,
            color-mix(in srgb, var(--paper) 6%, transparent) 50%,
            transparent 70%
          );
          background-size: 220% 100%;
          animation: worldSkeletonShimmer 1.6s ease-in-out infinite;
        }
        .world-skeleton[data-visible="false"] {
          opacity: 0;
        }
        @keyframes worldSkeletonShimmer {
          from { background-position: 180% 0; }
          to { background-position: -80% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .world-skeleton { transition: none; }
          .world-skeleton::after { animation: none; }
        }
      `}</style>
      <div className="world-stage" aria-hidden="true">
        <canvas ref={canvasRef} className="world-canvas" />
        <div ref={skeletonRef} className="world-skeleton" data-visible="true" />
      </div>
      <nav className="rail" aria-label="Journey scenes">
        {scenes.map((scene, index) => {
          const target = "#scene-" + scene.id;
          const label = "Go to " + scene.eyebrow;
          const num = String(index + 1).padStart(2, "0");
          return (
            <a
              key={scene.id}
              href={target}
              aria-label={label}
              data-active={index === 0 ? "true" : "false"}
            >
              {num}
            </a>
          );
        })}
      </nav>
      <div className="scene-flow">
        {scenes.map((scene, index) => {
          const sectionId = "scene-" + scene.id;
          const style = { "--distance": scene.distance } as CSSProperties;
          return (
            <section id={sectionId} className="scene" key={scene.id} style={style}>
              <div className="scene-copy">
                <p className="eyebrow">{scene.eyebrow}</p>
                <h2>{scene.headline}</h2>
                <p className="lede">{scene.body}</p>
                {scene.work && (
                  <ul className="work">
                    {scene.work.map((w) => {
                      const linked = w.slug
                        ? projects.find((p) => p.slug === w.slug)
                        : undefined;
                      const workHref = linked
                        ? "/projects/" + linked.slug
                        : null;
                      return (
                        <li key={w.label}>
                          {workHref ? (
                            <Link className="work-link" href={workHref}>
                              {w.label}
                            </Link>
                          ) : (
                            w.label
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <ul className="tags">
                  {scene.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {index === 0 && (
                  <a className="button" href="#projects">
                    Skip to projects
                  </a>
                )}
                {index === lastIndex && (
                  <div className="actions">
                    <a className="text-link" href={mailtoHref}>
                      Email me
                    </a>
                    <a className="text-link" href={site.github}>
                      GitHub <span aria-hidden="true">↗</span>
                    </a>
                    <a className="text-link" href="#projects">
                      Explore all projects
                    </a>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
