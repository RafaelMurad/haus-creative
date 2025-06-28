import "./globals.css";
import Header from "../components/Header";
import { ReactNode } from "react";

export const metadata = {
  title: "Studio Haus | Creative Direction + Design",
  description: "Creative direction and design studio specializing in fashion, beauty, and lifestyle brands",
  keywords: "creative direction, design studio, fashion, beauty, lifestyle, branding",
  openGraph: {
    title: "Studio Haus | Creative Direction + Design",
    description: "Creative direction and design studio specializing in fashion, beauty, and lifestyle brands",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Haus | Creative Direction + Design",
    description: "Creative direction and design studio specializing in fashion, beauty, and lifestyle brands",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Separate viewport export to fix Next.js warnings
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <link rel="dns-prefetch" href="//images.pexels.com" />
        <link rel="preload" href="/assets/gallery1/Gallery1-1.png" as="image" />
      </head>
      <body
        className="min-h-screen bg-neutral-50 font-sans antialiased"
        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      >
        <Header />
        <main role="main">
          {children}
        </main>
        <a
          href="mailto:contact@studiohaus.com"
          className="fixed bottom-4 md:bottom-8 left-4 md:left-8 z-50 px-4 md:px-6 py-2 md:py-3 bg-white text-black hover:bg-white/90 transition-colors duration-300 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded shadow-lg"
          aria-label="Contact Studio Haus via email"
        >
          Contact
        </a>
      </body>
    </html>
  );
}