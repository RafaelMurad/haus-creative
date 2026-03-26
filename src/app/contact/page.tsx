import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Studio Haus Creative. Operating globally with hubs in London and São Paulo for strategy, creative direction, design, production, and post-production.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Contact section - top-[139px] in Figma */}
      <div className="pt-[139px] px-5 md:px-[34px]">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[247px] flex-shrink-0 mb-4 md:mb-0">
            <h1 className="text-[14px] font-bold uppercase tracking-wide text-black">
              Contact
            </h1>
          </div>
          <div className="flex-1">
            <p className="text-[15px]">
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:opacity-50 transition-opacity"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Divider line - top-[246px], spans from 34px to 1396px (width 1362px) */}
      <div className="px-5 md:px-[34px] mt-[89px] md:pr-[44px]">
        <div className="w-full h-px bg-black opacity-50"></div>
      </div>

      {/* New Business section - top-[339px] */}
      <div className="px-5 md:px-[34px] mt-[93px]">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[247px] flex-shrink-0 mb-4 md:mb-0">
            <h2 className="text-[14px] font-bold uppercase tracking-wide text-black">
              New Business
            </h2>
          </div>
          <div className="flex-1 md:max-w-[1115px]">
            <p className="text-[15px] leading-[23px] md:text-[23px] md:leading-[34px]">
              We operate globally with hubs in London and São Paulo, building and scaling up bespoke teams to provide the best talent for each client. From strategy, creative direction, design through Production and Post Production. Get in touch to discuss how we can collaborate together.
            </p>
          </div>
        </div>
      </div>

      {/* Divider line - top-[539px] */}
      <div className="px-5 md:px-[34px] mt-[98px] md:pr-[44px]">
        <div className="w-full h-px bg-black opacity-50"></div>
      </div>

      {/* For Talent section - top-[628px] */}
      <div className="px-5 md:px-[34px] mt-[89px]">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[247px] flex-shrink-0 mb-4 md:mb-0">
            <h2 className="text-[14px] font-bold uppercase tracking-wide text-black">
              For Talent
            </h2>
          </div>
          <div className="flex-1 md:max-w-[1115px]">
            <p className="text-[15px] leading-[23px] md:text-[23px] md:leading-[34px]">
              We are always looking to connect with creatives globally. We operate hybrid in remote between London and São Paulo. Reach out via {siteConfig.email} at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom social links - left-[34px] and left-[134px] at top-[939px] */}
      <div className="px-5 md:px-[34px] flex gap-[21px] pt-[250px] pb-8 text-[15px]">
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
    </main>
  );
}
