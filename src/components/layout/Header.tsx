"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getProjectBySlug } from "@/config/projects";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { MobileMenu } from "./MobileMenu";
import { Logo, MenuIcon } from "../ui";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isVisible } = useScrollDirection({
    hideThreshold: 100,
    topThreshold: 50,
  });

  useBodyScrollLock(isMenuOpen);

  const showHeader = isVisible || isMenuOpen;

  // Per-project header colour. Dark-hero projects (e.g. Vivara, Life) set
  // headerTheme: "light" so the logo + menu render white — but only while the
  // hero sits under the header. Once scrolled onto the white content below, the
  // header reverts to black so it stays legible.
  const pathname = usePathname();
  const slug = pathname?.startsWith("/work/") ? pathname.split("/")[2] : undefined;
  const wantsLight = slug ? getProjectBySlug(slug)?.headerTheme === "light" : false;

  // Default true so a light-theme page paints white over its dark hero on the
  // first frame (no black flash before the observer fires).
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    if (!wantsLight) {
      setOverHero(false);
      return;
    }
    setOverHero(true);
    const hero = document.getElementById("project-hero");
    if (!hero) return;
    // isIntersecting stays true while the hero still occupies the area just below
    // the header band; it flips false once the hero's bottom scrolls above it.
    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [wantsLight, pathname]);

  const textColor = wantsLight && overHero ? "text-white" : "text-black";

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-5 py-7 md:pl-[34px] md:pr-[44px]
          transition-all duration-300 ease-out
          ${textColor}
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <Link
          href="/"
          className="relative z-10 transition-opacity duration-250 hover:opacity-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <Logo className="h-10 w-auto md:h-12" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative z-10 md:hidden transition-opacity duration-250 hover:opacity-50"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <MenuIcon isOpen={isMenuOpen} className="h-10 w-10" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {siteConfig.mainMenu.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] leading-[1.21em] uppercase transition-opacity duration-250 hover:opacity-50"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
