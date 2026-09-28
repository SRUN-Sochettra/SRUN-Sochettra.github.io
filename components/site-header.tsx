"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/portfolio";

const links = [
  { href: "#work", label: "Work", code: "P-03" },
  { href: "#index", label: "Projects", code: "06 SYS" },
  { href: "#profile", label: "Profile", code: "PROFILE" },
  { href: "#contact", label: "Contact", code: "CONTACT" },
] as const;

const sectionColors: Record<string, string> = {
  top: "#baff43",
  work: "#ff4935",
  notes: "#ff4935",
  index: "#baff43",
  profile: "#67d9ff",
  contact: "#080a08",
};

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("top");
  const [progressPercent, setProgressPercent] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.max(0, Math.min(1, window.scrollY / max));
      headerRef.current?.style.setProperty("--page-progress", progress.toFixed(4));
      const percent = Math.round(progress * 100);
      setProgressPercent((previous) => previous === percent ? previous : percent);

      const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id], body > section[id]"));
      const marker = window.innerHeight * 0.36;
      let current = sections[0]?.id ?? "top";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActiveId((previous) => previous === current ? previous : current);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusable?.[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  const navActive = links.find((link) => link.href === `#${activeId}`);
  const status = activeId === "top" ? "Introduction" : activeId === "notes" ? "Principle" : navActive?.code;
  const accent = sectionColors[activeId] ?? "#baff43";

  return (
    <>
      <header ref={headerRef} className="site-header site-header--adaptive" data-section={activeId} style={{ "--header-accent": accent } as React.CSSProperties}>
        <div className="site-header__progress" aria-hidden="true"><span /></div>
        <div className="site-header__inner">
          <a className="site-header__mark" href="#top" aria-label="Back to top">SRUN—26</a>
          <div className="site-header__status" aria-live="polite">
            <span>{status}</span>
            <small>{String(progressPercent).padStart(2, "0")}%</small>
          </div>
          <nav className="site-header__nav" aria-label="Primary navigation">
            {links.map((link) => (
              <a href={link.href} key={link.href} aria-current={activeId === link.href.slice(1) ? "location" : undefined}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="site-header__external">
            <span>{site.location.split(",")[0]}</span>
            <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
          <button ref={triggerRef} className="site-header__menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}>Menu</button>
        </div>
      </header>
      <div id="mobile-navigation" ref={panelRef} className="mobile-menu" data-open={open} role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden={!open} hidden={!open}>
        <div className="mobile-menu__topline"><span>SRUN—26</span><button type="button" onClick={() => setOpen(false)}>Close</button></div>
        <nav aria-label="Mobile navigation">
          {links.map((link, index) => (
            <a href={link.href} key={link.href} aria-current={activeId === link.href.slice(1) ? "location" : undefined} onClick={() => setOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{link.label}
            </a>
          ))}
          <a href={site.github} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}><span>05</span>GitHub ↗</a>
        </nav>
      </div>
    </>
  );
}
