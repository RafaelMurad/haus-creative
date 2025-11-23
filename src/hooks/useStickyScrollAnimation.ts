"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";
import { ANIMATIONS } from "@/config/animations";

interface StickyScrollConfig {
  /** Duration of slide-in animation (ms) */
  slideDuration?: number;
  /** Text height for bottom calculation (px) */
  textHeight?: number;
  /** Top padding from section top (px) */
  topPadding?: number;
  /** Bottom padding from section bottom (px) */
  bottomPadding?: number;
}

interface StickyScrollMotion {
  /** Ref to attach to the container element */
  ref: React.RefObject<HTMLElement | null>;
  /** Opacity motion value */
  opacity: MotionValue<number>;
  /** Horizontal translation motion value */
  x: MotionValue<number>;
  /** Vertical position motion value */
  y: MotionValue<string>;
  /** Transition config for slide-in */
  transition: {
    duration: number;
    ease: readonly [number, number, number, number];
  };
}

/**
 * Optimized sticky scroll animation using Framer Motion
 * 
 * Performance: Uses motion values (GPU-accelerated, no re-renders)
 * Only tracks two key moments:
 * 1. Text reaches viewport middle → stick
 * 2. Gallery bottom catches text → pull up
 * 
 * @param config - Configuration options
 * @returns Motion values and ref
 */
export function useStickyScrollAnimation(
  config: StickyScrollConfig = {}
): StickyScrollMotion {
  const {
    slideDuration = ANIMATIONS.stickyText.slideDuration,
    textHeight = ANIMATIONS.stickyText.textHeight,
    topPadding = ANIMATIONS.stickyText.topPadding,
    bottomPadding = ANIMATIONS.stickyText.bottomPadding,
  } = config;

  // Cache viewport height to avoid recalculation in transform
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const ref = useRef<HTMLElement | null>(null);

  // Single scroll listener managed by Framer Motion
  // Tracks scroll progress through this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // When element enters to when it exits
  });

  // Opacity: fade in quickly when element enters viewport
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // X: slide in from left early in scroll
  const x = useTransform(scrollYProgress, [0, 0.15], [-100, 0]);

  // Y: Three-state sticky logic
  // Only recalculates at key scroll points, not every pixel
  const y = useTransform(scrollYProgress, () => {
    if (!ref.current) return `${topPadding}px`;

    const rect = ref.current.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportMiddle = viewportHeight / 2;

    // Position of section bottom in viewport
    const sectionBottom = rect.top + sectionHeight;

    // Where would text be if stuck to top of section?
    const textAtTop = rect.top + topPadding;

    // Calculate if bottom of section would push text above middle
    const bottomPushPosition = sectionBottom - textHeight - bottomPadding;

    // Three-state sticky logic:
    if (textAtTop > viewportMiddle) {
      // State 1: Text hasn't reached viewport middle yet - stick to top of section
      return `${topPadding}px`;
    } else if (bottomPushPosition >= viewportMiddle) {
      // State 2: Text reached middle AND bottom hasn't caught up
      // LOCK to viewport middle (fixed position relative to section)
      return `${viewportMiddle - rect.top}px`;
    } else {
      // State 3: Bottom of section reached the text - unstick and pull up with it
      return `${sectionHeight - textHeight - bottomPadding}px`;
    }
  });

  // Transition only for initial slide-in
  const transition = {
    duration: slideDuration,
    ease: ANIMATIONS.stickyText.easing,
  };

  return {
    ref,
    opacity,
    x,
    y,
    transition,
  };
}
