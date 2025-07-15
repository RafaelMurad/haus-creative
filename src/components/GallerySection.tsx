
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
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance for crossfade
  useEffect(() => {
    if (!isCrossfade || items.length < 2) return;
    intervalRef.current = setInterval(() => {
      setPrevIndex(activeIndex);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCrossfade, items.length, activeIndex]);

  // GSAP crossfade animation
  useEffect(() => {
    if (!isCrossfade || prevIndex === null) return;
    if (prevRef.current) {
      gsap.to(prevRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          if (prevRef.current) gsap.set(prevRef.current, { opacity: 1 });
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
  }, [isCrossfade, prevIndex, activeIndex]);

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
