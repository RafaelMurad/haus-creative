"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project, createMediaSource } from "@/config/site";
import { MediaRenderer } from "@/components/ui";
import { ANIMATIONS } from "@/config/animations";

interface MediaSectionProps {
  project: Project;
  index?: number;
  total?: number;
}

/**
 * MediaSection - Renders a full-viewport section with any media type
 * Supports: video, image, and gif backgrounds
 * Text slides in when section enters viewport
 */
export function MediaSection({ project, index = 0, total = 1 }: MediaSectionProps) {
  // Get media source (handles both new format and legacy format)
  const media = createMediaSource(project);

  return (
    <Link
      href={project.href}
      className="block relative w-full h-screen bg-black group overflow-hidden snap-start"
    >
      {/* Background Media - Video, Image, or GIF */}
      <MediaRenderer
        media={media}
        className="absolute inset-0 w-full h-full object-cover object-center"
        priority={index === 0}
      />

      {/* Overlay with gradient and content */}
      <div className="absolute inset-0 z-10">
        {/* Left side gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)",
          }}
        />

        {/* Project Info - Slides in when section enters view */}
        <div className="absolute inset-0 flex items-end">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={ANIMATIONS.gallery.fadeIn}
            className="p-8 md:p-12 lg:p-16 pb-20 md:pb-24 lg:pb-28"
          >
            <div className="space-y-4">
              {/* Project Number */}
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[0], ease: ANIMATIONS.gallery.staggered.ease }}
                className="text-white/50 text-xs tracking-[0.3em] uppercase font-light"
              >
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </motion.p>

              {/* Project Title */}
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[1], ease: ANIMATIONS.gallery.staggered.ease }}
                className="text-white text-3xl md:text-4xl lg:text-5xl font-light leading-tight"
              >
                {project.title}
              </motion.h2>

              {/* Project Subtitle */}
              {project.subtitle && (
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[2], ease: ANIMATIONS.gallery.staggered.ease }}
                  className="text-white/70 text-lg md:text-xl font-light"
                >
                  {project.subtitle}
                </motion.p>
              )}

              {/* View Project Link */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[3], ease: ANIMATIONS.gallery.staggered.ease }}
                className="pt-4"
              >
                <span className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-wide group-hover:opacity-70 transition-opacity">
                  View Project
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transform group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      d="M3 8H13M13 8L8 3M13 8L8 13"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Link>
  );
}

// Legacy alias for backward compatibility
export const VideoSection = MediaSection;

// Collection of media sections
interface MediaCollectionProps {
  projects: Project[];
}

/**
 * MediaCollection - Renders a collection of full-viewport media sections
 * Each project can use video, image, or gif media
 * Includes snap scrolling for smooth navigation between sections
 */
export function MediaCollection({ projects }: MediaCollectionProps) {
  return (
    <div className="snap-y snap-mandatory">
      {projects.map((project, index) => (
        <MediaSection
          key={project.id}
          project={project}
          index={index}
          total={projects.length}
        />
      ))}
    </div>
  );
}

// Legacy alias for backward compatibility
export const VideoCollection = MediaCollection;
