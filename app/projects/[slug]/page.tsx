import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projects, site } from "@/data/portfolio";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    return { title: `Project not found — ${site.name}` };
  }
  return { title: `${project.name} — ${site.name}`, description: project.summary };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    notFound();
  }
  const evidence = project.evidence;
  const features = evidence.features ?? [];
  const decisions = evidence.decisions ?? [];
  const repositoryHref = project.direct ?? site.repositories;
  const repositoryLabel = project.direct ? "Open repository" : "Browse repositories";
  const liveLabel = evidence.live ? evidence.live.replace(/^https?:\/\//, "").replace(/\/$/, "") : null;
  const imageAlt = evidence.imageAlt ?? `${project.name} project interface screenshot`;

  return (
    <main id="main" className="project-page">
      <Link className="text-link" href="/#projects">← All projects</Link>

      <header className="project-header">
        <p className="eyebrow">{project.category}</p>
        <h1>{project.name}</h1>
        <p className="project-intro">{project.summary}</p>

        <div className="project-meta" aria-label="Project metadata">
          {evidence.live && liveLabel ? (
            <a href={evidence.live} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} live demo`}>
              <b>Live</b>
              {liveLabel}
            </a>
          ) : null}

          {project.license ? (
            <span><b>License</b>{project.license}</span>
          ) : null}

          {evidence.credits ? (
            <span><b>Team</b>{evidence.credits}</span>
          ) : null}

          <span><b>Stack</b>{project.stack.length} technologies</span>
        </div>
      </header>

      {evidence.image ? (
        <figure className="poster">
          <Image className="poster-img" src={evidence.image} alt={imageAlt} fill sizes="(max-width: 760px) 100vw, 80vw" quality={90} />
        </figure>
      ) : null}

      <section aria-labelledby="overview-heading">
        <p className="eyebrow">Project evidence</p>
        <h2 id="overview-heading">Overview</h2>
        <p>{evidence.overview}</p>
      </section>

      {features.length > 0 ? (
        <section aria-labelledby="features-heading">
          <p className="eyebrow">Capabilities</p>
          <h2 id="features-heading">What it does</h2>
          <ul className="feature-list">
            {features.map((feature) => (
              <li key={feature.title}>
                <b>{feature.title}</b>
                <span>{feature.desc}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {decisions.length > 0 ? (
        <section aria-labelledby="decisions-heading">
          <p className="eyebrow">Implementation</p>
          <h2 id="decisions-heading">Key technical decisions</h2>
          <ul className="decisions">
            {decisions.map((decision) => (
              <li key={decision.label}>
                <b>{decision.label}</b>
                <span>{decision.value}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="stack-heading">
        <p className="eyebrow">Technology</p>
        <h2 id="stack-heading">Stack</h2>
        <ul className="tags">
          {project.stack.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="scope-heading">
        <p className="eyebrow">Source discipline</p>
        <h2 id="scope-heading">Verified scope</h2>
        <p className="scope-note">This evidence page is based on information published in the project&apos;s repository README and repository metadata. It does not claim unverified performance metrics, user counts, deployment status, or project outcomes.</p>
      </section>

      <div className="actions" aria-label="Project actions">
        <a className="button" href={repositoryHref} target="_blank" rel="noopener noreferrer">{repositoryLabel}</a>

        {evidence.live ? (
          <a className="text-link" href={evidence.live} target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>
        ) : null}

        <Link className="text-link" href="/#contact">Contact</Link>
      </div>
    </main>
  );
}
