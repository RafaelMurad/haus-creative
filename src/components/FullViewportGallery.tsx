"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GalleryConfig } from "../types";
import { ANIMATIONS } from "@/config/animations";

interface FullViewportGalleryProps {
  galleries: GalleryConfig[];
}

export default function FullViewportGallery({ galleries }: FullViewportGalleryProps) {
  return (
    <div className="bg-black" role="region" aria-label="Portfolio galleries">
      {galleries.map((gallery, index) => (
        <FullViewportSection
          key={gallery.id}
          gallery={gallery}
          index={index}
          total={galleries.length}
        />
      ))}
    </div>
  );
}

interface FullViewportSectionProps {
  gallery: GalleryConfig;
  index: number;
  total: number;
}

  function FullViewportSection({ gallery, index, total }: FullViewportSectionProps) {
    const firstItem = gallery.items[0];

    if (!firstItem) return null;

    const isVideo =
      firstItem.type === "video" ||
      firstItem.url?.endsWith(".mp4") ||
      firstItem.url?.endsWith(".webm");
    const mediaAlt =
      firstItem.title || firstItem.description || `${gallery.title} - Project ${index + 1}`;
    const imageSrc = firstItem.url || firstItem.imageUrl;

  return (
    <section
      className="relative h-screen w-full overflow-hidden snap-start"
      aria-labelledby={`gallery-title-${gallery.id}`}
    >
      {/* Full Viewport Media - Static, no animations */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-label={`Background video for ${gallery.title}`}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={firstItem.url || firstItem.imageUrl} type="video/mp4" />
            {/* Fallback text for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
        ) : imageSrc ? (
          <Image
            src={imageSrc}
            alt={mediaAlt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black" />
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Project Info - Slides in when section enters view, then STAYS */}
      <div className="absolute inset-0 flex items-end">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={ANIMATIONS.gallery.fadeIn}
          className="p-8 md:p-12 lg:p-16 pb-20 md:pb-24 lg:pb-28 motion-safe:transition-all motion-reduce:transition-none"
        >
          <div className="space-y-4">
            {/* Project Number */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[0], ease: ANIMATIONS.gallery.staggered.ease }}
              className="text-white/50 text-xs tracking-[0.3em] uppercase font-light motion-reduce:transition-none"
              aria-label={`Project ${index + 1} of ${total}`}
            >
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </motion.p>

            {/* Project Title */}
            <motion.h2
              id={`gallery-title-${gallery.id}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[1], ease: ANIMATIONS.gallery.staggered.ease }}
              className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-none motion-reduce:transition-none"
            >
              {gallery.title}
            </motion.h2>

            {/* Project Description */}
            {gallery.description && (
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[2], ease: ANIMATIONS.gallery.staggered.ease }}
                className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-lg pt-2 motion-reduce:transition-none"
              >
                {gallery.description}
              </motion.p>
            )}

            {/* Category Tag */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[3], ease: ANIMATIONS.gallery.staggered.ease }}
              className="pt-4 motion-reduce:transition-none"
            >
              <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-light border-b border-white/30 pb-1">
                {gallery.layout || "Creative Direction"}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
