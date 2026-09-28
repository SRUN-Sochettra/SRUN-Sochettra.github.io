export const site = {
  name: "Srun Sochettra",
  title: "Backend & Full-Stack Developer",
  identity: "SRUN / Systems in Motion",
  location: "Phnom Penh, Cambodia",
  github: "https://github.com/SRUN-Sochettra",
  repositories: "https://github.com/SRUN-Sochettra?tab=repositories",
  linkedin: "https://www.linkedin.com/in/sochettra-srun-a67466395/",
  email: "srunsochettra@gmail.com",
  metaTitle: "Srun Sochettra — Backend & Full-Stack Developer",
  description: "Portfolio of Srun Sochettra, a backend and full-stack developer building practical systems with Java, Spring Boot, PostgreSQL, React, and applied AI.",
  ogDescription: "Java, Spring Boot, PostgreSQL, React, applied AI, and evidence-first software engineering.",
} as const;

export const principle = { lead: "Build from the real workflow.", detail: "Make state, failure, and evidence visible." } as const;
export const education = [
  "Information Technology, National University of Management — January 2025 - Present",
  "English, Institute of Foreign Languages — January 2025 - Present",
] as const;
export const bio = [
  "I build backend and full-stack systems with Java, Spring Boot, PostgreSQL, React, TypeScript, and applied AI.",
  "My work includes deployed AI document software, developer tools, a full-stack system built for a real Cambodian organization, computer vision, and embedded access control.",
] as const;

export type Feature = { title: string; desc: string };
export type Decision = { label: string; value: string };
export type ProjectEvidence = { overview: string; features?: readonly Feature[]; decisions?: readonly Decision[]; live?: string; credits?: string; image?: string; imageAlt?: string };
export type Project = {
  slug: string; name: string; category: string; summary: string; problem?: string;
  stack: readonly string[]; featured?: boolean; direct?: string; license?: string;
  status?: string; role?: string; context?: string; ownership?: readonly string[];
  verification?: readonly string[]; limitations?: readonly string[]; visibility?: string;
  evidence: ProjectEvidence;
};

