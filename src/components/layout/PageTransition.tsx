"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * PageTransition — fades a project page in on navigation via a full-screen veil.
 *
 * Why a veil instead of fading the page itself: the project page is heavy to
 * mount (hero + gallery + per-tile observers), and fading the *content* wrapper
 * meant the fade competed with that mount on the main thread — images popped in
 * mid-fade and it read as janky/abrupt. The veil is a single solid <div> whose
 * opacity animates on the compositor (off the main thread), so it stays smooth
 * no matter how busy the mount is, and it masks the content until it's painted.
 *
 * On in-app navigation into /work/<slug> we replay a cover→reveal animation
 * (opacity 1 → 0) by toggling the class — no keyed remount, and no JS opacity
 * flip (which can stall hidden in a backgrounded tab). Skipped on first
 * load/refresh (the browser's own load is the transition) and on non-project
 * routes. `both` fill leaves the veil at opacity 0; pointer-events:none keeps
 * it inert between transitions. Auto-neutralised under prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const veilRef = useRef<HTMLDivElement>(null);
  const prevPath = useRef<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    const isFirstRender = prevPath.current === null;
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    // No veil on the very first load/refresh, or when navigating toward a
    // non-project route — only when navigating *into* a project in-app.
    if (isFirstRender) return;
    const isProjectPage = pathname.startsWith("/work/") && pathname !== "/work";
    if (!isProjectPage) return;

    const el = veilRef.current;
    if (!el) return;
    // Restart the cover→reveal animation without remounting anything.
    el.classList.remove("page-veil--active");
    void el.offsetWidth; // force reflow so the animation can replay
    el.classList.add("page-veil--active");
  }, [pathname]);

  return (
    <>
      {children}
      <div ref={veilRef} className="page-veil" aria-hidden="true" />
    </>
  );
}
