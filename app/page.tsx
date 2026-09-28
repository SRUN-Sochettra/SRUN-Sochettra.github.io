
import Image from "next/image";
import Link from "next/link";
import IdentityMark from "@/components/identity-mark";
import ProjectIndex from "@/components/project-index";
import SiteHeader from "@/components/site-header";
import {
  bio,
  capabilityGroups,
  principle,
  projects,
  site,
} from "@/data/portfolio";

const mailtoHref = `mailto:${site.email}`;

export default function Home() {
  const eggscan = projects.find((project) => project.slug === "eggscan");
  const archiveProjects = projects.filter((project) => project.slug !== "eggscan");

  if (!eggscan) return null;

  const hasRepository = Boolean(eggscan.direct);
  const hasLiveBuild = Boolean(eggscan.evidence.live);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section id="top" className="identity" aria-labelledby="identity-position">
          <div className="publication-grid identity__grid">
            <p className="field-notation identity__notation">
              <span>Field notes</span>
              <span>Software systems</span>
              <span>2026</span>
            </p>

            <div className="identity__position">
              <p className="identity__byline">{site.name} / {site.title}</p>
              <p id="identity-position" className="identity__statement">
                I build software<br />
                <em>from the failure state backward.</em>
              </p>
              <p className="identity__support">
                {site.title} in {site.location}, focused on backend systems,
                modern web applications, AI-powered tools, and experimental software.
              </p>
              <div className="identity__actions">
                <a className="text-action" href="#work">View selected work</a>
                <a className="text-action" href={site.github} target="_blank" rel="noopener noreferrer">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <IdentityMark className="identity__mark" />
          </div>
        </section>

        <section id="work" className="system-feature" aria-labelledby="eggscan-title">
          <div className="publication-grid system-feature__grid">
            <p className="system-feature__id">P–01</p>

            <header className="system-feature__header">
              <p className="machine-label">Flagship system / {eggscan.category}</p>
              <h2 id="eggscan-title">{eggscan.name}</h2>
            </header>

            <div className="system-observation">
              <p className="field-label">Observation</p>
              <p>{eggscan.problem ?? eggscan.summary}</p>
            </div>

            <div className="system-trace" aria-labelledby="eggscan-system-label">
              <p id="eggscan-system-label" className="field-label">System</p>
              <ol>
                <li>GitHub profile</li>
                <li>GraphQL extraction</li>
                <li>Spring service</li>
                <li>Groq audit</li>
                <li>Readable verdict</li>
              </ol>
            </div>

            <div className="system-decisions">
              <p className="field-label">Decision</p>
              <dl>
                {eggscan.evidence.decisions?.slice(0, 2).map((decision) => (
                  <div key={decision.label}>
                    <dt>{decision.label}</dt>
                    <dd>{decision.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="system-evidence">
              <p className="field-label">Evidence</p>
              {eggscan.evidence.image ? (
                <figure className="evidence-frame evidence-frame--image">
                  <Image
                    src={eggscan.evidence.image}
                    alt={eggscan.evidence.imageAlt ?? `${eggscan.name} project evidence`}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 30vw"
                  />
                </figure>
              ) : (
                <div className="evidence-frame evidence-frame--status">
                  <span className="machine-label">Visual evidence</span>
                  <strong>Not published</strong>
                  <span>
                    {[hasRepository && "Repository", hasLiveBuild && "live build"]
                      .filter(Boolean)
                      .join(" and ") || "Case study"} available
                  </span>
                </div>
              )}
            </div>

            <div className="system-feature__actions">
              <Link className="text-action" href={`/projects/${eggscan.slug}`}>
                Open case study
              </Link>
              {eggscan.evidence.live ? (
                <a className="text-action" href={eggscan.evidence.live} target="_blank" rel="noopener noreferrer">
                  Open live <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {eggscan.direct ? (
                <a className="text-action text-action--quiet" href={eggscan.direct} target="_blank" rel="noopener noreferrer">
                  Source <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section id="notes" className="field-note" aria-labelledby="field-note-001">
          <div className="publication-grid field-note__grid">
            <p className="field-note__index">Note / 001</p>
            <h2 id="field-note-001" className="sr-only">Working principle</h2>
            <blockquote>
              <p><em>{principle.lead}</em></p>
              <p>{principle.detail}</p>
            </blockquote>
          </div>
        </section>

        <section id="index" className="archive" aria-labelledby="archive-title">
          <div className="archive__header publication-grid">
            <p className="field-notation">Archive</p>
            <div>
              <h2 id="archive-title">Systems on record</h2>
              <p>Verified project facts, stacks, and source routes.</p>
            </div>
          </div>
          <ProjectIndex projects={archiveProjects} startNumber={2} />
        </section>

        <section id="profile" className="working-position" aria-labelledby="profile-title">
          <div className="publication-grid working-position__grid">
            <p className="field-notation">Working position</p>
            <div className="working-position__narrative">
              <h2 id="profile-title">{site.title}</h2>
              {bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <dl className="method-ledger">
              {capabilityGroups.map((group) => (
                <div key={group.name}>
                  <dt>{group.name}</dt>
                  <dd>{group.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <section id="contact" className="contact-sheet" aria-labelledby="contact-title">
        <div className="publication-grid contact-sheet__grid">
          <p className="field-notation">Contact</p>
          <div className="contact-sheet__main">
            <h2 id="contact-title">Looking for a backend or full-stack intern?</h2>
            <p>Java, Spring Boot, PostgreSQL, React, and TypeScript — with project evidence available below.</p>
            <nav aria-label="Contact links">
              <a href={mailtoHref}>Email</a>
              <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </nav>
          </div>
          <p className="contact-sheet__meta">
            {site.location}<br />
            Open to internships and junior opportunities.
          </p>
        </div>
      </section>

      <footer className="site-footer">
        <span>{site.name}</span>
        <span>Systems Field Notes / 2026</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
