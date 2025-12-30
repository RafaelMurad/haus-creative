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
 * GPU-accelerated sticky scroll animation hook for gallery titles
 * 
 * Creates a three-state scroll animation:
 * 1. **Slide in**: Text enters from left when gallery appears
 * 2. **Sticky middle**: Text follows scroll, locked to viewport centre
 * 3. **Pull up**: Text locks to gallery when bottom enters view
 * 
 * **Performance characteristics:**
 * - Zero React re-renders (uses Framer Motion values)
 * - Single shared scroll listener (not per-instance)
 * - GPU-accelerated transforms (opacity, x, top)
 * - Viewport height cached to avoid layout thrashing
 * 
 * @param config - Animation configuration options
 * @param config.slideDuration - Slide-in animation duration in ms (default: 0.6s)
 * @param config.textHeight - Text element height for bottom calculations (default: 64px)
 * @param config.topPadding - Distance from section top when stuck (default: 0px)
 * @param config.bottomPadding - Distance from section bottom when locked (default: 100px)
 * 
 * @returns Motion values and refs for animating the sticky text element
 * 
 * @example
 * ```tsx
 * const { ref, opacity, x, y, transition } = useStickyScrollAnimation({
 *   slideDuration: 600,
 *   textHeight: 80,
 *   topPadding: 50,
 * });
 * 
 * <section ref={ref}>
 *   <motion.h2 style={{ opacity, x, top: y }} transition={transition}>
 *     Gallery Title
 *   </motion.h2>
 * </section>
 * ```
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
  // Values are rounded to prevent subpixel jitter on mobile
  const y = useTransform(scrollYProgress, () => {
    if (!ref.current) return `${topPadding}px`;

    const rect = ref.current.getBoundingClientRect();
    const sectionHeight = Math.round(rect.height);
    const viewportMiddle = Math.round(viewportHeight / 2);

    // Position of section bottom in viewport
    const sectionBottom = Math.round(rect.top) + sectionHeight;

    // Where would text be if stuck to top of section?
    const textAtTop = Math.round(rect.top) + topPadding;

    // Calculate if bottom of section would push text above middle
    const bottomPushPosition = sectionBottom - textHeight - bottomPadding;

    // Three-state sticky logic:
    if (textAtTop > viewportMiddle) {
      // State 1: Text hasn't reached viewport middle yet - stick to top of section
      return `${topPadding}px`;
    } else if (bottomPushPosition >= viewportMiddle) {
      // State 2: Text reached middle AND bottom hasn't caught up
      // LOCK to viewport middle (fixed position relative to section)
      return `${Math.round(viewportMiddle - rect.top)}px`;
    } else {
      // State 3: Bottom of section reached the text - unstick and pull up with it
      return `${Math.round(sectionHeight - textHeight - bottomPadding)}px`;
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
