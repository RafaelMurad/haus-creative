"use client";

import Link from "next/link";
import { MediaRenderer } from "@/components/ui";
import { useSlideInOnView } from "@/hooks/useSlideInOnView";
import type { Project } from "@/config/site";

interface WorkGalleryItemProps {
  project: Project;
}

/**
 * Work gallery item with scroll-animated title
 *
 * Uses pure CSS sticky positioning for smooth, jitter-free scrolling on mobile.
 * - Text enters with slide-in animation when section reaches viewport
 * - Text stays sticky at viewport middle while scrolling through section
 * - Section pulls text out when bottom reaches the text position
 * 
 * No JavaScript runs during scroll - all handled by browser compositor.
 */
export function WorkGalleryItem({ project }: WorkGalleryItemProps) {
  const { ref, isVisible } = useSlideInOnView({ threshold: 0.3 });

  return (
    <section className="relative h-screen w-full overflow-clip">
      {/* Media Background - absolute positioned layer */}
      <Link 
        href={project.href} 
        className="absolute inset-0 block group"
        aria-label={`View ${project.title} project`}
      >
        <MediaRenderer
          media={project.media}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
      </Link>

      {/* Title - CSS sticky positioning, no JS during scroll */}
      <div
        ref={ref}
        data-visible={isVisible}
        className="sticky-title pointer-events-none relative z-10 px-5 md:pl-[34px]"
      >
        <h2 className="text-3xl font-light tracking-tight text-white md:text-5xl lg:text-6xl">
          {project.title}
        </h2>
      </div>
    </section>
  );
}
