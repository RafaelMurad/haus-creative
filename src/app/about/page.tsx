import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Over 15 years of experience creating compelling 360° campaigns, branded content, and design for industry leaders including Rolex, Swarovski, Mercedes-Benz, and Harrods.",
  alternates: {
    canonical: "/about",
  },
};

export default function About() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Main content - starts at 230px from top per Figma */}
      <div className="pt-[230px] flex flex-col md:flex-row">
        {/* Left column - Content */}
        <div className="px-5 md:pl-[34px] md:pr-8 md:w-1/2 flex flex-col">
          {/* About section */}
          <div className="flex-1">
            <h1 className="text-[14px] font-bold uppercase tracking-wide text-black mb-[58px]">
              About Studio Haus
            </h1>
            <div className="md:pl-[4px] space-y-6 text-[15px] leading-[18px] md:text-[19px] md:leading-[32px] max-w-[663px]">
              <p>
                Over 15 years of extensive experience creating compelling 360° campaigns, branded content and design.
              </p>
              <p>
                Working at the intersection of advertising, branding, and experiences, my projects are marked by a refined and precise style with an editorially driven approach, where every detail is considered.
              </p>
              <p>
                My client roster includes industry leaders such as Rolex, Swarovski, Mercedes-Benz, Bucherer, Hublot, Breitling, Victoria Beckham, Harrods, John Lewis to name a few.
              </p>
            </div>
          </div>

          {/* Contact section */}
          <div className="mt-16 md:mt-20 pb-8 md:pl-[9px]">
            <h2 className="text-[14px] font-bold uppercase tracking-wide text-black mb-4">
              Contact
            </h2>
            <div className="space-y-2 text-[15px]">
              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:opacity-50 transition-opacity"
                >
                  {siteConfig.email}
                </a>
              </p>
              <div className="flex gap-[21px]">
                {siteConfig.socialLinks.map((link) => (
                  <a
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-50 transition-opacity"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Image (extends to right edge, starts at ~722px on 1440px screen) */}
        <div className="md:w-1/2">
          <div className="relative h-[400px] md:h-[528px] overflow-hidden">
            <Image
              src="/assets/about/about.webp"
              alt="Studio Haus portrait"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
