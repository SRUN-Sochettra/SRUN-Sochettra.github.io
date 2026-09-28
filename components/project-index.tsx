"use client";

import Link from "next/link";
import { useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";
import type { Project } from "@/data/portfolio";

type Props = { projects: readonly Project[]; numbers: readonly number[] };

type SystemProfile = {
  signal: string;
  stages: readonly string[];
  insight: string;
};

const profiles: Readonly<Record<string, SystemProfile>> = {
  synapsedoc: {
    signal: "retrieval",
    stages: ["Document", "Retrieve", "Rerank", "Model", "Citation"],
    insight: "Evidence stays attached to the answer.",
  },
  "thnal-youth-association-management-system": {
    signal: "workflow",
    stages: ["People", "Record", "Validate", "Store", "Manage"],
    insight: "A real organization shaped the data flow.",
  },
  "spring-boot-blog-api": {
    signal: "contract",
    stages: ["Request", "Validate", "Service", "Persist", "Response"],
    insight: "Predictable HTTP behavior starts at the boundary.",
  },
  "hyperspace-os": {
    signal: "interface",
    stages: ["Input", "Window", "State", "App", "Render"],
    insight: "Desktop interactions become composable browser systems.",
  },
  "rfid-access-control": {
    signal: "credential",
    stages: ["Card", "Reader", "Check", "Decision", "OLED"],
    insight: "Physical input becomes visible system state.",
  },
  "hand-gesture-puzzle": {
    signal: "vision",
    stages: ["Camera", "Landmark", "Pinch", "Game", "Target"],
    insight: "Body movement becomes an input contract.",
  },
};

function fallbackProfile(project: Project): SystemProfile {
  const stages = project.stack.slice(0, 5);
  return {
    signal: "system",
    stages: stages.length >= 3 ? stages : ["Input", "Logic", "Output"],
    insight: project.problem ?? project.summary,
  };
}

export default function ProjectIndex({ projects, numbers }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--card-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--card-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };


  const openDossier = (event: MouseEvent<HTMLAnchorElement>, project: Project, number: string, index: number) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    const href = event.currentTarget.href;
    const source = event.currentTarget.getBoundingClientRect();
    const accent = ["#baff43", "#ff4935", "#67d9ff"][index % 3];
    const overlay = document.createElement("div");
    overlay.className = "dossier-transition";
    overlay.style.setProperty("--transition-accent", accent);
    overlay.style.setProperty("--source-x", `${source.left}px`);
    overlay.style.setProperty("--source-y", `${source.top}px`);
    overlay.style.setProperty("--source-w", `${source.width}px`);
    overlay.style.setProperty("--source-h", `${source.height}px`);
    overlay.innerHTML = `
      <div class="dossier-transition__frame">
        <span class="dossier-transition__number">P-${number}</span>
        <span class="dossier-transition__label">Opening system dossier</span>
        <strong>${project.name}</strong>
        <span class="dossier-transition__line"></span>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-running"));
    window.setTimeout(() => window.location.assign(href), 760);
  };

  return (
    <div className="project-grid" ref={gridRef}>
      {projects.map((project, index) => {
        const number = String(numbers[index]).padStart(2, "0");
        const profile = profiles[project.slug] ?? fallbackProfile(project);

        return (
          <Link
            className={`project-card project-card--${(index % 3) + 1}`}
            href={`/projects/${project.slug}`}
            key={project.slug}
            prefetch={false}
            onPointerMove={onPointerMove}
            onClick={(event) => openDossier(event, project, number, index)}
            onPointerLeave={(event) => {
              event.currentTarget.style.removeProperty("--card-x");
              event.currentTarget.style.removeProperty("--card-y");
            }}
            style={{ "--row-index": index } as React.CSSProperties}
          >
            <span className="project-card__top">
              <span>P-{number}</span>
              <span>{project.category}</span>
            </span>

            <span className="project-card__visual" aria-hidden="true">
              <span className="project-card__ambient" />
              <span className="project-card__architecture">
                {profile.stages.map((stage, stageIndex) => (
                  <span className="project-card__stage" style={{ "--stage-index": stageIndex } as React.CSSProperties} key={stage}>
                    <i />
                    <b>{stage}</b>
                  </span>
                ))}
                <span className="project-card__flow" />
              </span>
              <span className="project-card__signal">{profile.signal}</span>
              <span className="project-card__scope">{String(profile.stages.length).padStart(2, "0")} stages / live trace</span>
            </span>

            <span className="project-card__body">
              <span className="project-card__name">{project.name}</span>
              <span className="project-card__summary">{project.summary}</span>
              <span className="project-card__insight">{profile.insight}</span>
            </span>

            <span className="project-card__foot">
              <span>{project.stack.slice(0, 3).join(" · ")}</span>
              <span>Open case study ↗</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
