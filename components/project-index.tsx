
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/portfolio";

type Props = { projects: readonly Project[]; startNumber: number };

export default function ProjectIndex({ projects, startNumber }: Props) {
  return (
    <div className="project-ledger" role="list">
      {projects.map((project, index) => {
        const number = String(startNumber + index).padStart(2, "0");
        return (
          <Link className="project-ledger__row" href={`/projects/${project.slug}`} key={project.slug} role="listitem">
            <span className="project-ledger__id">P–{number}</span>
            <span className="project-ledger__content">
              <span className="project-ledger__name">{project.name}</span>
              <span className="project-ledger__stack">
                <span className="project-ledger__label">Stack</span>
                {project.stack.join(" → ")}
              </span>
              <span className="project-ledger__category">{project.category}</span>
            </span>
            {project.evidence.image ? (
              <span className="project-ledger__image">
                <Image
                  src={project.evidence.image}
                  alt={project.evidence.imageAlt ?? `${project.name} project evidence`}
                  fill
                  sizes="(max-width: 700px) 36vw, 13vw"
                />
              </span>
            ) : (
              <span className="project-ledger__proof" aria-hidden="true">Case study</span>
            )}
            <span className="project-ledger__arrow" aria-hidden="true">↗</span>
          </Link>
        );
      })}
    </div>
  );
}
