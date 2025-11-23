"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "../ui/Logo";

interface HeaderProps {
  variant?: "light" | "dark" | "transparent";
}

export function Header({ variant = "light" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isTransparent = variant === "transparent" && !isScrolled && !isMenuOpen;
  const isDark = variant === "dark";

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 h-[60px]
          flex items-center justify-between
          px-4 md:px-5
          transition-all duration-300 ease-out
          ${isTransparent
            ? "bg-transparent text-white"
            : isDark
              ? "bg-black text-white"
              : "bg-white text-black"
          }
          ${isScrolled && !isTransparent ? "shadow-sm" : ""}
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

// Animated hamburger icon
function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M0 4h24"
        stroke="currentColor"
        strokeWidth="1"
        className={`transition-all duration-300 origin-center ${
          isOpen ? "rotate-45 translate-y-[8px]" : ""
        }`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <path
        d="M0 12h24"
        stroke="currentColor"
        strokeWidth="1"
        className={`transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}
      />
      <path
        d="M0 20h24"
        stroke="currentColor"
        strokeWidth="1"
        className={`transition-all duration-300 origin-center ${
          isOpen ? "-rotate-45 -translate-y-[8px]" : ""
        }`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
