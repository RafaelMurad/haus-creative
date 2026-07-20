"use client";

import { useEffect, useState } from "react";

/** Matches Tailwind's `md` boundary — mobile is strictly below 768px. */
export const MOBILE_MEDIA_QUERY = "(max-width: 767.98px)";

/**
 * Hero banners swap to the portrait edit when the viewport is tablet-sized
 * OR taller than square (review 2026-07-20): the landscape banners bake
 * titles into the frame edges, and cover-crop cuts them in any tall box —
 * width alone misses wide-but-tall desktop windows (e.g. 1440×1775). The
 * portrait edits are composed for tall boxes. Gallery clips keep
 * MOBILE_MEDIA_QUERY, aligned with the md: layout classes.
 */
export const HERO_MOBILE_MEDIA_QUERY =
  "(max-width: 1023.98px), (max-aspect-ratio: 1/1)";

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
  query: string = MOBILE_MEDIA_QUERY,
): string | null | undefined {
  const isMobile = useMediaQuery(query);
  if (isMobile === null) return null;
  return isMobile ? (mobile ?? desktop) : desktop;
}
