"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollManager — one coherent scroll policy for client-side navigation:
 *
 * - **Project pages** (`/work/<slug>`) and other content routes always open at
 *   the TOP. Next's own reset can land mid-page because the global
 *   `scroll-behavior: smooth` turns it into an interruptible animation; we force
 *   `behavior: "instant"` which always jumps (note: `behavior: "auto"` would
 *   instead defer to the CSS `scroll-behavior`, i.e. smooth — the original bug).
 *   (Fixes "clicking a project link sometimes opens mid-page".)
 * - **Listing pages** (`/` and `/work`) RESTORE the position you left them at, so
 *   returning to WORK via the burger menu reopens at the same section instead of
 *   the top. (Fixes "open WORK where I was, not from the top".)
 *
 * Position is saved per-path on the capture phase of any click (i.e. just before
 * a navigation) and on `pagehide`, keyed by the path that is current at save
 * time — so the value captured when you click a WORK tile is the WORK scroll,
 * untouched by the subsequent reset.
 */

const storageKey = (path: string) => `scroll:${path}`;
const isListing = (path: string) => path === "/" || path === "/work";

// Avoid the useLayoutEffect-on-server warning during SSR pre-render.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ScrollManager() {
  const pathname = usePathname();
  const pathRef = useRef(pathname);

  // Take full control away from the browser's native restoration.
  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Persist the current page's scroll just before navigating away (and on unload).
  useEffect(() => {
    const save = () => {
      try {
        sessionStorage.setItem(storageKey(pathRef.current), String(window.scrollY));
      } catch {
        /* sessionStorage unavailable (e.g. Safari private mode) — degrade to top */
      }
    };
    document.addEventListener("click", save, true); // capture phase: fires before <Link> nav
    window.addEventListener("pagehide", save);
    return () => {
      document.removeEventListener("click", save, true);
      window.removeEventListener("pagehide", save);
    };
  }, []);

  // On arrival: listing → restore, everything else → top. Pre-paint to avoid flash.
  useIsomorphicLayoutEffect(() => {
    pathRef.current = pathname;
    if (typeof window === "undefined") return;
    if (window.location.hash) return; // honour deep links / in-page #anchors

    let target = 0;
    if (isListing(pathname)) {
      try {
        const saved = sessionStorage.getItem(storageKey(pathname));
        if (saved != null) target = parseInt(saved, 10) || 0;
      } catch {
        /* ignore */
      }
    }

    const apply = () => window.scrollTo({ top: target, left: 0, behavior: "instant" });
    apply();
    // Re-assert next frame so we win against Next's own reset and the
    // useBodyScrollLock unlock-restore when navigating via the burger menu.
    requestAnimationFrame(apply);
  }, [pathname]);

  return null;
}
