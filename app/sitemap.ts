
import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [{ url: origin }, ...projects.map((project) => ({ url: `${origin}/projects/${project.slug}` }))];
}
