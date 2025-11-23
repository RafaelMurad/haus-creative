"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={`
        fixed inset-0 z-40 bg-white text-black
        pt-[60px] px-4 pb-10
        flex flex-col
        transition-all duration-300 ease-out
        ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }
      `}
      aria-hidden={!isOpen}
    >
      {/* Main Navigation */}
      <nav className="mt-20 mb-auto">
        <ul className="space-y-5">
          {siteConfig.mainMenu.map((link, index) => (
            <li
              key={link.href}
              className={`
                transform transition-all duration-300 ease-out
                ${isOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
                }
              `}
              style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="text-2xl leading-tight transition-opacity duration-250 hover:opacity-50"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Contact Email */}
      <div
        className={`
          mt-20 mb-3
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
        style={{ transitionDelay: isOpen ? "200ms" : "0ms" }}
      >
        <a
          href={`mailto:${siteConfig.email}`}
          className="text-[15px] leading-[21px] transition-opacity duration-250 hover:opacity-50"
        >
          {siteConfig.email}
        </a>
      </div>

      {/* Social Links */}
      <div
        className={`
          flex gap-8
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
        style={{ transitionDelay: isOpen ? "250ms" : "0ms" }}
      >
        {siteConfig.socialLinks.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] leading-[21px] transition-opacity duration-250 hover:opacity-50"
          >
            {social.title}
          </a>
        ))}
      </div>
    </div>
  );
}
