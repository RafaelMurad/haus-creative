import { useState, useEffect } from "react";

interface UseScrollDirectionOptions {
  /** Scroll position threshold before header hides (default: 100px) */
  hideThreshold?: number;
  /** Scroll position where header is always visible (default: 50px) */
  topThreshold?: number;
}

interface ScrollDirectionState {
  /** Whether the header should be visible */
  isVisible: boolean;
  /** Current scroll direction */
  direction: "up" | "down" | null;
}

/**
 * Custom hook to track scroll direction and determine header visibility
 *
 * @param options - Configuration options for scroll thresholds
 * @returns Object containing visibility state and scroll direction
 */
export function useScrollDirection(
  options: UseScrollDirectionOptions = {}
): ScrollDirectionState {
  const { hideThreshold = 100, topThreshold = 50 } = options;

  const [isVisible, setIsVisible] = useState(true);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      // Determine scroll direction
      if (scrollDifference > 0) {
        setDirection("down");
      } else if (scrollDifference < 0) {
        setDirection("up");
      }

      // Show header when at top or scrolling up
      if (currentScrollY < topThreshold) {
        setIsVisible(true);
      } else if (scrollDifference < 0) {
        // Scrolling up
        setIsVisible(true);
      } else if (scrollDifference > 0 && currentScrollY > hideThreshold) {
        // Scrolling down and past threshold
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideThreshold, topThreshold]);

  return { isVisible, direction };
}
