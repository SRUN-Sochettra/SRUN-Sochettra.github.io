"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { projects, site, type Scene } from "@/data/portfolio";

/* ------------------------------------------------------------------ *
 * Scroll-world background renderer + blocking intro gate
 *
 * Intro gate (the "download must finish before entry" requirement):
 *  - Full-screen fixed overlay above everything (z-index 200).
 *  - Locks body scroll (+ scrollbar-width compensation, no desktop jump).
 *  - Waits until the FIRST scene's frames finish downloading, then
 *    fades out and unlocks scroll. Progress % is driven by load events
 *    via refs (no React state, no re-render per frame).
 *  - Errors count toward progress so a missing frame can't hang the gate.
 *  - Safety timeout + delayed "Skip intro" button so a flaky KH-mobile
 *    connection never traps the user (recovery path, not a dead end).
 *
 * Cold-start loading strategy (unchanged, still the real win):
 *  - Per-scene lazy load + next-scene prefetch (only current + next leg).
 *  - Bounded-concurrency queue (no 96-request burst per scene).
 *  - Coarse keyframe-first fill; pickFrame() degrades to nearest-ready.
 *  - Optional lower-res mobile frame set (HAS_MOBILE_FRAMES).
 *
 * ASSET PIPELINE (do in encode scripts, not code):
 *  - Reduce frames to ~48-60 per scene, then set FRAME_COUNT below.
 *  - Recompress WebP q70-75, cap width ~1280-1600px (desktop set).
 *  - Optionally emit a narrower mobile set under /world/frames-mobile.
 * ------------------------------------------------------------------ */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const NARROW_QUERY = "(max-width: 760px)";
const DPR_CAP = 2;

// On-disk frames per scene folder. VERIFIED = 96 (001-096) in the repo.
// After re-encoding to a shorter sequence, set this to the new max (e.g. 60).
const FRAME_COUNT = 96;

// Load every Nth frame first (coarse pass), then backfill the rest.
const KEYFRAME_STRIDE = 8;

// Flip to true ONLY after the mobile frame set exists on disk, else narrow
// viewports 404 every frame. Path: /public/world/frames-mobile/<folder>/NNN.webp
const HAS_MOBILE_FRAMES = false;

// --- Intro gate tuning ---------------------------------------------------
// Fraction of the FIRST scene (still + frames) that must resolve before the
// site is revealed. 1 = fully downloaded ("finish before entry"). Lower it
// (e.g. 0.6) if you want a faster reveal once assets are recompressed.
const REVEAL_FRACTION = 1;
// Hard safety cap so a broken connection can never trap the user.
const GATE_TIMEOUT_MS = 15000;
// The "Skip intro" escape hatch appears after this long.
const GATE_SKIP_DELAY_MS = 6000;

const pad = (n: number, len = 2) => String(n).padStart(len, "0");
const stillPath = (folder: string) => `/world/stills/${folder}.svg`;

