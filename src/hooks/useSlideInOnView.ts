"use client";

import { useEffect, useRef, useState } from "react";

interface UseSlideInOnViewOptions {
  /** Threshold for intersection (0-1). Default: 0.5 (50% visible) */
  threshold?: number;
  /** Root margin to trigger earlier/later. Default: "0px" */
  rootMargin?: string;
  /** Only trigger once. Default: true */
  triggerOnce?: boolean;
}

interface UseSlideInOnViewResult {
  /** Ref to attach to the element */
  ref: React.RefObject<HTMLDivElement | null>;
  /** Whether the element is visible */
  isVisible: boolean;
}

/**
 * Intersection Observer hook for triggering slide-in animations
 * 
 * Uses native browser APIs - no JavaScript execution during scroll.
 * Only triggers when element enters/exits viewport threshold.
 * 
 * @param options - Configuration options
 * @returns Ref and visibility state
 * 
 * @example
 * ```tsx
 * const { ref, isVisible } = useSlideInOnView({ threshold: 0.3 });
 * 
 * <div 
 *   ref={ref} 
 *   data-visible={isVisible}
 *   className="opacity-0 data-[visible=true]:opacity-100 transition-opacity"
 * >
 *   Content
 * </div>
 * ```
 */
export function useSlideInOnView(
  options: UseSlideInOnViewOptions = {}
): UseSlideInOnViewResult {
  const { threshold = 0.5, rootMargin = "0px", triggerOnce = true } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if already triggered and triggerOnce is true
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            hasTriggered.current = true;

            // Unobserve if only triggering once
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

