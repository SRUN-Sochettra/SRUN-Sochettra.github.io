import type { NextConfig } from "next";

const isExport = process.env.BUILD_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isExport
    ? { output: "export", images: { unoptimized: true } }
    : {
        async headers() {
          return [
            {
              source: "/world/frames/:path*",
              headers: [
                { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
