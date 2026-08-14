
export const site = {
  name: "Srun Sochettra",
  title: "Full-Stack Developer & Information Technology Student",
  identity: "SRUN / Systems in Motion",
  location: "Phnom Penh, Cambodia",
  github: "https://github.com/SRUN-Sochettra",
  repositories: "https://github.com/SRUN-Sochettra?tab=repositories",
  linkedin: "https://www.linkedin.com/in/sochettra-srun-a67466395/",
  email: "srunsochettra@gmail.com",
  metaTitle: "Srun Sochettra — Full-Stack Developer",
  description:
    "Portfolio of Srun Sochettra, a full-stack developer and Information Technology student building backend systems, modern web applications, AI-powered tools, and experimental software.",
  ogDescription:
    "Java, Spring Boot, React, PostgreSQL, AI tools, computer vision, and practical full-stack engineering.",
} as const;

export const principle = {
  lead: "Build from the real workflow.",
  detail: "Make state, failure, and evidence visible.",
} as const;

export const bio = [
  "I’m an Information Technology student in Phnom Penh focused on Java and Spring Boot backends, PostgreSQL, and full-stack web applications with React and TypeScript.",
  "My projects also explore AI-powered developer tools, document retrieval, computer vision, and embedded systems — carried from data models and API contracts through to readable, accessible interfaces.",
] as const;

export type Feature = { title: string; desc: string };
export type Decision = { label: string; value: string };
export type ProjectEvidence = {
  overview: string;
  features?: readonly Feature[];
  decisions?: readonly Decision[];
  live?: string;
  credits?: string;
  image?: string;
  imageAlt?: string;
};
export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  problem?: string;
  stack: readonly string[];
  featured?: boolean;
  direct?: string;
  license?: string;
  evidence: ProjectEvidence;
};

