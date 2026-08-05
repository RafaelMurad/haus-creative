import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { EmailLink } from "@/components/ui/EmailLink";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Studio Haus Creative. Operating globally with hubs in London, Dubai and São Paulo for strategy, creative direction, design, production, and post-production.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Contact section - top-[139px] desktop, top-[144px] mobile per Figma */}
      <div className="pt-[144px] md:pt-[139px] px-[21px] md:px-[34px]">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[247px] flex-shrink-0 mb-[19px] md:mb-0">
            <h1 className="text-[14px] font-bold uppercase leading-[1.21em] text-black">
              Contact
            </h1>
          </div>
          <div className="flex-1">
            <p className="text-[15px] leading-[1.53em] md:text-[18px] md:leading-[1.55em]">
<EmailLink
                email={siteConfig.email}
                className="hover:opacity-50 transition-opacity"
              />
            </p>
          </div>
        </div>
      </div>

      {/* Divider line 1 */}
      <div className="px-[17px] md:px-[34px] mt-[47px] md:mt-[89px] md:pr-[44px]">
        <div className="w-full h-[0.5px] bg-black"></div>
      </div>

      {/* New Business section */}
      <div className="px-[21px] md:px-[34px] mt-[47px] md:mt-[93px]">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[247px] flex-shrink-0 mb-[24px] md:mb-0">
            <h2 className="text-[14px] font-bold uppercase leading-[1.21em] text-black">
              New Business
            </h2>
          </div>
          <div className="flex-1 md:max-w-[1115px]">
            <p className="text-[15px] leading-[1.53em] md:text-[18px] md:leading-[1.55em]">
              {/* "London, Dubai and São Paulo" per Vitor 2026-08-04. */}
              We operate globally with hubs in London, Dubai and São Paulo, building and scaling up bespoke teams to provide the best talent for each client. From strategy, creative direction, design through Production and Post Production. Get in touch to discuss how we can collaborate together.
            </p>
          </div>
        </div>
      </div>

      {/* Divider line 2 */}
      <div className="px-[17px] md:px-[34px] mt-[47px] md:mt-[98px] md:pr-[44px]">
        <div className="w-full h-[0.5px] bg-black"></div>
      </div>

      {/* For Talent section */}
      <div className="px-[21px] md:px-[34px] mt-[47px] md:mt-[89px]">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[247px] flex-shrink-0 mb-[24px] md:mb-0">
            <h2 className="text-[14px] font-bold uppercase leading-[1.21em] text-black">
              For Talent
            </h2>
          </div>
          <div className="flex-1 md:max-w-[1115px]">
            <p className="text-[15px] leading-[1.53em] md:text-[18px] md:leading-[1.55em]">
              {/* "We operate hybrid in remote…" removed per Vitor 2026-08-04. */}
              We are always looking to connect with creatives globally.
              {/* "Reach out via…" starts its own line (review 2026-07-23). */}
              <br />
              Reach out via{" "}
<EmailLink
                email={siteConfig.email}
                className="hover:opacity-50 transition-opacity"
              />{" "}
              at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom social links */}
      <div className="px-[21px] md:px-[34px] flex flex-col md:flex-row gap-[18px] md:gap-[21px] pt-[165px] md:pt-[243px] pb-8 text-[15px] leading-[1.21em]">
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
  );
}
