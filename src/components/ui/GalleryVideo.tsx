"use client";

import type { ProjectMedia } from "@/config/projects";
import {
  MOBILE_MEDIA_QUERY,
  useResponsiveVideoSource,
} from "@/hooks/useMediaQuery";

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
  const resolved = useResponsiveVideoSource(item.desktop, item.mobile);

  const video = (
    <video
      key={resolved ?? "pre-hydration"}
      className={
        item.aspect
          ? "absolute inset-0 w-full h-full object-cover"
          : "w-full h-auto block"
      }
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
              media={MOBILE_MEDIA_QUERY}
            />
          )}
          <source src={item.desktop} type="video/mp4" />
        </>
      )}
    </video>
  );

  // The designed card box (from the slot still) — the clip covers it, so
  // pair rows keep their designed alignment when clip dims differ.
  if (item.aspect) {
    return (
      <div className="relative w-full" style={{ aspectRatio: item.aspect }}>
        {video}
      </div>
    );
  }

  return video;
}
