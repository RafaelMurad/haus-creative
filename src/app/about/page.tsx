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
      {/* Main content - 170px top on mobile, 230px on desktop per Figma */}
      <div className="pt-[170px] md:pt-[230px] flex flex-col md:flex-row">
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

          {/* Image on mobile - between body text and contact section per Figma */}
          <div className="md:hidden mt-8">
            <div className="relative h-[292px] overflow-hidden -mx-[21px]">
              <Image
                src="/assets/about/about.webp"
                alt="Studio Haus portrait"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Contact section */}
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

        {/* Right column - Image (desktop only) + bottom-right social links */}
        <div className="hidden md:flex md:w-1/2 md:flex-col">
          <div className="relative h-[528px] overflow-hidden">
            <Image
              src="/assets/about/about.webp"
              alt="Studio Haus portrait"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>

          {/* Desktop bottom-right social links per Figma About-D */}
          <div className="flex-1 flex items-end justify-end pb-8 pr-[44px]">
            <div className="flex gap-[21px] text-[15px] leading-[1.21em]">
              {siteConfig.socialLinks.map((link) => (
                <a
                  key={`footer-${link.title}`}
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
    </div>
  );
}
