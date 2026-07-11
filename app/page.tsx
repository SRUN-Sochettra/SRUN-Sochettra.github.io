import ScrollWorld from "@/components/scroll-world";
import {
  capabilityGroups,
  projects,
  scenes,
  site,
  unresolvedContent,
} from "@/data/portfolio";

export default function Home() {
  const mailtoHref = "mailto:" + site.email;
  return (
    <>
      <header className="mast">
        <a href="#top" className="mark">
          SRUN <span>/ Systems in Motion</span>
        </a>
        <nav aria-label="Primary">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href={site.github}>GitHub</a>
        </nav>
      </header>
      <main id="main">
        <h1 className="sr-only">
          {site.name} — {site.title}
        </h1>
        <div id="top">
          <ScrollWorld scenes={scenes} />
        </div>
        <section id="projects" className="section projects">
          <header className="section-head">
            <p className="eyebrow">Selected evidence</p>
            <h2>Systems, not decoration.</h2>
            <p>
              Direct access to the work, without completing the cinematic
              journey.
            </p>
          </header>
          <div className="project-list">
            {projects.map((p, i) => {
              const projectHref = "/projects/" + p.slug;
              const num = String(i + 1).padStart(2, "0");
              return (
                <article key={p.slug}>
                  <span>{num}</span>
                  <div>
                    <p className="eyebrow">{p.category}</p>
                    <h3>
                      <a href={projectHref}>{p.name}</a>
                    </h3>
                    <p>{p.summary}</p>
                    <ul className="tags">
                      {p.stack.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <a className="text-link" href={projectHref}>
                    View evidence <span aria-hidden="true">↗</span>
                  </a>
                </article>
              );
            })}
          </div>
        </section>
        <section id="about" className="section split">
          <div>
            <p className="eyebrow">About</p>
            <h2>Precise systems. Practical outcomes.</h2>
          </div>
          <div>
            <p>
              Srun Sochettra is a full-stack developer and Information
              Technology student in Phnom Penh, Cambodia, focused on backend
              systems, full-stack applications, AI-powered developer tools, and
              practical software engineering.
            </p>
            <p>
              The work spans database design, APIs, modern web interfaces,
              document workflows, computer vision, and embedded experiments.
            </p>
          </div>
        </section>
        <section className="section">
          <p className="eyebrow">Capabilities</p>
          <h2>Grouped by the work they enable.</h2>
          <div className="capabilities">
            {capabilityGroups.map((g) => (
              <section key={g.name}>
                <h3>{g.name}</h3>
                <ul>
                  {g.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
        <section className="section approach">
          <p className="eyebrow">Engineering approach</p>
          <h2>Boundaries before spectacle.</h2>
          <div>
            <p>
              Start from the real workflow. Define data, state, permissions, and
              failure paths. Keep interfaces readable and system behavior
              explainable.
            </p>
            <p>
              Use evidence to improve the implementation: current code, tests,
              logs, runtime behavior, and clear documentation.
            </p>
          </div>
        </section>
        <section className="section">
          <p className="eyebrow">Additional work</p>
          <h2>Experiments that extend the system.</h2>
          <ul className="additional">
            <li>AnimeRoyale</li>
            <li>Raspberry Pi Pico Coursework</li>
            <li>University Coursework Archive</li>
            <li>GitHub Actions and profile automation</li>
          </ul>
        </section>
        <section id="contact" className="section contact">
          <p className="eyebrow">Contact</p>
          <h2>Let&rsquo;s build something worth shipping.</h2>
          <p>
            Open to internships, junior developer opportunities, technical
            collaborations, and ambitious student projects.
          </p>
          <div className="actions">
            <a className="button" href={mailtoHref}>
              Email me
            </a>
            <a className="text-link" href={site.github}>
              View GitHub
            </a>
            <a
              className="text-link"
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a className="text-link" href={site.repositories}>
              Browse repositories
            </a>
          </div>
          <aside aria-label="Unavailable contact options">
            <p>
              Résumé download is not shown because a verified résumé file is not
              configured yet.
            </p>
            <code>resumePath: {String(unresolvedContent.resumePath)}</code>
          </aside>
        </section>
      </main>
      <footer>
        <p>{site.identity}</p>
        <p>{site.location}</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}