export const projects: readonly Project[] = [
  {
    slug: "synapsedoc", name: "SynapseDoc", category: "Applied AI / RAG document system",
    summary: "A deployed document-research system with citation-grounded chat, multi-provider routing, reranking, streaming, and persistent conversations.",
    problem: "Make document research traceable by grounding answers in uploaded sources and preserving citations with the conversation.",
    stack: ["Next.js", "TypeScript", "Supabase", "Gemini", "Groq", "Mistral", "Cohere"], featured: true,
    direct: "https://github.com/SRUN-Sochettra/Research-AI", status: "Deployed", role: "Full-stack developer", context: "Personal applied-AI project",
    ownership: ["Document ingestion and retrieval", "Provider routing and streaming chat", "Conversation and citation persistence", "Deployment verification"],
    verification: ["Local format, type-check, lint, tests, and Next.js build passed", "A bounded production upload-to-chat flow was manually exercised"],
    limitations: ["Broad load and failover resilience remain unproven", "Scanned-PDF OCR remains Gemini-only with a single-page mapping limitation"],
    evidence: {
      live: "https://synapsedoc.explainable.md/",
      overview: "SynapseDoc uploads documents, retrieves relevant context, and streams citation-grounded answers. It routes across Gemini, Groq, and Mistral with bounded sequential fallback and uses Cohere reranking.",
      features: [
        { title: "Citation-grounded chat", desc: "Answers remain connected to retrieved document passages." },
        { title: "Bounded provider routing", desc: "Gemini, Groq, and Mistral use controlled sequential fallback." },
        { title: "Reranked retrieval", desc: "Cohere improves the ordering of retrieved context." },
        { title: "Streaming and persistence", desc: "SSE streams responses while Supabase stores documents, conversations, messages, and citations." },
      ],
      decisions: [
        { label: "Grounding", value: "Retrieved passages and citations are first-class response evidence." },
        { label: "Resilience", value: "Provider fallback is sequential and bounded." },
        { label: "Persistence", value: "Document, conversation, message, and citation state live in Supabase." },
      ],
    },
  },
  {
    slug: "thnal-youth-association-management-system", name: "Thnal Youth Association Management System", category: "Real-organization full-stack capstone",
    summary: "A database-management website developed as a full-stack course capstone for the Cambodian Youth Nursery Association.",
    problem: "Translate a real Cambodian organization's workflow into a usable database-backed management system.",
    stack: ["Full-stack web development", "Database management"], featured: true, status: "Course capstone completed", role: "Full-stack developer",
    context: "Team client project for the Cambodian Youth Nursery Association", visibility: "Private client project",
    ownership: ["Full-stack implementation", "Database-backed workflow development"],
    limitations: ["Source code is private", "No usage, scale, deployment, or business-impact claims are made"],
    evidence: {
      overview: "Built for the Cambodian Youth Nursery Association as a full-stack course capstone, this project was shaped around an external organizational workflow rather than invented only as a portfolio exercise.",
      features: [
        { title: "Real client context", desc: "Requirements were tied to the workflow of a Cambodian organization." },
        { title: "Database-backed system", desc: "The capstone centered on managing organizational information through a full-stack website." },
      ],
      decisions: [
        { label: "Evidence boundary", value: "No public-deployment, user-scale, or measured-impact claim is made." },
        { label: "Visibility", value: "Presented as private client work instead of linking to unavailable source." },
      ],
    },
  },
  {
    slug: "eggscan", name: "EggScan", category: "AI-powered developer analysis suite",
    summary: "A Spring Boot and React system for profile scanning, developer comparison, repository deep dives, commit analysis, README evaluation, and stack analysis.",
    problem: "Turn raw GitHub data into readable portfolio and repository feedback without hiding the technical evidence.",
    stack: ["Spring Boot", "React", "Groq", "GitHub GraphQL"], featured: true, direct: "https://github.com/SRUN-Sochettra/EggScan", license: "MIT",
    status: "Deployed", role: "Full-stack developer", context: "Personal project",
    ownership: ["Backend API and GitHub integration", "AI analysis flows", "Frontend experience and feature expansion"],
    limitations: ["Live provider behavior requires runtime verification; automated checks alone do not prove production reliability"],
    evidence: {
      live: "https://eggscan.0xlab.workers.dev/",
      overview: "EggScan has grown beyond a profile scorer into a developer-analysis suite with multiple reviewer personas and focused tools for profiles, repositories, commits, READMEs, and technology stacks.",
      features: [
        { title: "Profile scan", desc: "Analyzes GitHub profile and contribution data with readable scoring and feedback." },
        { title: "Developer battle", desc: "Compares two developer profiles through the same evidence-driven flow." },
        { title: "Repository deep dive", desc: "Examines a repository beyond top-level profile signals." },
        { title: "Focused analysis", desc: "Includes commit-message, README, and stack evaluation modes." },
        { title: "Reviewer personas", desc: "Offers multiple presentation styles for the analysis." },
      ],
      decisions: [
        { label: "Data", value: "GitHub GraphQL consolidates profile and repository evidence." },
        { label: "Backend", value: "Spring Boot owns integration and analysis orchestration." },
        { label: "AI boundary", value: "Model output is analysis, not verified fact about a developer." },
      ],
    },
  },
  {
    slug: "spring-boot-blog-api", name: "Spring Boot Blog API", category: "Backend REST API",
    summary: "A Java and Spring Boot API focused on explicit HTTP contracts, persistence, validation, and maintainable backend structure.",
    stack: ["Java", "Spring Boot", "PostgreSQL", "REST APIs"], direct: "https://github.com/SRUN-Sochettra/Spring-Boot---API-Blog",
    role: "Backend developer", context: "Personal learning project",
    evidence: { overview: "A backend project for practicing Spring Boot API design, database persistence, validation, and predictable HTTP responses.", features: [
      { title: "REST contracts", desc: "Routes expose explicit request and response behavior." },
      { title: "Persistence", desc: "Blog data is stored through a database-backed application layer." },
    ] },
  },
  {
    slug: "hyperspace-os", name: "HyperspaceOS", category: "Browser desktop experiment",
    summary: "An experimental browser-based desktop environment focused on interaction design and reusable interface systems.",
    stack: ["React", "TypeScript", "Web interfaces"], direct: "https://github.com/SRUN-Sochettra/HyperspaceOS", license: "MIT",
    role: "Frontend developer", context: "Personal experimental project",
    evidence: { live: "https://hyperspace.starlang.net/", overview: "HyperspaceOS explores a desktop-like interface in the browser through windows, applications, navigation, and reusable interaction patterns.", features: [
      { title: "Desktop metaphor", desc: "Organizes browser interactions through a multi-window environment." },
      { title: "Reusable interface system", desc: "Treats windows and applications as composable UI structures." },
    ] },
  },
  {
    slug: "rfid-access-control", name: "RFID Access Control System", category: "Embedded systems",
    summary: "A Raspberry Pi Pico and MicroPython access-control project using RFID input and OLED feedback.",
    stack: ["Raspberry Pi Pico", "MicroPython", "RFID", "OLED"], role: "Embedded software developer", context: "Academic hardware project",
    evidence: { overview: "An embedded access-control prototype that reads RFID credentials and communicates system state through an OLED display.", features: [
      { title: "RFID input", desc: "Reads physical credentials through an RFID module." },
      { title: "Device feedback", desc: "Shows access-control state on an OLED display." },
    ] },
  },
  {
    slug: "hand-gesture-puzzle", name: "Hand Gesture Puzzle Game", category: "Computer vision game",
    summary: "A webcam puzzle controlled through real-time hand tracking, pinch gestures, moving targets, and progressive levels.",
    stack: ["Python", "OpenCV", "MediaPipe"], direct: "https://github.com/SRUN-Sochettra/Hand-Gesture-Puzzle-Game", license: "MIT",
    role: "Team developer", context: "Academic team project",
    evidence: { credits: "Srun Sochettra, Tep Makara & Sar Chanrithy", overview: "A webcam-based puzzle game controlled with real-time hand gestures across five levels.", features: [
      { title: "Real-time tracking", desc: "MediaPipe Hands reads webcam landmarks frame by frame." },
      { title: "Pinch interaction", desc: "Thumb-index distance drives grabbing and dropping." },
      { title: "Progressive levels", desc: "Targets become smaller and move faster across five levels." },
    ], decisions: [
      { label: "Vision", value: "OpenCV capture with MediaPipe Hands." },
      { label: "Structure", value: "Responsibilities are split across game, vision, renderer, and configuration modules." },
    ] },
  },
];

export const capabilityGroups = [
  { name: "Backend systems", items: ["Java", "Spring Boot", "MyBatis", "PostgreSQL", "REST APIs"] },
  { name: "Interfaces", items: ["React", "TypeScript", "Responsive interfaces", "Accessibility"] },
  { name: "Applied AI & hardware", items: ["RAG", "Gemini", "Groq", "Mistral", "Cohere", "Python", "MicroPython", "Computer Vision"] },
  { name: "Engineering practice", items: ["Git", "GitHub Actions", "Docker", "SonarQube", "Documentation", "Database design"] },
] as const;
