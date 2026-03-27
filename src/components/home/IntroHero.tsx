"use client";

import { MediaRenderer } from "@/components/ui";
import type { MediaSource } from "@/config/site";

interface IntroHeroProps {
  media: MediaSource;
}

/**
 * Introductory hero section for home page
 * Full viewport height with high-quality media, no text overlay
 */
export function IntroHero({ media }: IntroHeroProps) {
  return (
    <section className="relative h-dvh w-full overflow-hidden">
      <MediaRenderer
        media={media}
        className="h-full w-full object-cover"
        priority
      />
    </section>
  );
}
