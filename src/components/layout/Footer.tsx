import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-white text-black px-4 md:px-5 pt-[68px] pb-5 text-[15px] leading-[21px]">
      {/* Mobile Email (visible only on mobile) */}
      <div className="block sm:hidden mb-10">
        <a
          href={`mailto:${siteConfig.email}`}
          className="transition-opacity duration-250 hover:opacity-50"
        >
          {siteConfig.email}
        </a>
      </div>

      {/* Main Footer Content */}
      <div className="flex flex-row min-h-[40px] sm:min-h-[114px]">
        {/* Desktop Email (hidden on mobile) */}
        <div className="hidden sm:block mt-0 mb-auto">
          <a
            href={`mailto:${siteConfig.email}`}
            className="transition-opacity duration-250 hover:opacity-50"
          >
            {siteConfig.email}
          </a>
        </div>

        {/* Social Links */}
        <div className="flex-[0_0_50%] sm:flex-[0_0_230px] sm:ml-auto sm:mr-0">
          <div className="flex flex-col gap-2.5">
            {siteConfig.socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity duration-250 hover:opacity-50"
              >
                {social.title}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Menu (Careers, etc.) */}
        <div className="flex-[0_0_50%] sm:flex-[0_0_230px]">
          <div className="flex flex-col gap-2.5">
            {siteConfig.footerMenu.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-opacity duration-250 hover:opacity-50"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-20 sm:mt-0">
        {siteConfig.copyright}
      </div>
    </footer>
  );
}
