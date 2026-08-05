"use client";

import { useRef, useState } from "react";

interface EmailLinkProps {
  email: string;
  className?: string;
  /** Forwarded to the anchor (MobileMenu manages tab order when closed). */
  tabIndex?: number;
}

/**
 * Contact email link: `mailto:` opens the visitor's native mail app (the
 * strongest instruction the web has) — and the click ALSO copies the
 * address with a discreet "copied ✓", so machines with no mail app
 * configured (where mailto silently no-ops, e.g. gmail-in-browser setups)
 * still leave with the address in hand.
 */
export function EmailLink({ email, className, tabIndex }: EmailLinkProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleClick = () => {
    // No preventDefault: the mailto proceeds natively; the copy is a
    // non-blocking safety net.
    try {
      void navigator.clipboard?.writeText(email);
    } catch {
      /* clipboard unavailable (http/permissions) — mailto still runs */
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="relative inline-block">
      <a
        href={`mailto:${email}`}
        onClick={handleClick}
        className={className}
        tabIndex={tabIndex}
      >
        {email}
      </a>
      <span
        aria-live="polite"
        className={`pointer-events-none absolute left-0 -top-[20px] text-[11px] uppercase tracking-[0.08em] transition-opacity duration-300 ${
          copied ? "opacity-50" : "opacity-0"
        }`}
      >
        {copied ? "copied ✓" : ""}
      </span>
    </span>
  );
}
