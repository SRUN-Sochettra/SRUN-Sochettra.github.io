# SRUN / Systems in Motion

An evidence-first portfolio for Srun Sochettra, built with Next.js App Router, TypeScript, semantic HTML, and minimal client JavaScript.

## Content model

The portfolio currently highlights seven differentiated projects in recruiter-oriented order:

1. SynapseDoc
2. Thnal Youth Association Management System
3. EggScan
4. Spring Boot Blog API
5. HyperspaceOS
6. RFID Access Control System
7. Hand Gesture Puzzle Game

Case studies can show status, role, context, ownership, verification, limitations, source visibility, live links, and real screenshots. Projects without verified images deliberately render without fabricated media.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm run typecheck
npm run build
BUILD_TARGET=gh-pages NEXT_PUBLIC_SITE_URL=https://chettra.is-a.dev npm run build
```

Before deployment, manually check keyboard navigation, mobile-menu focus restoration, 200% zoom, 360 px width, reduced motion, failed images, JavaScript-disabled navigation, every external link, and direct navigation to project routes.

## Adding evidence

Place real project screenshots under `public/projects/`, then set `evidence.image` and `evidence.imageAlt` in `data/portfolio.ts`. Do not use mockups or unverified claims.

A resume link is intentionally not included until the final PDF is present in `public/`. When available, use the stable path `public/srun-sochettra-resume.pdf` and expose it in the desktop navigation, mobile navigation, hero actions, and contact section.

## Deployment

GitHub Pages static export is enabled when `BUILD_TARGET=gh-pages`. The production origin is `https://chettra.is-a.dev`, a GitHub Pages custom domain set in repository settings (no `CNAME` file is committed). The workflow sets the canonical origin through `NEXT_PUBLIC_SITE_URL` and uses Node 24 with pinned top-level dependency versions. The default `srun-sochettra.github.io` hostname still redirects to the custom domain.
