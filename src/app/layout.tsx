import "./globals.css";
import Header from "../components/Header";
import { ReactNode } from "react";
import { inter } from "../fonts/fonts";

export const metadata = {
  title: "Studio Haus | Creative Direction + Design",
  description: "Creative direction and design studio",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-neutral-50 font-sans ${inter.className}`}
      >
        <Header />
        {children}
        <a
          href="mailto:contact@studiohaus.com"
          className="fixed bottom-8 left-8 z-50 px-6 py-3 bg-white text-black hover:bg-white/90 transition-colors duration-300"
        >
          Contact
        </a>
      </body>
    </html>
  );
}
