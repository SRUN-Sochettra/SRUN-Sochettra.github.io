"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { projects, site, type Scene } from "@/data/portfolio";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DPR_CAP = 2;
const FRAME_COUNT = 96; // frames 001–096 per scene folder (verified in /public/world/frames)

const pad = (n: number, len = 2) => String(n).padStart(len, "0");
const framePath = (folder: string, n: number) =>
  `/world/frames/${folder}/${pad(n, 3)}.webp`;
const stillPath = (folder: string) => `/world/stills/${folder}.svg`;

export default function ScrollWorld({ scenes }: { scenes: readonly Scene[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    // Folder names mirror scene order: "01-origin" … "07-contact".
    const folders = scenes.map((s, i) => `${pad(i + 1)}-${s.id}`);

    let dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    let activeScene = -1;
    let raf = 0;
    let rafPending = false;
    let inView = true;
    let disposed = false;

    // ---- Image cache (no eviction; frames are small + immutably cached) ----
    const cache = new Map<string, HTMLImageElement>();
    const isReady = (img?: HTMLImageElement) =>
      !!img && img.complete && img.naturalWidth > 0;

    const loadImage = (src: string) => {
      let img = cache.get(src);
      if (img) return img;
      img = new Image();
      img.decoding = "async";
      img.onload = requestPaint;
      img.src = src;
      cache.set(src, img);
      return img;
    };

    const ensureScene = (index: number) => {
      if (index < 0 || index >= folders.length) return;
      const folder = folders[index];
      loadImage(stillPath(folder)); // instant poster fallback
      for (let n = 1; n <= FRAME_COUNT; n++) loadImage(framePath(folder, n));
    };

    // Nearest ready frame ≤/≥ target, else the still, else null.
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
        ensureScene(sceneIndex);
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

    root.dataset.mode = reducedMotion ? "reduced" : "scroll";
    ensureScene(0);
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
    };
  }, [scenes]);

  const lastIndex = scenes.length - 1;
  const mailtoHref = "mailto:" + site.email;

  return (
    <div ref={rootRef} className="world" aria-label="Seven-scene portfolio journey">
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