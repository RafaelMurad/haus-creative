import Link from "next/link";

interface CTALink {
  title: string;
  href: string;
  variant: "default" | "highlight";
}

interface CTALinksProps {
  links: CTALink[];
}

export function CTALinks({ links }: CTALinksProps) {
  return (
    <section className="h-[210px] flex flex-row">
      {links.map((link) => (
        <CTALinkItem key={link.href} link={link} />
      ))}
    </section>
  );
}

function CTALinkItem({ link }: { link: CTALink }) {
  const bgColor =
    link.variant === "highlight" ? "bg-[#FFF056]" : "bg-[#F3F3F3]";

  return (
    <Link
      href={link.href}
      className={`
        flex-1 h-full ${bgColor} text-black
        text-[15px] leading-[21px] uppercase
        transition-all duration-250
        group
      `}
    >
      <div className="flex items-center h-[50px] px-4 md:px-5">
        {/* Circled Arrow (default state) */}
        <svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          className="block group-hover:hidden transition-opacity"
        >
          <circle cx="9" cy="9.5" r="8.5" stroke="currentColor" />
          <path d="M4 9.5h9M9 5l4.5 4.5L9 14" stroke="currentColor" />
        </svg>

        {/* Filled Arrow (hover state) */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="hidden group-hover:block transition-opacity"
        >
          <circle cx="9" cy="9" r="8.5" fill="currentColor" stroke="currentColor" />
          <path d="M4 9h9M9 4.5L13.5 9 9 13.5" stroke="white" />
        </svg>

        <span className="ml-2 mt-[0.4em] text-xs">{link.title}</span>
      </div>
    </Link>
  );
}
