
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, site } from "@/data/portfolio";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Not found" };
  const title = `${project.name} — ${site.name}`;
  return { title, description: project.summary, openGraph: { title, description: project.summary, type: "article" } };
}

export default async function ProjectCase({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects[(index + 1) % projects.length];
  const { evidence } = project;
  const number = String(index + 1).padStart(2, "0");

  return (
    <main id="main" className="case">
      <div className="case-back"><Link className="text-action" href="/#index">← All systems</Link></div>
      <header className="case-header">
        <span className="case-num">P–{number} / {String(projects.length).padStart(2, "0")}</span>
        <p className="machine-label case-kicker">Case study / {project.category}</p>
        <h1 className="case-title">{project.name}</h1>
        <p className="case-intro">{project.summary}</p>
        <div className="case-meta">
          <span><b>Category</b>{project.category}</span>
          <span><b>Stack</b>{project.stack.join(" · ")}</span>
          {project.license && <span><b>License</b>{project.license}</span>}
          {evidence.live && <a href={evidence.live} target="_blank" rel="noopener noreferrer"><b>Live</b>Open build ↗</a>}
          {project.direct && <a href={project.direct} target="_blank" rel="noopener noreferrer"><b>Source</b>GitHub ↗</a>}
        </div>
      </header>

      {evidence.image && (
        <figure className="case-poster">
          <Image src={evidence.image} alt={evidence.imageAlt ?? `${project.name} interface screenshot`} width={1600} height={900} priority />
        </figure>
      )}

      <div className="case-body">
        <nav className="case-toc" aria-label="On this page">
          <a href="#overview">01 Overview</a>
          {project.problem && <a href="#problem">02 Problem</a>}
          {evidence.features?.length ? <a href="#features">03 Capabilities</a> : null}
          {evidence.decisions?.length ? <a href="#decisions">04 Decisions</a> : null}
        </nav>
        <div className="case-main">
          <section className="case-section" id="overview">
            <p className="field-label">Overview</p>
            <h2>What the system is</h2>
            <p>{evidence.overview}</p>
          </section>
          {project.problem && (
            <section className="case-section" id="problem">
              <p className="field-label">Problem</p>
              <h2>The constraint that shaped it</h2>
              <p>{project.problem}</p>
            </section>
          )}
          {evidence.features?.length ? (
            <section className="case-section" id="features">
              <p className="field-label">Capabilities</p>
              <h2>What it does</h2>
              <ul className="feature-list">
                {evidence.features.map((feature, featureIndex) => (
                  <li key={feature.title}>
                    <span className="list-index">{String(featureIndex + 1).padStart(2, "0")}</span>
                    <b>{feature.title}</b><span>{feature.desc}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {evidence.decisions?.length ? (
            <section className="case-section" id="decisions">
              <p className="field-label">Engineering</p>
              <h2>Decisions on record</h2>
              <dl className="decisions">
                {evidence.decisions.map((decision) => (
                  <div key={decision.label}><dt>{decision.label}</dt><dd>{decision.value}</dd></div>
                ))}
              </dl>
            </section>
          ) : null}
          {evidence.credits && <p className="case-credits">Credits: {evidence.credits}</p>}
          <div className="case-actions">
            {evidence.live && <a className="button" href={evidence.live} target="_blank" rel="noopener noreferrer">Open live ↗</a>}
            {project.direct && <a className="text-action" href={project.direct} target="_blank" rel="noopener noreferrer">View source ↗</a>}
          </div>
          <div className="case-next">
            <Link href={`/projects/${next.slug}`}>
              <span className="machine-label">Next system</span>
              <span className="name">{next.name} <span aria-hidden="true">→</span></span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
