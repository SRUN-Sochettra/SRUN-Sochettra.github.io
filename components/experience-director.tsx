"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".system-feature__header",
  ".system-observation",
  ".system-trace li",
  ".system-decisions",
  ".system-evidence",
  ".field-note blockquote p",
  ".archive__header > *",
  ".project-card",
  ".working-position__narrative > *",
  ".method-ledger > div",
  ".contact-sheet__main > *",
  ".contact-sheet__meta",
  "[data-reveal^='case-']",
].join(",");

export default function ExperienceDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("no-js");
    root.classList.add("motion-ready");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));

    if (reduced) {
      nodes.forEach((node) => node.classList.add("motion-visible"));
      return () => root.classList.remove("motion-ready");
    }

    nodes.forEach((node, index) => {
      node.classList.add("motion-pending");
      node.style.setProperty("--reveal-order", String(index % 5));
    });

    const reveal = (node: HTMLElement) => {
      node.classList.remove("motion-pending", "case-motion-pending");
      node.classList.add("motion-visible");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    nodes.forEach((node) => observer.observe(node));

    const casePage = document.querySelector<HTMLElement>(".case");
    if (casePage) {
      const caseIntroItems = Array.from(
        document.querySelectorAll<HTMLElement>(".case-back, .case-num, .case-kicker, .case-title, .case-intro, .case-meta"),
      );
      caseIntroItems.forEach((node, index) => {
        node.animate(
          [
            { opacity: 0, transform: index === 3 ? "translateY(80px) scaleY(.84)" : "translateY(36px)" },
            { opacity: 1, transform: "translateY(0) scaleY(1)" },
          ],
          {
            duration: index === 3 ? 1100 : 760,
            delay: 70 + index * 85,
            easing: "cubic-bezier(.22,1,.36,1)",
            fill: "both",
          },
        );
      });

      const caseSections = Array.from(document.querySelectorAll<HTMLElement>(".case-section, .case-next"));
      caseSections.forEach((section, index) => {
        section.classList.add("case-motion-pending");
        section.style.setProperty("--case-order", String(index % 3));
        observer.observe(section);
      });
    }

    const heroLetters = Array.from(document.querySelectorAll<HTMLElement>(".identity-mark__letter > span"));
    const heroItems = Array.from(document.querySelectorAll<HTMLElement>(".identity__notation, .identity__position > *, .identity-mark__meta"));
    heroLetters.forEach((node, index) => {
      node.animate(
        [{ transform: "translateY(115%)" }, { transform: "translateY(0)" }],
        { duration: 900, delay: 180 + index * 60, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
      );
    });
    heroItems.forEach((node, index) => {
      node.animate(
        [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 720, delay: 60 + index * 70, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
      );
    });

    let frame = 0;
    const updateScrollEffects = () => {
      frame = 0;
      const viewport = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-motion-section]").forEach((section) => {
        const rect = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
        section.style.setProperty("--scroll-progress", progress.toFixed(4));
      });

      const caseRoot = document.querySelector<HTMLElement>(".case");
      if (caseRoot) {
        const caseProgress = Math.max(0, Math.min(1, -caseRoot.getBoundingClientRect().top / Math.max(caseRoot.offsetHeight, 1)));
        caseRoot.style.setProperty("--case-progress", caseProgress.toFixed(4));
      }

      const hero = document.querySelector<HTMLElement>(".identity");
      if (hero) {
        const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / Math.max(hero.offsetHeight, 1)));
        root.style.setProperty("--hero-progress", progress.toFixed(4));
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollEffects);
    };

    document.querySelectorAll<HTMLElement>(".system-feature, .field-note, .archive, .contact-sheet").forEach((section) => {
      section.setAttribute("data-motion-section", "");
    });
    updateScrollEffects();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.style.removeProperty("--hero-progress");
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
