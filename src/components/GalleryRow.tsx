"use client";

import { useLayoutEffect, useState, useRef, useEffect, useCallback } from "react";
import MediaItem from "./MediaItem";
import useGSAP from "../hooks/useGSAP";
import { GalleryConfig } from "../types";

interface GalleryRowProps {
  gallery: GalleryConfig;
}

export default function GalleryRow({ gallery }: GalleryRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const { isLoaded: isGSAPReady, gsapInstance, killAnimations } = useGSAP();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      killAnimations();
    };
  }, [killAnimations]);

  // Treadmill animation effect for gallery6 and gallery11
  useEffect(() => {
    if (gallery.type !== 'treadmill' || !isGSAPReady || !gsapInstance || !trackRef.current) return;

    const track = trackRef.current;
    const items = track.children;
    if (items.length === 0) return;

    // Calculate total width for seamless loop
    let totalWidth = 0;
    Array.from(items).forEach((item) => {
      totalWidth += (item as HTMLElement).offsetWidth;
    });

    // Create continuous scroll animation
    const animation = gsapInstance.to(track, {
      x: -totalWidth / 2, // Move half the distance (since we duplicate items)
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    return () => {
      if (animation) animation.kill();
    };
  }, [gallery.type, isGSAPReady, gsapInstance]);

  // Auto-advance for crossfade galleries
  const triggerNextSlide = useCallback(() => {
    if (isTransitioning || gallery.items.length <= 1) return;
    
    const nextIndex = (activeIndex + 1) % gallery.items.length;
    setPrevIndex(activeIndex);
    setActiveIndex(nextIndex);
    setIsTransitioning(true);
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
      setPrevIndex(null);
    }, 1000);
  }, [activeIndex, gallery.items.length, isTransitioning]);

  // Set up auto-advance for crossfade galleries
  useEffect(() => {
    if (gallery.type !== 'crossfade' || !gallery.autoAdvance) return;

    const interval = setInterval(triggerNextSlide, gallery.autoAdvance);
    return () => clearInterval(interval);
  }, [gallery.type, gallery.autoAdvance, triggerNextSlide]);

  // Crossfade animation
  useLayoutEffect(() => {
    if (gallery.type !== 'crossfade' || prevIndex === null || !isTransitioning) return;
    if (!prevRef.current || !activeRef.current || !gsapInstance) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Simple crossfade animation
    gsapInstance.set(activeRef.current, { opacity: 0 });
    
    timelineRef.current = gsapInstance.timeline({
      onComplete: () => {
        setPrevIndex(null);
        setIsTransitioning(false);
      }
    });

    timelineRef.current
      .to(prevRef.current, { opacity: 0, duration: 0.7 })
      .to(activeRef.current, { opacity: 1, duration: 0.7 }, "-=0.3");

  }, [gallery.type, prevIndex, isTransitioning, gsapInstance]);

  // Render based on gallery type
  const renderGallery = () => {
    switch (gallery.type) {
      case 'static':
        // Single static image
        return (
          <div className="w-full h-full flex items-center justify-center">
            <MediaItem item={gallery.items[0]} isActive={true} />
          </div>
        );

      case 'crossfade':
        // Crossfade carousel
        const activeItem = gallery.items[activeIndex];
        const prevItem = prevIndex !== null ? gallery.items[prevIndex] : null;

        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* Previous item (fading out) */}
            {prevItem && (
              <div ref={prevRef} className="absolute inset-0 w-full h-full">
                <MediaItem item={prevItem} isActive={false} />
              </div>
            )}
            {/* Current item (fading in) */}
            <div ref={activeRef} className="absolute inset-0 w-full h-full">
              <MediaItem item={activeItem} isActive={true} />
            </div>
          </div>
        );

      case 'treadmill':
        // Continuous horizontal scroll
        return (
          <div className="w-full h-full overflow-hidden flex items-center">
            <div
              ref={trackRef}
              className="flex items-center gap-[100vw]"
              style={{ willChange: 'transform' }}
            >
              {/* Duplicate items for seamless loop */}
              {[...gallery.items, ...gallery.items].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: '720px', height: '80vh' }}
                >
                  <MediaItem item={item} isActive={true} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'video':
        // Single video (no transitions)
        return (
          <div className="w-full h-full flex items-center justify-center">
            <MediaItem item={gallery.items[0]} isActive={true} />
          </div>
        );

      default:
        return <div>Unknown gallery type</div>;
    }
  };

  return (
    <section className="gallery-row w-full h-screen flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full">
        {gallery.items.length > 0 ? renderGallery() : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No items found for {gallery.id}
          </div>
        )}
      </div>
    </section>
  );
}