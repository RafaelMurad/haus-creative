import "./globals.css";
import { Providers } from "../components/Providers";
import { Header, Footer } from "../components/layout";
import { siteConfig } from "@/config/site";
import { ReactNode } from "react";

export const metadata = {
  title: `${siteConfig.name} | Creative Direction + Design`,
  description: siteConfig.description,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-black font-sans overflow-x-hidden text-white antialiased">
        <Providers>
          {/* Skip to main content link for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
          >
            Skip to main content
          </a>
          <Header variant="transparent" />
          <main id="main-content" tabIndex={-1} className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
