"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

interface HeroVideoProps {
  desktop: string;
  mobile?: string;
  poster?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

/**
 * Full-bleed hero video that re-selects its source when the viewport crosses
 * the mobile breakpoint.
 *
 * Browsers evaluate `<source media>` on <video> only once, at load time
 * (unlike <picture>, which re-evaluates on resize) — so a native two-source
 * video never swaps files when the window is resized. This component tracks
 * the breakpoint with matchMedia and remounts the element (`key`) with the
 * right file instead. Until the breakpoint is known (SSR + first paint) it
 * renders both sources and lets the browser pick, so no-JS and first-paint
 * behavior match the previous markup.
 */
export function HeroVideo({
  desktop,
  mobile,
  poster,
  objectFit = "cover",
  objectPosition = "center",
}: HeroVideoProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const resolved =
    isMobile === null ? null : isMobile ? (mobile ?? desktop) : desktop;

  return (
    <video
      key={resolved ?? "pre-hydration"}
      className="absolute inset-0 w-full h-full"
      style={{ objectFit, objectPosition }}
      playsInline
      autoPlay
      loop
      muted
      poster={poster}
      preload="metadata"
      src={resolved ?? undefined}
    >
      {resolved === null && (
        <>
          {mobile && (
            <source src={mobile} type="video/mp4" media="(max-width: 768px)" />
          )}
          <source src={desktop} type="video/mp4" />
        </>
      )}
    </video>
  );
}
