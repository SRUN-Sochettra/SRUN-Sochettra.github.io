"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type CaseSection = {
  id: string;
  label: string;
};

type CaseNavigatorProps = {
  projectName: string;
  projectNumber: string;
  sections: readonly CaseSection[];
};

const labels: Record<string, string> = {
  overview: "Overview",
  problem: "Problem",
  contribution: "Contribution",
  features: "Capabilities",
  decisions: "Decisions",
  verification: "Verification",
  limitations: "Limitations",
};

const STORAGE_KEY = "chettra-case-command-position";
const EDGE = 16;

type Position = { x: number; y: number };

function clampPosition(position: Position, element: HTMLElement): Position {
  const maxX = Math.max(EDGE, window.innerWidth - element.offsetWidth - EDGE);
  const maxY = Math.max(EDGE, window.innerHeight - element.offsetHeight - EDGE);
  return {
    x: Math.min(Math.max(position.x, EDGE), maxX),
    y: Math.min(Math.max(position.y, EDGE), maxY),
  };
}

export default function CaseNavigator({ projectName, projectNumber, sections }: CaseNavigatorProps) {
  const rootRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, startY: 0, originX: 0, originY: 0 });
  const [activeId, setActiveId] = useState("overview");
  const [progress, setProgress] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [dragging, setDragging] = useState(false);
  const [docked, setDocked] = useState<"left" | "right">("right");

  useEffect(() => {
    // Sections arrive as a prop; the DOM is queried only to track scroll position.
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".case-section[id]"));

    let frame = 0;
    const update = () => {
      frame = 0;
      const caseRoot = document.querySelector<HTMLElement>(".case");
      if (!caseRoot) return;
      const rect = caseRoot.getBoundingClientRect();
      const travel = Math.max(caseRoot.offsetHeight - window.innerHeight, 1);
      const nextProgress = Math.max(0, Math.min(1, -rect.top / travel));
      setProgress(nextProgress);
      rootRef.current?.style.setProperty("--case-nav-progress", nextProgress.toFixed(4));

      const marker = window.innerHeight * 0.42;
      let current = nodes[0]?.id ?? "overview";
      nodes.forEach((node) => {
        if (node.getBoundingClientRect().top <= marker) current = node.id;
      });
      setActiveId((previous) => previous === current ? previous : current);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    let initial: Position = {
      x: window.innerWidth - root.offsetWidth - EDGE,
      y: (window.innerHeight - root.offsetHeight) / 2,
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<Position>;
        if (Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
          initial = { x: parsed.x as number, y: parsed.y as number };
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    const next = clampPosition(initial, root);
    setPosition(next);
    setDocked(next.x < window.innerWidth / 2 ? "left" : "right");

    const onResize = () => setPosition((current) => current ? clampPosition(current, root) : current);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const move = (event: PointerEvent) => {
    const root = rootRef.current;
    if (!root || event.pointerId !== dragRef.current.pointerId) return;
    const next = clampPosition({
      x: dragRef.current.originX + event.clientX - dragRef.current.startX,
      y: dragRef.current.originY + event.clientY - dragRef.current.startY,
    }, root);
    setPosition(next);
  };

  const endDrag = (event: PointerEvent) => {
    const root = rootRef.current;
    if (!root || event.pointerId !== dragRef.current.pointerId) return;
    const current = clampPosition({
      x: dragRef.current.originX + event.clientX - dragRef.current.startX,
      y: dragRef.current.originY + event.clientY - dragRef.current.startY,
    }, root);
    const side = current.x + root.offsetWidth / 2 < window.innerWidth / 2 ? "left" : "right";
    const snapped = { ...current, x: side === "left" ? EDGE : window.innerWidth - root.offsetWidth - EDGE };
    setPosition(snapped);
    setDocked(side);
    setDragging(false);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapped));
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
  };

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!position || event.button !== 0) return;
    event.preventDefault();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  };

  const resetPosition = () => {
    const root = rootRef.current;
    if (!root) return;
    const next = clampPosition({
      x: window.innerWidth - root.offsetWidth - EDGE,
      y: (window.innerHeight - root.offsetHeight) / 2,
    }, root);
    setPosition(next);
    setDocked("right");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <aside
      ref={rootRef}
      className="case-command case-command--movable"
      data-dragging={dragging}
      data-docked={docked}
      aria-label="Case study progress"
      style={position ? { left: position.x, top: position.y } : undefined}
    >
      <button className="case-command__handle" type="button" onPointerDown={startDrag} onDoubleClick={resetPosition} aria-label="Move case-study navigator. Double-click to reset position.">
        <span aria-hidden="true">••••••</span>
        <b>{dragging ? "Moving" : "Drag panel"}</b>
      </button>
      <div className="case-command__identity">
        <span>{projectNumber}</span>
        <p>{projectName}</p>
        <strong>{String(Math.round(progress * 100)).padStart(2, "0")}%</strong>
      </div>
      <div className="case-command__rail" aria-hidden="true"><span /></div>
      <nav aria-label="Case study sections">
        {sections.map((section, index) => (
          <a href={`#${section.id}`} aria-current={activeId === section.id ? "location" : undefined} key={section.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{section.label}</b>
          </a>
        ))}
      </nav>
      <p className="case-command__active" aria-live="polite">Now reading / {labels[activeId] ?? activeId}</p>
      <span className="case-command__signal" aria-hidden="true" />
    </aside>
  );
}