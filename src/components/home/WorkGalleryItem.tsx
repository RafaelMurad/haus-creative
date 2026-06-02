"use client";

import Link from "next/link";
import { MediaRenderer, SimpleCarousel } from "@/components/ui";
import { useSlideInOnView } from "@/hooks/useSlideInOnView";
import type { Project } from "@/config/site";
import type { ProjectMedia } from "@/config/projects";
import type { CarouselConfig } from "@/types/carousel";

interface WorkGalleryItemProps {
  project: Project;
  /** Gallery media for carousel display. When provided with carouselConfig, renders a carousel instead of a single image. */
  galleryMedia?: ProjectMedia[];
  /** Carousel animation/timing config. Required alongside galleryMedia for carousel mode. */
  carouselConfig?: CarouselConfig;
}

/**
 * Work gallery item with scroll-animated title
 *
 * Uses pure CSS sticky positioning for smooth, jitter-free scrolling on mobile.
 * - Text enters with slide-in animation when section reaches viewport
 * - Text stays sticky at viewport middle while scrolling through section
 * - Section pulls text out when bottom reaches the text position
 *
 * When galleryMedia + carouselConfig are provided, renders a SimpleCarousel
 * with auto-advancing slides. Otherwise falls back to single MediaRenderer.
 *
 * No JavaScript runs during scroll - all handled by browser compositor.
 */
export function WorkGalleryItem({
  project,
  galleryMedia,
  carouselConfig,
}: WorkGalleryItemProps) {
  const { ref, isVisible } = useSlideInOnView({ threshold: 0.3 });

  const useCarousel = galleryMedia && galleryMedia.length > 0 && carouselConfig;

  return (
    <section className="relative h-dvh w-full overflow-clip">
      {/* Media Background - absolute positioned layer */}
      <Link
        href={project.href}
        className="absolute inset-0 block group"
        aria-label={`View ${project.title} project`}
      >
        {useCarousel ? (
          <SimpleCarousel
            items={galleryMedia}
            animation={carouselConfig.animation}
            autoAdvanceTime={carouselConfig.autoAdvanceTime}
            className="transition-opacity duration-300 group-hover:opacity-90"
          />
        ) : (
          <MediaRenderer
            media={project.media}
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
        )}
      </Link>

      {/* Title - CSS sticky positioning, no JS during scroll.
          mt-[25vh] offsets the title's natural position 25vh below the section's
          top edge so it enters the viewport later — only after the section has
          scrolled in past the boundary, not right at the transition. */}
      <div
        ref={ref}
        data-visible={isVisible}
        className="sticky-title pointer-events-none relative z-10 mt-[25vh] px-5 md:pl-[34px]"
      >
        <h2 className="text-2xl font-light tracking-tight text-white md:text-4xl lg:text-5xl">
          {project.title}
        </h2>
      </div>
    </section>
  );
}
