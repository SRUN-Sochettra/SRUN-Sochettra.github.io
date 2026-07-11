# SRUN / Systems in Motion

Desktop-first, mobile-beta Next.js portfolio with a placeholder-first seven-scene scroll journey.

## Run

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin. Video files are intentionally absent until the production pipeline succeeds. The client keeps SVG posters when clips fail.

## Media production

```bash
production/scripts/check-tools.sh
production/scripts/generate-stills.sh
production/scripts/generate-legs.sh
production/scripts/encode-desktop.sh
production/scripts/encode-mobile.sh
production/scripts/verify-media.sh
```

If authentication is unavailable, run `higgsfield auth login`. The scripts inspect CLI help before using generation flags and stop if the installed schema differs.
