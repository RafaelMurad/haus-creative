"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/config/projects";
import {
  getSimpleAnimation,
  type SimpleAnimationType,
} from "@/utils/animationConfigs";

interface SimpleCarouselProps {
  items: ProjectMedia[];
  animation: SimpleAnimationType;
  autoAdvanceTime?: number;
  className?: string;
  /** Image sizes hint for responsive loading. Defaults to "100vw". */
  sizes?: string;
  /** Whether the first image should load eagerly. Defaults to false. */
  priority?: boolean;
}

/**
 * SimpleCarousel — CSS-only auto-advancing carousel.
 *
 * Renders slides in a stacked layout (absolute positioning).
 * Transitions between slides using CSS transitions based on animation type.
 * Auto-advances via setInterval, pauses when tab is hidden.
 *
 * No navigation dots or controls — luxury portfolio aesthetic.
 */
export function SimpleCarousel({
  items,
  animation,
  autoAdvanceTime,
  className = "",
  sizes = "100vw",
  priority = false,
}: SimpleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animConfig = getSimpleAnimation(animation);

  const clearAutoAdvance = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoAdvance = useCallback(() => {
    if (!autoAdvanceTime || items.length <= 1) return;
    clearAutoAdvance();
    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, autoAdvanceTime);
  }, [autoAdvanceTime, items.length, clearAutoAdvance]);

  // Auto-advance effect
  useEffect(() => {
    startAutoAdvance();
    return clearAutoAdvance;
  }, [startAutoAdvance, clearAutoAdvance]);

  // Pause when tab is hidden (Page Visibility API)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        clearAutoAdvance();
      } else {
        startAutoAdvance();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [startAutoAdvance, clearAutoAdvance]);

  if (items.length === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Gallery"
      aria-live="off"
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={`${item.desktop}-${index}`}
            data-slide-index={index}
            data-active={isActive}
            style={getSlideStyles(
              animConfig.type,
              animConfig.duration,
              animConfig.easing,
              index,
              activeIndex,
            )}
            className="absolute inset-0"
          >
            {item.type === "video" ? (
              <video
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                loop
                muted
              >
                {item.mobile && (
                  <source
                    src={item.mobile}
                    type="video/mp4"
                    media="(max-width: 768px)"
                  />
                )}
                <source src={item.desktop} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={item.desktop}
                alt={item.alt}
                fill
                className="object-cover"
                sizes={sizes}
                priority={priority && index === 0}
                loading={priority && index === 0 ? "eager" : "lazy"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Slide style computation — pure function, no hooks
// =============================================================================

function getSlideStyles(
  type: SimpleAnimationType,
  duration: number,
  easing: string,
  index: number,
  activeIndex: number,
): React.CSSProperties {
  const isActive = index === activeIndex;
  const transition = type === "none" ? "none" : `all ${duration}s ${easing}`;

  const base: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transition,
    pointerEvents: isActive ? "auto" : "none",
  };

  switch (type) {
    case "fade":
      return { ...base, opacity: isActive ? 1 : 0 };

    case "slide":
      return {
        ...base,
        transform: `translateX(${(index - activeIndex) * 100}%)`,
        opacity: 1,
      };

    case "slideUp":
      return {
        ...base,
        transform: `translateY(${isActive ? "0%" : "20%"})`,
        opacity: isActive ? 1 : 0,
      };

    case "scale":
      return {
        ...base,
        transform: `scale(${isActive ? 1 : 0.9})`,
        opacity: isActive ? 1 : 0,
      };

    case "blur":
      return {
        ...base,
        filter: `blur(${isActive ? "0px" : "8px"})`,
        transform: `scale(${isActive ? 1 : 1.05})`,
        opacity: isActive ? 1 : 0,
      };

    case "none":
    default:
      return {
        ...base,
        opacity: isActive ? 1 : 0,
      };
  }
}
