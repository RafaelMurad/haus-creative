"use client";

import { useEffect, useState } from "react";

/** Matches Tailwind's `md` boundary — mobile is strictly below 768px. */
export const MOBILE_MEDIA_QUERY = "(max-width: 767.98px)";

/**
 * Hero banners swap to the portrait edit below Tailwind's `lg` boundary
 * (tablet-sized and down, review 2026-07-20) — the portrait edits are
 * composed for tall boxes and play full-bleed there. Above it, whole-frame
 * heroes (heroVideo.objectFit "contain") render the landscape banner as a
 * natural-aspect band that scales with the viewport, so baked titles stay
 * visible at any window size. Gallery clips keep MOBILE_MEDIA_QUERY,
 * aligned with the md: layout classes.
 */
export const HERO_MOBILE_MEDIA_QUERY = "(max-width: 1023.98px)";

/**
 * Inverse of HERO_MOBILE_MEDIA_QUERY — gates a desktop-only hero's
 * pre-hydration <source> so phones never fetch it (see
 * useResponsiveVideoSource's mobileFallback: false).
 */
export const HERO_DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

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
 *
 * `mobileFallback` (default true): a missing mobile file falls back to the
 * desktop file — the gallery/tile behavior (e.g. YSL's mobile banner plays
 * the desktop cut). Pass false for desktop-only media that must NOT leak
 * onto phones (e.g. the 16:9 home showreel: cover-cropped to a 9:16 sliver
 * and a heavyweight download on mobile data).
 */
export function useResponsiveVideoSource(
  desktop?: string,
  mobile?: string,
  query: string = MOBILE_MEDIA_QUERY,
  mobileFallback: boolean = true,
): string | null | undefined {
  const isMobile = useMediaQuery(query);
  if (isMobile === null) return null;
  return isMobile ? (mobile ?? (mobileFallback ? desktop : undefined)) : desktop;
}
