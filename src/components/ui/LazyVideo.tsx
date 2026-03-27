"use client";

import { useRef, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface LazyVideoProps {
  src: string;
  srcMobile?: string;
  poster?: string;
  className?: string;
  /** Root margin for IntersectionObserver — how far before viewport to start loading. */
  rootMargin?: string;
}

/**
 * LazyVideo — only loads and plays video when it enters (or nears) the viewport.
 *
 * Uses IntersectionObserver to detect visibility. While off-screen the video
 * has `preload="none"` and no `src` on `<source>` elements, so zero bytes
 * are fetched. When the element enters the rootMargin zone, sources are set
 * and playback begins. When the element leaves the viewport, playback pauses
 * to save CPU and bandwidth.
 *
 * Always renders muted, looped, playsInline — designed for background/ambient video.
 */
export function LazyVideo({
  src,
  srcMobile,
  poster,
  className = "",
  rootMargin = "200px",
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { elementRef, isVisible, isCurrentlyVisible } =
    useIntersectionObserver({
      threshold: 0.1,
      rootMargin,
      triggerOnce: false,
    });

  // Load video sources once visible for the first time
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      // Force the browser to pick up the new sources
      video.load();
    }
  }, [isVisible]);

  // Play/pause based on current visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasLoadedRef.current) return;

    if (isCurrentlyVisible) {
      video.play().catch(() => {
        // Autoplay blocked — silently ignore
      });
    } else {
      video.pause();
    }
  }, [isCurrentlyVisible]);

  return (
    <div ref={elementRef}>
      <video
        ref={videoRef}
        className={className}
        playsInline
        loop
        muted
        poster={poster}
        preload="none"
      >
        {srcMobile && (
          <source
            src={isVisible ? srcMobile : undefined}
            type="video/mp4"
            media="(max-width: 768px)"
          />
        )}
        <source
          src={isVisible ? src : undefined}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
