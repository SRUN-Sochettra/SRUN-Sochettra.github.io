import type { Metadata, Viewport } from "next";
import { Anybody, Geist, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/portfolio";
import MotionDirector from "@/components/motion-director";

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
    // `no-js` is removed by MotionDirector on hydration, which releases the
    // no-script navigation fallback declared in globals.css.
    <html lang="en" className={`no-js ${identity.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
        <MotionDirector />
      </body>
    </html>
  );
}