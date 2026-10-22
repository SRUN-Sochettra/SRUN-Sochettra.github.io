# SRUN / Systems in Motion

**A software-engineering portfolio built around project evidence, interactive case studies and explicit limitations.**

[View the portfolio](https://chettra.is-a.dev) · [GitHub profile](https://github.com/SRUN-Sochettra)

This repository contains the Next.js portfolio itself, not the backend systems, AI providers or hardware projects it describes. Its case-study experiences are authored browser illustrations, not live connections to those systems.

## Inside the portfolio

- An editorial homepage with EggScan as the flagship and a linked project catalogue.
- Seven data-driven case studies covering document research, client work, developer tooling, backend APIs, browser interfaces, embedded systems and computer vision.
- Project-specific interactive walkthroughs with selectable stages and scroll-driven presentation.
- A desktop case navigator with persisted positioning, section tracking and retraction.
- Generated metadata, Open Graph image, robots and sitemap routes.
- Conditional static export and a GitHub Actions Pages workflow.

Project descriptions, ownership, links, verification statements and limitations live in [data/portfolio.ts](data/portfolio.ts). They are authored evidence records, not automatically checked claims. No new project outcomes, metrics or screenshots are introduced by this documentation.

## Stack

The supplied package manifest declares Next.js 16.3.6, React 19.3.0 and TypeScript 6.0.3. Node >=22 is required by the manifest; the deployment workflow selects Node 24. Styling uses the project stylesheet, with browser APIs and React client components for interaction. These are source declarations, not a dependency compatibility assessment.

## Run locally

From the original checkout, using a supported Node installation and npm:

```sh
npm install
npm run dev
```

The source includes [.env.example](.env.example) with NEXT_PUBLIC_SITE_URL set to the intended production origin. Copy it to .env.local when you want that origin used for local metadata generation. Without it, metadataBase and sitemap use the local-development fallback. This variable is public configuration, not a secret.

Fonts are loaded through next/font/google. Dependency installation and font retrieval may require network access. No separate database, API key or backend service is configured for this portfolio.

## Build and deployment

```sh
npm run lint
npm run typecheck
npm run build
```

The ordinary build does not enable static export. For the existing Pages target, PowerShell:

```powershell
$env:BUILD_TARGET = "gh-pages"
$env:NEXT_PUBLIC_SITE_URL = "https://chettra.is-a.dev"
try { npm run build } finally {
    Remove-Item Env:BUILD_TARGET
    Remove-Item Env:NEXT_PUBLIC_SITE_URL
}
```

Use a fresh shell if you need to preserve existing values: this example removes both variables afterwards.

POSIX equivalent:

```sh
BUILD_TARGET=gh-pages NEXT_PUBLIC_SITE_URL=https://chettra.is-a.dev npm run build
```

[next.config.ts](next.config.ts) enables output export, unoptimised images and trailing slashes for this target. The workflow builds out/ after lint/type checks and publishes it through Pages on pushes to main or manual dispatch. npm start invokes next start; it is not the serving command for the exported out/ directory.

Keep the repository name **srun-sochettra.github.io** for the current user-site arrangement. GitHub documents the username.github.io naming requirement for user sites: [GitHub Pages setup](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). The supplied workflow targets the custom production origin above. Domain settings, DNS, redirects and current deployment health were not independently checked in this refresh.

## Source map

| Path | Responsibility |
| --- | --- |
| app/page.tsx | Homepage and flagship selection |
| app/projects/[slug]/page.tsx | Static project routes and case-study sections |
| data/portfolio.ts | Identity, project records and evidence boundaries |
| components/experience-director.tsx | Active reveal and scroll effects |
| components/project-index.tsx | Project cards and dossier transitions |
| components/case-navigator.tsx | Desktop section navigator |
| app/globals.css | Visual system, responsive rules and motion |
| .github/workflows/deploy.yml | Pages build and publication |

The root layout mounts ExperienceDirector, not the separate MotionDirector component. Historical implementation reports describe earlier snapshots; do not treat them as current test results or execute old cleanup guides without reviewing their effects.

## Updating content

Edit the central project records and preserve the distinction between implemented features, reported verification and remaining limitations. Keep private client source private. Add only real, approved screenshots with accurate alternative text. The current data supplies no evidence.image values; the homepage uses a live/source fallback and case posters are conditional.

Do not add a resume link until the actual approved asset exists. Review project source URLs after repository renames, without changing stable case-study slugs unnecessarily.

## Verification boundary

This refresh inspected source and configuration only. It did not install dependencies, compile, run lint/type checks, execute browser tests or inspect the deployed site. No test script is declared in the supplied package manifest. A lockfile was not included in this Repomix snapshot, so its presence and contents in the original checkout were not verified.

Before release, inspect the exported homepage for real content rather than a 404/noindex document. Exercise direct project routes, Back/Forward navigation, keyboard controls, mobile menu, reduced motion, zoom, storage restrictions and JavaScript-disabled behaviour. Source-level fallbacks do not prove those scenarios work.

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md) and [refresh notes](docs/repository-refresh.md).

## Licence

No root project licence file is supplied in this snapshot. Licences attributed to individual showcased projects do not license this portfolio. This refresh assigns none.
