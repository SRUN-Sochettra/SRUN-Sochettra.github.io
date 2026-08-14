
"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/portfolio";

const links = [
  { href: "#work", label: "Work" },
  { href: "#index", label: "Projects" },
  { href: "#profile", label: "Profile" },
  { href: "#contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusable?.[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
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
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__mark" href="#top" aria-label="Back to top">SRUN—26</a>
          <nav className="site-header__nav" aria-label="Primary navigation">
            {links.slice(0, 4).map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
          </nav>
          <div className="site-header__external">
            <span>{site.location.split(",")[0]}</span>
            <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
          <button
            ref={triggerRef}
            className="site-header__menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
          >Menu</button>
        </div>
      </header>
      <div
        id="mobile-navigation"
        ref={panelRef}
        className="mobile-menu"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        hidden={!open}
      >
        <div className="mobile-menu__topline">
          <span>SRUN—26</span>
          <button type="button" onClick={() => setOpen(false)}>Close</button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map((link, index) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{link.label}
            </a>
          ))}
          <a href={site.github} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            <span>06</span>GitHub ↗
          </a>
        </nav>
      </div>
    </>
  );
}