export const projects: readonly Project[] = [
  {
    slug: "eggscan",
    name: "EggScan",
    category: "AI-powered developer tool",
    summary: "A developer tool combining GitHub data, language models, and human-readable output.",
    problem: "Turn a raw GitHub profile into a scored, readable audit with both a roast and constructive feedback.",
    stack: ["Spring Boot", "React", "Groq", "GitHub GraphQL"],
    featured: true,
    direct: "https://github.com/SRUN-Sochettra/EggScan",
    license: "MIT",
    evidence: {
      live: "https://eggscan.vercel.app",
      overview: "EggScan instantly scans, audits, and analyzes any GitHub profile with Groq-powered AI, grading it on a 0–100 Egg Score and returning both a humorous roast and professional, constructive feedback.",
      features: [
        { title: "GitHub profile extraction", desc: "Fetches bio, pinned repositories, language distribution, and real-time contribution statistics." },
        { title: "GraphQL-optimized queries", desc: "Retrieves deep metrics in a single network round-trip via GitHub's GraphQL API." },
        { title: "Groq-powered AI audit", desc: "Runs LLMs on Groq's high-speed inference engine to analyze portfolio strength and coding patterns." },
        { title: "Egg Verdict system", desc: "Five egg-themed verdicts from Golden Egg (80–100) down to Scrambled (0–24)." },
        { title: "Technical verdict", desc: "Combines a light-hearted roast with actionable feedback on quality and presentation." },
        { title: "Glassmorphic dashboard", desc: "Dark-themed Vite + Tailwind UI with interactive feedback cards and live loaders." },
      ],
      decisions: [
        { label: "Architecture", value: "Monorepo with a decoupled Spring Boot 3.3.4 (Java 21) backend and a Vite + React frontend." },
        { label: "Endpoints", value: "/api/scan for analysis and /api/health for readiness checks." },
        { label: "Configuration", value: "GITHUB_TOKEN bypasses rate limits; GROQ_API_KEY drives fast LLM queries." },
      ],
    },
  },
  {
    slug: "hyperspace-os",
    name: "HyperspaceOS",
    category: "Browser-based operating system",
    summary: "A web-based desktop environment running entirely in the browser, with a persistent virtual file system, multi-window management, and a suite of built-in applications.",
    problem: "Recreate a full desktop OS — windows, file system, terminal, apps — using only the browser.",
    stack: ["Vanilla JavaScript", "Canvas", "Three.js", "Vite"],
    featured: true,
    direct: "https://github.com/SRUN-Sochettra/HyperspaceOS",
    license: "MIT",
    evidence: {
      live: "https://hyperspace-os.vercel.app",
      overview: "HyperSpace OS is a fully functional, glassmorphism-styled desktop environment running entirely in the browser, built with Vanilla JavaScript and Canvas around a virtual file system and a real window manager.",
      features: [
        { title: "Window manager", desc: "Multi-window interface with drag, resize, stack, workspaces, and Spotlight search (Alt + Space)." },
        { title: "Virtual file system", desc: "LocalStorage-persisted CRUD over a Unix-like /, home, usr, etc structure." },
        { title: "Built-in app suite", desc: "Terminal, CodeMirror 6 editor, file explorer, task manager, whiteboard, music player, and system monitor." },
        { title: "Terminal shell", desc: "27+ Unix-like commands including ls, cd, mkdir, top, and neofetch." },
        { title: "Three.js visuals", desc: "GPU-accelerated particle backgrounds, a theme engine, and 60 FPS transitions." },
      ],
      decisions: [
        { label: "Core", value: "Vanilla JavaScript (ES6+ modules) with a custom-built window manager and UI kit." },
        { label: "Graphics", value: "Three.js backgrounds over HTML5 Canvas; uPlot for data visualization." },
        { label: "Editor", value: "CodeMirror 6 with Marked for Markdown rendering." },
        { label: "Build", value: "Vite." },
      ],
    },
  },
  {
    slug: "research-ai",
    name: "Research AI",
    category: "Document workflow",
    summary: "A retrieval and citation-oriented document workflow with human-readable output.",
    problem: "Read uploaded PDFs and answer questions with grounded, page-level citations.",
    stack: ["Next.js", "TypeScript", "LangChain", "Supabase", "RAG"],
    featured: true,
    direct: "https://github.com/SRUN-Sochettra/Research-AI",
    license: "MIT",
    evidence: {
      overview: "Research AI uses autonomous agents to read uploaded PDFs, summarize them, and answer questions with page-level citations — combining a document-processing pipeline with a RAG pipeline over pgvector.",
      features: [
        { title: "PDF agent pipeline", desc: "Parses, smart-chunks, embeds, indexes, and summarizes any uploaded PDF automatically." },
        { title: "Cited answers", desc: "RAG over pgvector retrieves top-k chunks and streams answers with page-level citations." },
        { title: "Graceful degradation", desc: "A multi-model fallback chain keeps the pipeline alive when a model is rate-limited." },
        { title: "Row-level isolation", desc: "Supabase RLS isolates every user's documents and vectors at the database level." },
        { title: "Observability", desc: "Langfuse traces LLM calls for latency and cost; structured JSON logging in production." },
      ],
      decisions: [
        { label: "Vector DB", value: "Supabase pgvector — avoids an extra service and lets RLS cover vectors too." },
        { label: "LLM", value: "Google Gemini Flash Lite with an automatic fallback chain to stay within free-tier limits." },
        { label: "Chunking", value: "Per-page + recursive splitting to preserve accurate page citations." },
        { label: "Streaming", value: "Server-Sent Events for simpler serverless compatibility." },
        { label: "Testing", value: "Vitest unit tests and Playwright E2E in a GitHub Actions pipeline." },
      ],
    },
  },
  {
    slug: "full-stack-portfolio",
    name: "Personal Full-Stack Portfolio",
    category: "Full-stack system",
    summary: "A database-backed portfolio carried from backend services to a modern interface.",
    stack: ["React", "Spring Boot", "PostgreSQL"],
    direct: "https://github.com/SRUN-Sochettra/Portfolio",
    license: "MIT",
    evidence: {
      live: "https://srunsochettra.vercel.app",
      overview: "A personal portfolio engineered with a Spring Boot REST API, a React interface, and a serverless PostgreSQL layer — featuring a dark-mode glassmorphism UI and interactive OpenAPI documentation.",
      features: [
        { title: "Production REST API", desc: "Spring Boot 3.2.4 service with a service layer, JPA repositories, and a global exception handler." },
        { title: "Serverless database", desc: "PostgreSQL 16 on Neon (or local Docker) with profiles, projects, skills, and contact_messages tables." },
        { title: "Contact submissions", desc: "POST /api/contact_messages validates and persists visitor messages." },
        { title: "Interactive API docs", desc: "SpringDoc OpenAPI exposes Swagger UI at /swagger-ui.html." },
        { title: "Animated interface", desc: "React 19 + Vite 7 + Tailwind v4 client with Framer Motion and React Router v7." },
        { title: "CI/CD pipeline", desc: "GitHub Actions with Vercel (frontend) and Render (backend) deployment." },
      ],
      decisions: [
        { label: "Client", value: "React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · Framer Motion · React Router v7." },
        { label: "Server", value: "Spring Boot 3.2.4 · Java 21 · Spring MVC · Spring Data JPA · Jakarta Validation." },
        { label: "Data", value: "PostgreSQL 16 via HikariCP — Neon serverless in production, Docker Compose locally." },
        { label: "API", value: "GET /api/profile · /api/projects · /api/skills · POST /api/contact_messages." },
      ],
    },
  },
  {
    slug: "khmer-banking",
    name: "Khmer Banking",
    category: "Full-stack application",
    summary: "A database-backed application designed around a practical financial workflow.",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "KHQR"],
    direct: "https://github.com/SRUN-Sochettra/Khmer-Banking",
    license: "MIT",
    evidence: {
      overview: "A full-stack digital banking application with deep Bakong KHQR integration for the Cambodian market — managing balances, transfers, and spending behind secure authentication flows.",
      features: [
        { title: "Bakong KHQR", desc: "Generate and scan Bakong-compatible KHQR codes for payments in the Cambodian market." },
        { title: "Secure transfers", desc: "Peer-to-peer transfers and external account management." },
        { title: "Dynamic dashboard", desc: "Real-time balance, spending trends, and recent activity with Recharts analytics." },
        { title: "PDF statements", desc: "Generate and download professional statements of transaction history." },
        { title: "Auth flows", desc: "NextAuth.js v5 authentication with OTP verification and password reset." },
        { title: "Dark mode", desc: "Fully responsive design with native dark-mode support." },
      ],
      decisions: [
        { label: "Framework", value: "Next.js 15+ App Router with TypeScript and Tailwind CSS 4." },
        { label: "Data", value: "PostgreSQL on Neon via Prisma ORM." },
        { label: "Auth", value: "NextAuth.js v5 with OTP and password-reset flows." },
        { label: "UI & email", value: "Shadcn UI + Radix primitives; Resend for transactional email." },
      ],
    },
  },
  {
    slug: "spring-boot-blog-api",
    name: "Spring Boot Blog API",
    category: "Backend API",
    summary: "A Spring Boot backend centered on persistence, validation, authentication concepts, and API boundaries.",
    stack: ["Spring Boot", "JWT", "MyBatis", "PostgreSQL", "Pinata IPFS"],
    direct: "https://github.com/SRUN-Sochettra/Spring-Boot---API-Blog",
    evidence: {
      overview: "A REST API for a blog backend built with Spring Boot, centered on JWT authentication, PostgreSQL persistence, MyBatis data access, and Pinata IPFS file uploads.",
      features: [
        { title: "JWT authentication", desc: "Token-based authentication securing the blog API endpoints." },
        { title: "PostgreSQL persistence", desc: "Relational storage for the blog's data." },
        { title: "MyBatis data access", desc: "SQL-mapper–based persistence layer over PostgreSQL." },
        { title: "Pinata IPFS uploads", desc: "File uploads stored on IPFS via Pinata." },
      ],
    },
  },
  {
    slug: "hand-gesture-puzzle",
    name: "Hand Gesture Puzzle Game",
    category: "Computer vision",
    summary: "An experimental gesture-controlled interface connecting browser logic with camera input.",
    stack: ["Python", "OpenCV", "MediaPipe"],
    direct: "https://github.com/SRUN-Sochettra/Hand-Gesture-Puzzle-Game",
    license: "MIT",
    evidence: {
      credits: "Srun Sochettra, Tep Makara & Sar Chanrithy",
      overview: "A webcam-based puzzle game controlled with real-time hand gestures: pinch to grab a shape, drag it across the screen, and drop it onto a matching moving target across five progressive levels.",
      features: [
        { title: "Real-time hand tracking", desc: "MediaPipe Hands reads webcam landmarks frame by frame." },
        { title: "Pinch to grab", desc: "Thumb–index distance, normalized by hand size, drives intuitive grab and drop." },
        { title: "5 progressive levels", desc: "From static targets to smaller shapes with fast diagonal XY movement." },
        { title: "Live HUD", desc: "Hand-speed meter and FPS display with in-game restart and next-level controls." },
        { title: "Tunable gameplay", desc: "Pinch sensitivity, cursor smoothing, snap distance, and target speed configurable in config.py." },
      ],
      decisions: [
        { label: "Vision", value: "OpenCV capture with MediaPipe Hands (pinned 0.10.21 for the legacy solutions API)." },
        { label: "Structure", value: "Split across main, config, game, vision, and renderer modules." },
        { label: "Runtime", value: "Python 3.11 with a webcam; cross-platform on Windows / macOS / Linux." },
      ],
    },
  },
];

export const capabilityGroups = [
  { name: "Backend systems", items: ["Java", "Spring Boot", "MyBatis", "PostgreSQL", "REST APIs"] },
  { name: "Interfaces", items: ["React", "TypeScript", "Responsive interfaces", "Accessibility"] },
  { name: "Applied AI & hardware", items: ["Groq", "GitHub GraphQL", "RAG", "Python", "MicroPython", "Computer Vision"] },
  { name: "Engineering practice", items: ["Git", "GitHub Actions", "Docker", "SonarQube", "Documentation", "Database design"] },
] as const;
