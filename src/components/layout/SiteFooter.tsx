import Link from "next/link";
import { siteConfig } from "@/config/site";
import { EmailLink } from "@/components/ui/EmailLink";

/**
 * Site footer — hairline divider, contact email left, social links right
 * (stacked on mobile). Extracted verbatim from the project-page footer so
 * home and /work/[slug] share one source of truth.
 */
export function SiteFooter() {
  return (
    <div className="bg-white text-black">
      <div className="px-[17px] md:px-[34px] mt-[71px] md:mt-[81px] md:pr-[44px]">
        <div className="w-full h-[0.5px] bg-black" />
      </div>

      <div className="px-[21px] md:px-[41px] md:pr-[44px]">
        {/* Mobile: stacked vertically. Desktop: email left, social right */}
        <div className="flex flex-col md:flex-row md:justify-between pt-[71px] md:pt-[60px] pb-[60px] md:pb-[40px]">
          {/* Contact Email — mailto opens the native mail app; click also
              copies the address (fallback for no-mail-app machines). */}
          <div>
            <EmailLink
              email={siteConfig.email}
              className="text-[15px] leading-[1.21em] hover:opacity-50 transition-opacity"
            />
          </div>

          {/* Social Links - vertical on mobile, horizontal on desktop */}
          <div className="flex flex-col md:flex-row gap-[18px] md:gap-[21px] mt-[38px] md:mt-0">
            {siteConfig.socialLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] leading-[1.21em] hover:opacity-50 transition-opacity"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
