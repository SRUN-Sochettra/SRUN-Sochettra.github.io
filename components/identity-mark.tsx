"use client";

import { useEffect, useRef } from "react";

type IdentityMarkProps = { className?: string };

export default function IdentityMark({ className = "" }: IdentityMarkProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduce.matches || !fine.matches) return;

    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const bounds = root.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
        root.style.setProperty("--pointer-x", x.toFixed(3));
        root.style.setProperty("--pointer-y", y.toFixed(3));
        frame = 0;
      });
    };
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <h1 ref={rootRef} className={`identity-mark ${className}`.trim()} aria-label="Srun Sochettra — Systems in Motion">
      <span className="identity-mark__name" aria-hidden="true">
        {"SRUN".split("").map((letter, index) => (
          <span className={`identity-mark__letter identity-mark__letter--${letter.toLowerCase()}`} style={{ "--letter-index": index } as React.CSSProperties} key={letter}>
            <span>{letter}</span>
          </span>
        ))}
      </span>
      <span className="identity-mark__descriptor" aria-hidden="true"><span>Systems</span><span>in Motion</span></span>
    </h1>
  );
}
