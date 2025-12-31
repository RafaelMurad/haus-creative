"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MediaRenderer } from "@/components/ui";
import { useStickyScrollAnimation } from "@/hooks/useStickyScrollAnimation";
import type { Project } from "@/config/site";

interface WorkGalleryItemProps {
  project: Project;
}

/**
 * Work gallery item with scroll-animated title
 *
 * Uses GPU-accelerated Framer Motion animation for all screen sizes.
 * Three-state sticky animation: slide-in → stick to viewport middle → pull up with section
 */
export function WorkGalleryItem({ project }: WorkGalleryItemProps) {
  const animation = useStickyScrollAnimation();

  return (
    <section
      ref={animation.ref}
      className="relative h-screen w-full overflow-hidden"
    >
      <Link href={project.href} className="relative block h-full w-full group">
        {/* Media Background */}
        <MediaRenderer
          media={project.media}
          className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
        />

        {/* GPU-accelerated animated title - unified for mobile and desktop */}
        <motion.div
          className="pointer-events-none absolute left-8 z-10 gpu-accelerated md:left-16"
          style={{
            opacity: animation.opacity,
            x: animation.x,
            y: animation.y,
          }}
        >
          <h2 className="text-4xl font-light tracking-tight text-white md:text-6xl lg:text-7xl">
            {project.title}
          </h2>
        </motion.div>
      </Link>
    </section>
  );
}
