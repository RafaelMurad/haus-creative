"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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
  /** Vertical translation motion value (GPU-accelerated transform) */
  y: MotionValue<number>;
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
 * - GPU-accelerated transforms (opacity, x, y via translateY)
 * - Viewport height cached to avoid layout thrashing
 * - Throttled getBoundingClientRect calls via progress threshold
 * - Returns numeric values for smooth Framer Motion interpolation
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
 *   <motion.h2 style={{ opacity, x, y }} transition={transition}>
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
  
  // Cache for throttling getBoundingClientRect calls
  const lastProgress = useRef(0);
  const cachedY = useRef(topPadding);
  // Threshold for recalculating - lower values = more updates, higher = smoother but less accurate
  const PROGRESS_THRESHOLD = 0.002;

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

  // Memoized Y calculation to reduce function recreation
  const calculateY = useCallback((progress: number): number => {
    if (!ref.current || viewportHeight === 0) return topPadding;

    // Throttle: only recalculate if progress changed significantly
    if (Math.abs(progress - lastProgress.current) < PROGRESS_THRESHOLD) {
      return cachedY.current;
    }
    lastProgress.current = progress;

    const rect = ref.current.getBoundingClientRect();
    const sectionHeight = Math.round(rect.height);
    const viewportMiddle = Math.round(viewportHeight / 2);

    // Position of section bottom in viewport
    const sectionBottom = Math.round(rect.top) + sectionHeight;

    // Where would text be if stuck to top of section?
    const textAtTop = Math.round(rect.top) + topPadding;

    // Calculate if bottom of section would push text above middle
    const bottomPushPosition = sectionBottom - textHeight - bottomPadding;

    let newY: number;

    // Three-state sticky logic:
    if (textAtTop > viewportMiddle) {
      // State 1: Text hasn't reached viewport middle yet - stick to top of section
      newY = topPadding;
    } else if (bottomPushPosition >= viewportMiddle) {
      // State 2: Text reached middle AND bottom hasn't caught up
      // LOCK to viewport middle (fixed position relative to section)
      newY = Math.round(viewportMiddle - rect.top);
    } else {
      // State 3: Bottom of section reached the text - unstick and pull up with it
      newY = Math.round(sectionHeight - textHeight - bottomPadding);
    }

    cachedY.current = newY;
    return newY;
  }, [viewportHeight, textHeight, topPadding, bottomPadding]);

  // Y: Three-state sticky logic with GPU-accelerated transform
  // Returns numeric value for Framer Motion's translateY
  const y = useTransform(scrollYProgress, calculateY);

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
