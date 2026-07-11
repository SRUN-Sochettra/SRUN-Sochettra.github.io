# SRUN / Systems in Motion

This is the portfolio site of Srun Sochettra, a full-stack developer and Information Technology student based in Phnom Penh, Cambodia. The project is built using Next.js, React, Tailwind CSS, and TypeScript.

It features a scroll-driven, seven-scene interactive journey styled as a low-poly cinematic miniature world.

---

## Architecture & Core Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19.
- **Styling:** Tailwind CSS v4 using `@tailwindcss/postcss`.
- **Language:** TypeScript for type safety.
- **Scroll Engine:** Custom HTML5 Canvas renderer (`components/scroll-world.tsx`) that scrubs through 96 pre-cached WebP frames per scene.
- **Data Layer:** Static portfolio definitions and evidence-based project logs (`data/portfolio.ts`).
- **Optimization:** Dynamic route pre-rendering (`generateStaticParams`), SEO metadata, automated sitemaps, and custom caching headers for static frames.

---

## Interactive Canvas Engine

The homepage centers on the `ScrollWorld` component, which maps the page scroll position to a 96-frame sequence for each of the seven scenes.

- **Pre-caching:** WebP frames are pre-loaded in memory to ensure smooth scrub actions.
- **Fallback Posters:** If the browser fails to load frame sequences or is running on a slow connection, it displays vector SVG stills (`public/world/stills/*.svg`).
- **Performance Constraints:** 
  - Framerate paint operations are throttled via `requestAnimationFrame`.
  - Resolution adapts to device pixel density up to a maximum cap of 2.0 (`DPR_CAP`).
  - Native `prefers-reduced-motion` settings are respected, locking the canvas to static still images instead of scroll scrubbing.

### The Seven Journey Scenes
1. **Origin:** Phnom Penh technical studio and student workstation.
2. **Backend Engineering:** Relational databases, Spring Boot APIs, and system boundaries.
3. **Full-Stack Systems:** Responsive interfaces backed by structured database schemas.
4. **Applied AI:** Document workflows with Retrieval-Augmented Generation (RAG) and citations.
5. **Physical Computing:** Computer vision experiments and Raspberry Pi Pico controllers.
6. **Engineering Practice:** GitHub automation, CI/CD pipelines, and public repositories.
7. **Contact:** Dynamic links to email, GitHub, and LinkedIn.

---

## Media Production Pipeline

The assets for the scroll journey are produced sequentially using Higgsfield CLI generation tools and FFmpeg processing scripts. The assets are located under `production/`.

### Configuration & Brand Rules
- **Styling (`production/brand-kit.md`):** Low-poly geometry, warm late-afternoon Southeast Asian lighting, graphite structures, and a distinct mineral color palette. No human figures, text, or logos.
- **Manifest (`production/scene-manifest.json`):** Tracks the scene hierarchy, camera motions, and generation models.

### Scripts Pipeline
Run the scripts in order from the project root:

1. **`production/scripts/check-tools.sh`**
   Ensures `higgsfield`, `ffmpeg`, `ffprobe`, and `python3` are in the system PATH and verifies Higgsfield CLI authorization.
   
2. **`production/scripts/generate-stills.sh`**
   Generates a conditioning still image for each scene from text prompts under `production/prompts/*-still.txt` using the `gpt_image_2` model.
   
3. **`production/scripts/generate-legs.sh`**
   Creates 4-second video segments (legs) from `production/prompts/*-video.txt` using the `seedance_2_0` model. It establishes motion continuity by feeding the final frame of the previous video leg as the starting frame for the next leg.
   
4. **`production/scripts/encode-desktop.sh`**
   Removes audio, applies an unsharp mask filter, and encodes the raw video legs to H.264 MP4 format with a keyframe interval of 8 (GOP 8) for responsive canvas scrub transitions on desktop browsers.
   
5. **`production/scripts/encode-mobile.sh`**
   Scales down the legs to fit a mobile screen (maximum 1280x720), scales down bitrate targets, and uses a tighter keyframe interval of 4 (GOP 4) to accommodate mobile memory limits.
   
6. **`production/scripts/verify-media.sh`**
   Uses `ffprobe` to verify that all encoded files have valid video streams, conform to viewport dimensions, and contain no audio tracks.

### Seam QA Checklist
Before deploying updates, review the media properties against `production/qa/seam-checklist.md`:
- Verify leg N+1 was conditioned from the final frame of leg N.
- Check that there is no camera direction or speed reversal at handoff points.
- Confirm desktop files use native resolution and GOP 8; mobile uses ≤720p and GOP 4.
- Verify the video contains no audio and has faststart optimization enabled.

---

## Development Setup

### Prerequisites
- **Node.js:** LTS version recommended.
- **Higgsfield CLI:** Required only for running the media generation pipeline.
- **FFmpeg & Python 3:** Required for transcoding and validating video files.

### Installation
Install the project dependencies:
```bash
npm install
```

### Local Dev Server
Run the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Production Environment Variables
Create a `.env` or set environment variables in your hosting provider:
- `NEXT_PUBLIC_SITE_URL`: Set to the canonical production origin (e.g., `https://srun-portfolio.com`). If not set, it defaults to `http://localhost:3000` for metadata bases and site indexes.

### Project Verification
To run code linting and TypeScript checks before committing:
```bash
npm run lint
npm run typecheck
```
