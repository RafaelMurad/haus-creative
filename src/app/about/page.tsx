import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Studio Haus Creative is an independent creative consultancy specialising in luxury branding, image-making and global campaign direction.",
  alternates: {
    canonical: "/about",
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Main content - 120px top on mobile (was 170 — read as a void under
          the fixed header, per review 2026-07-16). Desktop top padding lives
          on each column: per Figma About-D the portrait starts ~85px above
          the text block, so the columns can't share one offset. */}
      <div className="pt-[120px] md:pt-0 flex flex-col md:flex-row">
        {/* Left column - Content */}
        <div className="px-[21px] md:pl-[34px] md:pr-10 md:pt-[230px] md:flex-1 md:min-w-0 flex flex-col">
          {/* About section */}
          <div className="flex-1">
            {/* Copy per the TEXTO PARA SITE update (2026-07-23) — heading is
                "About Us", not "About Studio Haus", per Vitor's note. */}
            <h1 className="text-[14px] font-bold uppercase leading-[1.21em] text-black mb-[23px] md:mb-[58px]">
              About Us
            </h1>
            <div className="md:pl-[4px] space-y-6 text-[15px] leading-[1.21em] md:text-[19px] md:leading-[1.68em] max-w-[750px]">
              <p>
                Studio Haus Creative is an independent creative consultancy specialising in luxury branding, image-making and global campaign direction.
              </p>
              <p>
                We partner with brands and agencies to create distinctive visual identities, culturally resonant narratives and editorially driven campaign platforms across luxury Hospitality, Real Estate, Fashion, Beauty, Jewellery, Watches and Automotive.
              </p>
              <p>
                Led by Vitor Milito, a Creative &amp; Design Director with a background shaped between Milan and London, the studio combines European visual culture with strategic brand thinking to build brands from inception, reposition established businesses and direct international campaigns across multiple markets.
              </p>
              <p>
                Our work has included projects for Rolex, Hublot, Breitling, Swarovski, Bucherer, Yves Saint Laurent Beauty, Victoria Beckham Beauty, SK-II, Harrods, Formula 1, Mercedes-Benz and Bugatti, among others.
              </p>
              <p>
                Operating across Europe, the Middle East, LATAM and APAC, Studio Haus Creative delivers Brand Strategy, Creative Direction, Visual Identity, Campaign Development and high-end content systems for global luxury audiences.
              </p>
              <p>
                Based between London, Dubai and São Paulo.
              </p>
              <p>
                Vitor Milito currently serves as Creative Director Consultant at OUI Agency, a Dubai-based boutique luxury branding and creative agency, where he leads creative strategy, brand development and campaign direction for leading regional and international clients.
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

        {/* Right column - Image (desktop only). Desktop uses its own wider
            689×736 crop (ABOUT-Image-Desktop, 2026-07-23) — the shared
            627×736 portrait read "bem mais retrato" than the About-D
            layout; mobile keeps it. Per About-D the portrait is flush to
            the right viewport edge (not centered) and starts above the
            text block, closing the white gulf between text and picture.
            The portrait holds the 1440-Figma PROPORTION (689/1440 ≈ 47vw)
            at every desktop width — review 2026-07-23: the 1485px look
            "should look like this on all large screens", a native-width
            cap that strands the image on wide windows is "never like
            this". So no px cap: past ~1470 the 689px source upscales
            (hi-res export asked, CLIENT-ASKS #9). The text column's
            pr-10 is the minimum air ("não colar no texto"). */}
        <div className="hidden md:block md:flex-none md:w-[47vw] md:pt-[145px]">
          <Image
            src="/assets/about/about-portrait-desktop.webp"
            alt="Studio Haus portrait"
            width={689}
            height={736}
            className="w-full h-auto"
            sizes="(min-width: 768px) 47vw, 100vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
