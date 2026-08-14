
import type { Metadata, Viewport } from "next";
import { Anybody, Geist, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/portfolio";

const identity = Anybody({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: "--font-identity",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const metadataBase = new URL(configuredSiteUrl || "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: site.metaTitle,
  description: site.description,
  alternates: configuredSiteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    title: site.metaTitle,
    description: site.ogDescription,
    type: "website",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#f0ede5", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${identity.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