export default function ScrollWorld({ scenes }: { scenes: readonly Scene[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

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

    // ---- Intro gate state -------------------------------------------------
    const gateSet = new Set<string>();
    const gateCounted = new Set<string>();
    let gateResolved = 0;
    let gateDone = false;
    let gateTimer = 0;
    let skipTimer = 0;

    const prevOverflow = document.body.style.overflow;
    const prevPadRight = document.body.style.paddingRight;

    // Lock scroll while the gate is up (compensate for scrollbar to avoid jump).
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (!window.location.hash) window.scrollTo(0, 0);

    const restoreScroll = () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadRight;
    };

    const updateGateUI = () => {
      const total = gateSet.size;
      const pct = total > 0 ? Math.min(100, Math.round((gateResolved / total) * 100)) : 100;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      if (pctRef.current) pctRef.current.textContent = String(pct);
    };

    const revealSite = () => {
      if (gateDone) return;
      gateDone = true;
      if (gateTimer) window.clearTimeout(gateTimer);
      if (skipTimer) window.clearTimeout(skipTimer);
      restoreScroll();
      const el = introRef.current;
      if (el) el.dataset.visible = "false";
      requestPaint();
    };

    const markGate = (src: string) => {
      if (gateDone || !gateSet.has(src) || gateCounted.has(src)) return;
      gateCounted.add(src);
      gateResolved++;
      updateGateUI();
      if (gateResolved >= gateSet.size * REVEAL_FRACTION) revealSite();
    };

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
          markGate(src);
          requestPaint();
          pump();
        };
        img.onerror = () => {
          inFlight--;
          markGate(src); // count errors so the gate can't hang
          pump();
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

    // Nearest ready frame to target, else the still, else null.
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
      if (img) drawCover(img, w, h);
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

    // ---- Build the gate set (first scene: still + all frames) -------------
    const firstFolder = folders[0];
    if (firstFolder) {
      gateSet.add(stillPath(firstFolder));
      for (let n = 1; n <= FRAME_COUNT; n++) gateSet.add(framePath(firstFolder, n));
    }
    updateGateUI();

    root.dataset.mode = reducedMotion ? "reduced" : "scroll";
    ensureScene(0, true);
    resize();

    // Safety net: never trap the user behind the gate.
    gateTimer = window.setTimeout(revealSite, GATE_TIMEOUT_MS);
    skipTimer = window.setTimeout(() => {
      if (skipRef.current) skipRef.current.dataset.visible = "true";
    }, GATE_SKIP_DELAY_MS);
    const skipBtn = skipRef.current;
    if (skipBtn) skipBtn.addEventListener("click", revealSite);

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
      if (gateTimer) window.clearTimeout(gateTimer);
      if (skipTimer) window.clearTimeout(skipTimer);
      if (skipBtn) skipBtn.removeEventListener("click", revealSite);
      restoreScroll();
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
        .world-intro {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          padding: 2rem;
          background:
            radial-gradient(120% 90% at 50% 30%, color-mix(in srgb, var(--paper) 5%, transparent), transparent 60%),
            var(--carbon, #121515);
          opacity: 1;
          transition: opacity 0.5s var(--ease, ease), visibility 0s linear 0s;
        }
        .world-intro[data-visible="false"] {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.5s var(--ease, ease), visibility 0s linear 0.5s;
        }
        .world-intro-inner {
          width: min(420px, 82vw);
          text-align: left;
        }
        .world-intro-mark {
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 1.4rem;
          color: var(--paper, #f2eee6);
        }
        .world-intro-mark span {
          font-family: var(--font-mono, monospace);
          font-weight: 400;
          font-size: 0.82em;
          color: var(--stone, #d8d0c2);
        }
        .world-intro-track {
          height: 3px;
          width: 100%;
          background: color-mix(in srgb, var(--stone, #d8d0c2) 18%, transparent);
          border-radius: 999px;
          overflow: hidden;
        }
        .world-intro-bar {
          height: 100%;
          width: 0%;
          background: var(--lime, #b8d86a);
          border-radius: 999px;
          transition: width 0.25s var(--ease, ease);
        }
        .world-intro-pct {
          margin: 0.9rem 0 0;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          color: var(--stone, #d8d0c2);
          letter-spacing: 0.02em;
        }
        .world-intro-skip {
          margin-top: 1.6rem;
          padding: 0.55rem 0.9rem;
          background: transparent;
          border: 1px solid color-mix(in srgb, var(--stone, #d8d0c2) 30%, transparent);
          border-radius: 2px;
          color: var(--stone, #d8d0c2);
          font-family: var(--font-mono, monospace);
          font-size: 0.78rem;
          cursor: pointer;
          opacity: 0;
          transform: translateY(4px);
          pointer-events: none;
          transition: opacity 0.3s var(--ease, ease), transform 0.3s var(--ease, ease), color 0.2s, border-color 0.2s;
        }
        .world-intro-skip[data-visible="true"] {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        .world-intro-skip:hover {
          color: var(--paper, #f2eee6);
          border-color: color-mix(in srgb, var(--stone, #d8d0c2) 55%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .world-intro,
          .world-intro-bar,
          .world-intro-skip { transition: none; }
        }
      `}</style>
      <div
        ref={introRef}
        className="world-intro"
        data-visible="true"
        role="status"
        aria-live="polite"
        aria-label="Loading portfolio world"
      >
        <div className="world-intro-inner">
          <p className="world-intro-mark">
            SRUN <span>/ Systems in Motion</span>
          </p>
          <div className="world-intro-track">
            <div ref={barRef} className="world-intro-bar" />
          </div>
          <p className="world-intro-pct">
            <span ref={pctRef}>0</span>% loaded — preparing the world
          </p>
          <button ref={skipRef} type="button" className="world-intro-skip" data-visible="false">
            Skip intro
          </button>
        </div>
      </div>
      <div className="world-stage" aria-hidden="true">
        <canvas ref={canvasRef} className="world-canvas" />
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
