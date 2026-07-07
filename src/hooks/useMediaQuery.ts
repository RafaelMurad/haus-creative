"use client";

import { useEffect, useState } from "react";

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
