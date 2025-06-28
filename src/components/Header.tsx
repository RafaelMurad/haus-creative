"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded px-2 py-1"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded px-2 py-1"
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;