"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
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

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 h-[60px]
          flex items-center justify-between
          px-4 md:px-5
          transition-all duration-300 ease-out
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
          text-white
          mix-blend-difference
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 transition-opacity duration-250 hover:opacity-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <Logo className="h-5 w-auto" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative z-10 p-2 -mr-2 md:hidden transition-opacity duration-250 hover:opacity-50"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <MenuIcon isOpen={isMenuOpen} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {siteConfig.mainMenu.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-wide transition-opacity duration-250 hover:opacity-50"
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
