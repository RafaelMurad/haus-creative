"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ANIMATIONS } from "@/config/animations";

export default function MinimalNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Work", href: "#work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "mailto:contact@studiohaus.com" },
  ];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }, [menuOpen]);

  // Focus management and keyboard listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    // Focus first menu item when menu opens
    if (menuOpen && firstMenuItemRef.current) {
      setTimeout(() => firstMenuItemRef.current?.focus(), 100);
    }

    // Prevent body scroll when menu is open
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen, handleKeyDown]);

  return (
    <>
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <nav aria-label="Main navigation">
          <div className="flex items-center justify-between px-8 md:px-12 py-8">
            {/* Logo */}
            <Link
              href="/"
              className="text-white text-sm tracking-[0.2em] uppercase font-light hover:opacity-60 transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
              aria-label="Studio Haus - Go to homepage"
            >
              Studio Haus
            </Link>

            {/* Hamburger Menu Button */}
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:opacity-60 transition-opacity duration-300 relative w-8 h-8 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="main-menu"
            >
              <div className="w-full" aria-hidden="true">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                  className="block w-full h-[1px] bg-white mb-2 origin-center motion-reduce:transition-none"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block w-full h-[1px] bg-white mb-2 motion-reduce:transition-none"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 4 }}
                  className="block w-full h-[1px] bg-white origin-center motion-reduce:transition-none"
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="main-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={ANIMATIONS.nav.fadeIn}
            className="fixed inset-0 z-40 bg-black flex items-center justify-center"
          >
            <nav aria-label="Main menu">
              <ul className="space-y-8" role="menu">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    role="none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * ANIMATIONS.nav.staggerDelay, duration: ANIMATIONS.nav.fadeIn.duration }}
                    className="motion-reduce:transition-none"
                  >
                    {item.href.startsWith("mailto:") ? (
                      <a
                        ref={index === 0 ? firstMenuItemRef : null}
                        href={item.href}
                        role="menuitem"
                        className="text-5xl md:text-7xl font-light text-white hover:text-gray-400 transition-colors duration-300 tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded inline-block"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        ref={index === 0 ? firstMenuItemRef : null}
                        href={item.href}
                        role="menuitem"
                        className="text-5xl md:text-7xl font-light text-white hover:text-gray-400 transition-colors duration-300 tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded inline-block"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
