import "./globals.css";
import Header from "../components/Header";
import { ReactNode } from "react";
import { inter } from "../fonts/fonts";

export const metadata = {
  title: "Studio Haus | Creative Direction + Design",
  description: "Creative direction and design studio specializing in fashion, beauty, and lifestyle brands",
  keywords: "creative direction, design studio, fashion, beauty, lifestyle, branding",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#ffffff",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`min-h-screen bg-neutral-50 font-sans ${inter.className} antialiased`}
      >
        <Header />
        {children}
        <a
          href="mailto:contact@studiohaus.com"
          className="fixed bottom-4 md:bottom-8 left-4 md:left-8 z-50 px-4 md:px-6 py-2 md:py-3 bg-white text-black hover:bg-white/90 transition-colors duration-300 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded"
        >
          Contact
        </a>
      </body>
    </html>
  );
}