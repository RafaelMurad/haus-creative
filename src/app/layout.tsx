import "./globals.css";
import { Header } from "../components/layout";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { JsonLd } from "@/components/seo";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { ReactNode } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studiohauscreative.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | Creative Direction + Design`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "creative direction",
    "brand identity",
    "digital design",
    "luxury branding",
    "art direction",
    "visual design",
    "London creative agency",
    "São Paulo creative studio",
  ],
  authors: [{ name: "Studio Haus Creative" }],
  creator: "Studio Haus Creative",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Studio Haus Creative",
    title: `${siteConfig.name} | Creative Direction + Design`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Creative Direction + Design`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
        <body className="bg-white font-sans overflow-x-hidden text-black antialiased">
        <JsonLd type="organisation" />
        <JsonLd type="website" />
        <ErrorBoundary>
          {/* Skip to main content link for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="min-h-screen">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
