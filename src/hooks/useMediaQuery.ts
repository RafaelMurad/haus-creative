"use client";

import { useEffect, useState } from "react";

/** Matches Tailwind's `md` boundary — mobile is strictly below 768px. */
export const MOBILE_MEDIA_QUERY = "(max-width: 767.98px)";

/**
 * Tracks a CSS media query and re-evaluates on viewport changes.
 *
 * Returns `null` on the server and during the first client render (before
 * effects run) so SSR markup stays deterministic — callers can render a
 * hydration-safe fallback until the breakpoint is known.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * Resolves which video file the current breakpoint should play.
 *
 * - `null` — breakpoint not known yet (SSR + first paint); callers render
 *   native dual-`<source>` markup and let the browser pick.
 * - `undefined` — breakpoint known but the active side has no file
 *   (e.g. desktop viewport on a mobile-only hero); callers render nothing.
 * - `string` — the file to play, remount-keyed by callers so crossing the
 *   breakpoint swaps sources.
 */
export function useResponsiveVideoSource(
  desktop?: string,
  mobile?: string,
): string | null | undefined {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  if (isMobile === null) return null;
  return isMobile ? (mobile ?? desktop) : desktop;
}
