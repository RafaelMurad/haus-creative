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
          ? "block w-full h-auto md:h-full md:object-cover"
          : "w-full h-auto block"
      }
      playsInline
      autoPlay
      loop
      muted
      poster={item.inset ? undefined : item.poster}
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

  // Desktop only: the designed card box (aspect from the slot still) with
  // the clip inset inside it — the framing whitespace stays as page
  // background. The inset sits on a plain div because absolutely-positioned
  // replaced elements (video) don't stretch between top/bottom offsets;
  // divs do, and the video fills the div. On mobile both wrappers are
  // inert and the clip renders natural-aspect edge-to-edge, stacking like
  // the static images (per-slot mobile spacing comes from config).
  const framed = item.aspect ? (
    <div
      className="relative w-full md:aspect-[var(--card-ar)] md:bg-[var(--card-bg)]"
      style={
        {
          "--card-ar": item.aspect,
          // Painted card background behind the inset clip (e.g. the beige
          // Ouronyx panel). Transparent when unset.
          "--card-bg": item.bgColor ?? "transparent",
        } as React.CSSProperties
      }
    >
      <div
        className="md:absolute md:[inset:var(--card-inset)]"
        style={{ "--card-inset": item.inset ?? "0" } as React.CSSProperties}
      >
        {video}
      </div>
    </div>
  ) : (
    video
  );

  // Mobile card gutter — insets the card on all four sides below md only,
  // composing with (not replacing) the desktop framing above.
  if (item.mobileGutter) {
    return (
      <div
        className="p-[var(--m-gutter)] md:p-0"
        style={{ "--m-gutter": item.mobileGutter } as React.CSSProperties}
      >
        {framed}
      </div>
    );
  }

  return framed;
}
