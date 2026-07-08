"use client";

import type { ProjectMedia } from "@/config/projects";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface GalleryVideoProps {
  item: ProjectMedia;
  index: number;
}

/**
 * In-gallery ambient video at natural aspect (the video sibling of the
 * MaskFrame image render).
 *
 * Like HeroVideo, this re-selects its source when the viewport crosses the
 * mobile breakpoint — `<source media>` on <video> is only evaluated at load
 * time, so the native two-source markup (kept for SSR/no-JS) never swaps on
 * resize by itself.
 */
export function GalleryVideo({ item, index }: GalleryVideoProps) {
  const isMobile = useMediaQuery("(max-width: 767.98px)");
  const resolved =
    isMobile === null
      ? null
      : isMobile
        ? (item.mobile ?? item.desktop)
        : item.desktop;

  return (
    <video
      key={resolved ?? "pre-hydration"}
      className="w-full h-auto block"
      playsInline
      autoPlay
      loop
      muted
      poster={item.poster}
      preload={index < 2 ? "metadata" : "none"}
      src={resolved ?? undefined}
    >
      {resolved === null && (
        <>
          {item.mobile && (
            <source
              src={item.mobile}
              type="video/mp4"
              media="(max-width: 767.98px)"
            />
          )}
          <source src={item.desktop} type="video/mp4" />
        </>
      )}
    </video>
  );
}
