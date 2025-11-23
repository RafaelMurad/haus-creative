"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ANIMATIONS } from "@/config/animations";

interface ImmersiveHeroProps {
  videoUrl?: string;
  imageUrl?: string;
  title: string;
  subtitle?: string;
}

export default function ImmersiveHero({
  videoUrl,
  imageUrl,
  title,
  subtitle,
}: ImmersiveHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax and fade effects
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden snap-start"
      aria-label={`Hero section: ${title}`}
    >
      {/* Media Background - decorative, hidden from screen readers */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 w-full h-full motion-safe:transition-all motion-reduce:transition-none"
        aria-hidden="true"
      >
        {videoUrl ? (
          <div className="relative w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              aria-label={`Background video for ${title}`}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
              {/* Fallback for browsers that don't support video */}
              Your browser does not support the video tag.
            </video>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={`Hero background image for ${title}`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        )}
      </motion.div>

      {/* Text Overlay */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex items-center justify-center px-8 md:px-12"
      >
        <div className="text-center max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ANIMATIONS.hero.fadeInWithDelay}
            className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white mb-6 motion-reduce:transition-none"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={ANIMATIONS.hero.fadeInDelayed}
              className="text-base md:text-lg text-white/80 tracking-wide font-light motion-reduce:transition-none"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator - decorative hint */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={ANIMATIONS.hero.pulse}
          className="flex flex-col items-center motion-reduce:animate-none"
        >
          <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
          <p className="text-white/60 text-xs tracking-widest uppercase mt-4">
            Scroll
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
