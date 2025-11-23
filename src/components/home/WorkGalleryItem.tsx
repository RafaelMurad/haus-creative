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
 * Uses Framer Motion for performance:
 * - GPU-accelerated transforms (no re-renders)
 * - Single shared scroll listener
 * - Motion values update directly on GPU
 * 
 * Animation behavior:
 * 1. Slide in from left when gallery enters viewport
 * 2. Stick to viewport middle when reached
 * 3. Pull up when gallery bottom catches text
 */
export function WorkGalleryItem({ project }: WorkGalleryItemProps) {
  const animation = useStickyScrollAnimation();

  return (
    <section
      ref={animation.ref}
      className="relative h-screen w-full overflow-hidden"
      style={{ position: 'relative' }}
    >
      <Link href={project.href} className="relative block h-full w-full group">
        {/* Media Background */}
        <MediaRenderer
          media={project.media}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Campaign Title - GPU-accelerated with Framer Motion */}
        <motion.div
          layoutRoot
          className="pointer-events-none absolute left-8 z-10 md:left-16"
          style={{
            opacity: animation.opacity,
            x: animation.x,
            top: animation.y,
          }}
        >
          <h2 className="text-4xl font-light tracking-tight text-white md:text-6xl lg:text-7xl">
            {project.title}
          </h2>
        </motion.div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30" />
      </Link>
    </section>
  );
}
