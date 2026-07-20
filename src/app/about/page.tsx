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
    <div className="min-h-screen bg-white text-black">
      {/* Main content - 120px top on mobile (was 170 — read as a void under
          the fixed header, per review 2026-07-16), 230px on desktop. */}
      <div className="pt-[120px] md:pt-[230px] flex flex-col md:flex-row">
        {/* Left column - Content */}
        <div className="px-[21px] md:pl-[34px] md:pr-8 md:w-1/2 flex flex-col">
          {/* About section */}
          <div className="flex-1">
            <h1 className="text-[14px] font-bold uppercase leading-[1.21em] text-black mb-[23px] md:mb-[58px]">
              About Studio Haus
            </h1>
            <div className="md:pl-[4px] space-y-6 text-[15px] leading-[1.21em] md:text-[19px] md:leading-[1.68em] max-w-[663px]">
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

          {/* Image on mobile - between body text and contact section per the
              updated Figma (2026-07): natural aspect within the page gutters —
              the old fixed-height cover crop cut the portrait at the forehead. */}
          <div className="md:hidden mt-8">
            <Image
              src="/assets/about/about-portrait.webp"
              alt="Studio Haus portrait"
              width={627}
              height={736}
              className="w-full h-auto"
              sizes="100vw"
              priority
            />
          </div>

          {/* Contact section — visible on both breakpoints per Figma
              About-D (in left column under body text). */}
          <div className="mt-16 md:mt-20 pb-8 md:pl-[9px]">
            <h2 className="text-[14px] font-bold uppercase leading-[1.21em] text-black mb-[37px]">
              Contact
            </h2>
            <div className="space-y-[19px] text-[15px] leading-[1.21em]">
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

        {/* Right column - Image (desktop only). Updated Figma (2026-07): the
            portrait renders at its natural 627×736 aspect, top-aligned with
            the heading and centered in the right half — capped at the
            source's native width so it never upscales past 1×. */}
        <div className="hidden md:flex md:w-1/2 md:justify-center md:items-start md:px-8">
          <Image
            src="/assets/about/about-portrait.webp"
            alt="Studio Haus portrait"
            width={627}
            height={736}
            className="w-full h-auto max-w-[627px]"
            sizes="(min-width: 768px) 627px, 100vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
