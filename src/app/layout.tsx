import "./globals.css";
import Header from "../components/Header";
import ErrorBoundary from "../components/ErrorBoundary";
import PerformanceMonitor, {
  PerformanceDebugger,
} from "../components/PerformanceMonitor";
import { ReactNode } from "react";
import { inter } from "../fonts/fonts";

// Import test for development
if (process.env.NODE_ENV === "development") {
  import("../utils/webVitalsTest");
}

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
        <PerformanceMonitor>
          <ErrorBoundary>
            <Header />
            {children}
            <a
              href="mailto:contact@studiohaus.com"
              className="fixed bottom-8 left-8 z-50 px-6 py-3 bg-white text-black hover:bg-white/90 transition-colors duration-300"
            >
              Contact
            </a>
          </ErrorBoundary>
          <PerformanceDebugger />
        </PerformanceMonitor>
        {/* Register service worker for offline caching */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/service-worker.js');
            });
          }`,
          }}
        />
      </body>
    </html>
  );
}
