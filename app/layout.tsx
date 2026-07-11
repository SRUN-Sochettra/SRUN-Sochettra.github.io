import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/portfolio";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const hasSiteUrl = Boolean(configuredSiteUrl && configuredSiteUrl.length > 0);
const metadataBase = new URL(
  hasSiteUrl ? (configuredSiteUrl as string) : "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase,
  title: site.metaTitle,
  description: site.description,
  alternates: hasSiteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    title: site.metaTitle,
    description: site.ogDescription,
    type: "website",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#121515",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}