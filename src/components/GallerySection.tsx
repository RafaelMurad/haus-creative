
"use client";
import React, { useEffect, useRef, useState } from "react";
import { MediaItem } from "../utils/galleryLoader";
import MediaItemComponent from "./MediaItem";
import gsap from "gsap";

interface GallerySectionProps {
  id: string;
  items: MediaItem[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ id, items }) => {
  // Crossfade logic for gallery1
  const isCrossfade = id === "gallery1";
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Flicker-free crossfade: preload next image, only update state after load, keep both images in DOM until fade-out completes
  useEffect(() => {
    if (!isCrossfade || items.length < 2) return;
    intervalRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      setPendingIndex(nextIndex);
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCrossfade, items.length, activeIndex]);

  // Preload pending image and only transition after it's loaded
  useEffect(() => {
    if (pendingIndex === null || pendingIndex === activeIndex) return;
    let cancelled = false;
    const img = new window.Image();
    img.src = items[pendingIndex].url;
    img.onload = () => {
      if (!cancelled) {
        setPrevIndex(activeIndex);
        setActiveIndex(pendingIndex);
        setIsTransitioning(true);
        setPendingIndex(null);
      }
    };
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingIndex, activeIndex, items]);

  // GSAP crossfade animation
  useEffect(() => {
    if (!isCrossfade || prevIndex === null || !isTransitioning) return;
    let completed = false;
    if (prevRef.current) {
      gsap.to(prevRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          if (prevRef.current) gsap.set(prevRef.current, { opacity: 1 });
          completed = true;
          setPrevIndex(null); // Remove previous image from DOM after fade-out
          setIsTransitioning(false);
        },
      });
    }
    if (activeRef.current) {
      gsap.fromTo(
        activeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: "power2.inOut" }
      );
    }
    return () => {
      if (!completed && prevRef.current) gsap.set(prevRef.current, { opacity: 1 });
    };
  }, [isCrossfade, prevIndex, activeRef, prevRef, isTransitioning]);

  // Clean, full-screen styling
  return (
    <section className="w-full h-screen flex items-center justify-center bg-white">
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        {isCrossfade && items.length > 0 ? (
          <>
            {/* Previous image (fading out) */}
            {prevIndex !== null && (
              <div
                ref={prevRef}
                className="absolute inset-0 w-full h-full z-10"
                style={{ pointerEvents: "none" }}
              >
                <MediaItemComponent item={items[prevIndex]} isActive={false} />
              </div>
            )}
            {/* Current image (fading in) */}
            <div
              ref={activeRef}
              className="absolute inset-0 w-full h-full z-20"
              style={{ pointerEvents: "auto" }}
            >
              <MediaItemComponent item={items[activeIndex]} isActive={true} />
            </div>
          </>
        ) : items.length > 0 ? (
          <MediaItemComponent item={items[0]} />
        ) : (
          <div className="text-gray-400">No media found</div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
