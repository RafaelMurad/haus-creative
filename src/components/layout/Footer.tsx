import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-white text-black px-5 md:pl-[34px] md:pr-[44px] py-8 text-[15px] leading-[18px]">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        {/* Email */}
        <div>
          <a
            href={`mailto:${siteConfig.email}`}
            className="transition-opacity duration-250 hover:opacity-50"
          >
            {siteConfig.email}
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-[21px]">
          {siteConfig.socialLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-250 hover:opacity-50"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
