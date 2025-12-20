import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-white text-black px-5 md:pl-[34px] md:pr-[44px] pt-12 pb-8 text-[15px] leading-[21px]">
      {/* Email */}
      <div className="mb-8">
        <a
          href={`mailto:${siteConfig.email}`}
          className="transition-opacity duration-250 hover:opacity-50"
        >
          {siteConfig.email}
        </a>
      </div>

      {/* Copyright */}
      <div>
        {siteConfig.copyright}
      </div>
    </footer>
  );
}
