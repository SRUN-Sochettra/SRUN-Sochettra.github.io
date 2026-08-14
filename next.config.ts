
import type { NextConfig } from "next";

const isGitHubPages = process.env.BUILD_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
