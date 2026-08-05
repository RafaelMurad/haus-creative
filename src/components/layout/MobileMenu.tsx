"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { EmailLink } from "@/components/ui/EmailLink";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={`
        fixed inset-0 z-40 text-black
        flex flex-col
        transition-all duration-300 ease-out
        ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }
      `}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(44px)",
        WebkitBackdropFilter: "blur(44px)",
      }}
      aria-hidden={!isOpen}
    >
      {/* Main Navigation */}
      <nav className="mt-[120px] min-[700px]:mt-[182px] ml-[21px]">
        <ul className="space-y-[34px]">
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
                tabIndex={isOpen ? 0 : -1}
                className="text-[15px] leading-[1.21em] uppercase transition-opacity duration-250 hover:opacity-50"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Spacer to push email/social to bottom */}
      <div className="flex-1" />

      {/* Contact Email */}
      <div
        className={`
          ml-[21px] mb-[19px]
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
        style={{ transitionDelay: isOpen ? "200ms" : "0ms" }}
      >
        <EmailLink email={siteConfig.email} tabIndex={isOpen ? 0 : -1} className="text-[15px] leading-[1.21em] transition-opacity duration-250 hover:opacity-50" />
      </div>

      {/* Social Links */}
      <div
        className={`
          ml-[21px] mb-[40px] min-[700px]:mb-[69px] flex gap-[21px]
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
            tabIndex={isOpen ? 0 : -1}
            className="text-[15px] leading-[1.21em] transition-opacity duration-250 hover:opacity-50"
          >
            {social.title}
          </a>
        ))}
      </div>
    </div>
  );
}
