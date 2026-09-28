"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ENTERING = "is-entering";
const VISIBLE = "is-visible";

export default function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    // The document is hydrated, so stylesheet-driven fallbacks can be released.
    root.classList.remove("no-js");
    root.classList.add("motion-ready");

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    // Revealing clears the hidden baseline so the two states stop competing.
    const reveal = (node: HTMLElement) => {
      if (node.classList.contains(VISIBLE)) return;
      node.classList.add(VISIBLE);
      node.classList.remove(ENTERING);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      nodes.forEach(reveal);
      return () => root.classList.remove("motion-ready");
    }

    nodes.forEach((node) => {
      if (node.classList.contains(VISIBLE)) return;
      node.classList.add(ENTERING);
    });

    const pending = nodes.filter((node) => !node.classList.contains(VISIBLE));

    // IntersectionObserver alone is not sufficient: a restored scroll position,
    // an in-page anchor, or a programmatic jump can move a section past the
    // viewport within a single frame, and the observer never reports an element
    // it never saw intersect. This sweep guarantees no [data-reveal] node is
    // ever stranded on the hidden baseline.
    let frame = 0;
    const sweep = () => {
      frame = 0;
      const limit = window.innerHeight;
      for (let i = pending.length - 1; i >= 0; i -= 1) {
        const node = pending[i];
        if (node.getBoundingClientRect().top > limit) continue;
        reveal(node);
        pending.splice(i, 1);
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sweep);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          reveal(node);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.12 },
    );
    pending.forEach((node) => observer.observe(node));

    sweep();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Re-scan on every route change: this component lives in the root layout, so
    // it does not remount when the page does, and case-study nodes would
    // otherwise never be observed.
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
