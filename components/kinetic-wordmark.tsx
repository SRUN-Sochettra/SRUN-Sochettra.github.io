"use client";

import { useEffect, useRef } from "react";

/* --------------------------------------------------------------------------
 * KineticWordmark
 * ---------------------------------------------------------------------------
 * The hero name is the primary visual. On mount it "typesets" itself:
 * line 1 settles from condensed/light to expanded/heavy, line 2 does the
 * inverse. On pointer-fine devices the top line's width follows the cursor
 * within a tiny range, so the letters feel like a system under light load.
 *
 * - No layout shift: geometry is fixed; only the variable axes animate.
 * - Reduced-motion: CSS already pins the final axes; JS skips pointer work.
 * - No scroll listeners, no React state, no re-render per frame.
 * ------------------------------------------------------------------------- */

type Props = {
  /** First line — expands and thickens (e.g. "SRUN"). */
  line1: string;
  /** Second line — condenses and lightens (e.g. "Sochettra"). */
  line2: string;
};

export default function KineticWordmark({ line1, line2 }: Props) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const l1Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const l1 = l1Ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    // Reveal on the next frame so the transition from the pre-ready state fires.
    const raf = window.requestAnimationFrame(() => {
      root.dataset.ready = "true";
    });

    if (reduce || !fine || !l1) {
      return () => window.cancelAnimationFrame(raf);
    }

    // Pointer-driven width on line 1 only. Range kept deliberately small
    // (135–165) so it reads as "alive", never distracting.
    let ticking = false;
    const onMove = (e: PointerEvent) => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const ratio = Math.min(Math.max(e.clientX / window.innerWidth, 0), 1);
        const width = 135 + ratio * 30;
        l1.style.setProperty("--wm-w1", width.toFixed(1));
        ticking = false;
      });
    };
    // Only start responding after the intro settle has begun.
    const start = window.setTimeout(() => {
      window.addEventListener("pointermove", onMove, { passive: true });
    }, 1100);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(start);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <h1 ref={rootRef} className="wordmark" data-ready="false">
      <span ref={l1Ref} className="wordmark__line wordmark__line--1">
        {line1}
      </span>
      <span className="wordmark__line wordmark__line--2">
        <i>{line2}</i>
      </span>
    </h1>
  );
}
