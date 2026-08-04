"use client";

import { MediaRenderer, HeroVideo } from "@/components/ui";
import type { MediaSource, Project } from "@/config/site";

interface IntroHeroProps {
  media: MediaSource;
  /** Studio showreel — layered over the static media, per-breakpoint edits. */
  showreel?: Project["showreel"];
}

/**
 * Introductory hero section for home page
 * Full viewport height with high-quality media, no text overlay.
 *
 * When a showreel is configured it layers over the static media via
 * HeroVideo (scroll-gated playback, look-ahead prefetch, per-breakpoint
 * resolution) — the same pattern as the WorkGalleryItem tiles. With no
 * mobile file delivered, HeroVideo renders nothing below the hero
 * breakpoint and the static media remains the mobile view.
 */
export function IntroHero({ media, showreel }: IntroHeroProps) {
  return (
    <section className="relative h-dvh w-full overflow-hidden">
      <MediaRenderer
        media={media}
        className="h-full w-full object-cover"
        priority
      />
      {showreel && (
        <HeroVideo
          desktop={showreel.desktop}
          mobile={showreel.mobile}
          hasAudio={showreel.hasAudio}
          // Without a mobile file, phones keep the static media (never the
          // heavyweight desktop cut); with one, this flag is inert.
          mobileFallback={false}
        />
      )}
    </section>
  );
}
