"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MediaItem from "./MediaItem";
import { GalleryConfig } from "../types";
import { ANIMATIONS } from "@/config/animations";

interface ImmersiveGalleryProps {
  galleries: GalleryConfig[];
}

export default function ImmersiveGallery({ galleries }: ImmersiveGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: _scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={containerRef} className="relative bg-black">
      {/* Full-bleed Grid - No gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery, index) => {
          const firstItem = gallery.items[0];
          if (!firstItem) return null;

          return (
            <GalleryItem
              key={gallery.id}
              gallery={gallery}
              item={firstItem}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </div>

      {/* Horizontal Scroll Section (Optional - for variety) */}
      <HorizontalScroll galleries={galleries.slice(0, 4)} />
    </section>
  );
}

interface GalleryItemProps {
  gallery: GalleryConfig;
  item: any;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function GalleryItem({
  gallery,
  item,
  index,
  isHovered,
  onHover,
  onLeave,
}: GalleryItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect - different speeds for each item
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * (index % 2 === 0 ? 1 : -1), -100 * (index % 2 === 0 ? 1 : -1)]
  );

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={itemRef}
      style={{ y }}
      className="relative aspect-[3/4] overflow-hidden cursor-pointer group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Media */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 w-full h-full"
      >
        <MediaItem
          item={item}
          className="w-full h-full object-cover"
          isActive={true}
        />
      </motion.div>

      {/* Overlay with Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={ANIMATIONS.nav.fadeIn}
        className="absolute inset-0 bg-black/60 flex items-center justify-center"
      >
        <div className="text-center px-8">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[0] }}
            className="text-xs tracking-[0.2em] uppercase text-white/60 mb-3"
          >
            {gallery.layout}
          </motion.p>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: ANIMATIONS.gallery.staggered.duration, delay: ANIMATIONS.gallery.staggered.delays[1] }}
            className="text-3xl md:text-4xl font-light text-white tracking-tight"
          >
            {gallery.title}
          </motion.h3>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface HorizontalScrollProps {
  galleries: GalleryConfig[];
}

function HorizontalScroll({ galleries }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex">
          {galleries.map((gallery, _index) => {
            const firstItem = gallery.items[0];
            if (!firstItem) return null;

            return (
              <div
                key={gallery.id}
                className="relative h-screen w-[80vw] md:w-[60vw] flex-shrink-0"
              >
                <MediaItem
                  item={firstItem}
                  className="w-full h-full object-cover"
                  isActive={true}
                />
                <div className="absolute bottom-12 left-12 text-white">
                  <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                    {gallery.layout}
                  </p>
                  <h3 className="text-4xl md:text-5xl font-light tracking-tight">
                    {gallery.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
