# Motion redesign — implementation and verification report

## Changed

- `app/page.tsx` — the redesign had overwritten the homepage with a copy of the case-study
  component, so `/` rendered Next's 404 error document (`__next_error__`, `noindex`) while
  every gate still exited 0. Restored the homepage from `HEAD` and wired it to the redesign:
  `data-reveal` hooks (`hero-copy`, `hero-mark`, `system`, `quote`, `heading`, `ledger`,
  `profile`, `contact`), the `.identity__mark-stage` wrapper the motion CSS targets, and a
  per-step `--trace-index` for the staggered system trace.
- `app/page.tsx`, `components/project-index.tsx` — project P-numbers are now derived from each
  project's 1-based position in `data/portfolio.ts` instead of a hardcoded `startNumber`. The
  homepage previously numbered the ledger P-02…P-07 while the case studies numbered P-01…P-07,
  so SynapseDoc read "P–02" on the index and "P–01" on its own case study. `ProjectIndex` now
  takes `numbers`, and the `role="list"`/`role="listitem"` overrides were dropped: they were
  invalid ARIA on a link element and suppressed the native link role.
- `components/motion-director.tsx` (new) — IntersectionObserver reveal director. Two real
  defects were found and fixed during verification:
  - It ran once at layout mount, so on client-side navigation to a case study the new
    `[data-reveal]` nodes were never observed. It now re-scans on `usePathname()` change.
  - IntersectionObserver never reports an element it did not see intersect, so a restored
    scroll position, an in-page anchor, or a programmatic jump could strand a section
    permanently at `opacity: 0`. A rAF-throttled scroll/resize sweep guarantees reveals are
    monotonic. `reveal()` also clears `is-entering` so the hidden baseline stops competing.
  - Removes the `no-js` class on hydration, releasing the no-script navigation fallback.
- `app/globals.css` — two fixes. (1) The ledger hover/focus accent used `--signal`
  (`#bd3024`) on the inverted `--ink` row: 3.13:1, below WCAG AA for body text. Changed to
  `#ff796c` (7.1:1), matching the existing contact-sheet hover accent. (2) Added a `html.no-js`
  block so small screens keep navigation when JavaScript is unavailable: without it the
  JS-only Menu button left no way to navigate at all under 700px.
- `app/layout.tsx` — mounts `MotionDirector` and applies the `no-js` class on `<html>`.
- `app/projects/[slug]/page.tsx` — the per-route `openGraph` object replaced the layout one
  outright, so every case study shipped a social card with no `og:image` and
  `twitter:card="summary"`. Added `images: ["/opengraph-image"]`.
- `app/projects/[slug]/page.tsx`, `app/page.tsx`, `components/project-index.tsx` —
  `prefetch={false}` on internal `Link`s. In a static export the per-route RSC payload is
  emitted nested but requested flat, so the speculative fetch always 404'd and logged a
  console error. Navigation falls back to the pre-rendered `index.txt` and works.
- `app/icon.svg` (new) — the export referenced no icon, so every page load logged a
  `favicon.ico` 404.
- `data/portfolio.ts`, `.env.example`, `README.md`, `next-env.d.ts` — restored trailing
  newlines only. No content change.

## Verification

Graft v0.10.1 (`graft map`, then one `graft ask --source`): ~13,526 tokens saved across both calls.

- `npm install --no-audit --no-fund` — clean, `up to date`, exit 0. Lockfile tracked and current.
- `npm run lint` — exit 0, no errors or warnings.
- `npm run typecheck` — exit 0.
- `npm run build` — exit 0, 14 static routes.
- `BUILD_TARGET=gh-pages NEXT_PUBLIC_SITE_URL=https://chettra.is-a.dev npm run build` —
  exit 0. All 7 project routes plus home, 404, robots, sitemap, Open Graph image, and icon
  confirmed by inspecting `out/`. Route-specific canonicals correct on every page; sitemap
  lists home + all 7 projects in `data/portfolio.ts` order; robots allows crawling; no
  `localhost` anywhere in the export; project order matches the data file.
- Browser QA — Playwright 1.63.0 driving Chromium 1234 against the real `out/` export served
  over HTTP with a directory-index + 404-fallback server (not the dev server). 76/76 checks
  passed at 1440×900, 360×800, 834×1112, 720×450 @2× (200% zoom equivalent), plus reduced-motion,
  JavaScript-disabled, and touch-device contexts. Covered the mobile dialog (focus in, Tab and
  Shift+Tab trapped, Escape closes, focus returns to trigger, scroll restored), keyboard
  reachability of every link with visible focus, skip link, back navigation, reveal
  completeness after scroll and after client-side nav, fine-pointer-only hero response,
  horizontal overflow, and console/network cleanliness.

## Production domain

The canonical production origin is `https://chettra.is-a.dev`, a GitHub Pages custom domain
configured in repository settings; no `CNAME` file is committed and none is required. The
default `srun-sochettra.github.io` hostname 301-redirects to it, so the two are not competing
canonicals. `NEXT_PUBLIC_SITE_URL` in `.env.example` and `.github/workflows/deploy.yml` is the
single source for the homepage canonical, the per-project canonicals, and the sitemap origin.
`app/layout.tsx` and `app/sitemap.ts` read that variable and fall back to `http://localhost:3000`
for local development; neither hardcodes a hostname, so no code change was required.

## Evidence boundary

Every project in `data/portfolio.ts` has no `evidence.image`, so the ledger renders intentional
typographic proof panels rather than broken media. No screenshot, metric, or claim was invented.
Verification covered rendering, interaction, accessibility, and static-export integrity; it does
not attest to the real-world claims in the portfolio content, which were preserved as authored.

## Known limits

- The GH Pages export emits per-route RSC payloads at a nested path while the client requests a
  flat one. Suppressing the speculative fetch removes the console error; a project page opened
  directly still loads correctly from `index.html`.
- `npx playwright install chromium` exceeded a 15-minute timeout in this environment. QA ran
  against the Chromium build already present in the local Playwright cache. Playwright was
  installed with `--no-save` for QA only and removed afterwards; `package.json` and
  `package-lock.json` contain no trace of it.
