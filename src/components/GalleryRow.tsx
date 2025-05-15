"use client";

import { useState, useRef, useEffect } from "react";
import MediaItem from "./MediaItem";
import useGsapAnimation from "../hooks/useGsapAnimation";
import { GalleryConfig, MediaItem as MediaItemType } from "../types";
import { FixedSizeGrid as Grid } from "react-window";

interface GalleryRowProps {
  gallery: GalleryConfig;
}

export default function GalleryRow({ gallery }: GalleryRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null); // Track previous image for crossfade
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [gsapInstance, setGsapInstance] = useState<any>(null);

  // Dynamically import gsap on mount
  useEffect(() => {
    let isMounted = true;
    import("gsap").then((mod) => {
      if (isMounted) setGsapInstance(mod.gsap || mod.default || mod);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Set isReady immediately for carousel/fullscreen layouts
  useEffect(() => {
    if (gallery.layout === "carousel" || gallery.layout === "fullscreen") {
      setIsReady(true);
    }
  }, [gallery.layout]);

  // Set up the elements ref without ScrollTrigger initially
  const { elementsRef } = useGsapAnimation(
    {
      effect: gallery.animation.effect,
      duration: gallery.animation.duration,
      ease: gallery.animation.ease,
      stagger: gallery.animation.stagger || 0.15,
      from: gallery.animation.from,
      to: gallery.animation.to,
    },
    [gallery.id]
  );

  // Set up ScrollTrigger after the component mounts and refs are populated
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    if (!gsapInstance) return;

    const elements = elementsRef.current
      .filter(Boolean)
      .filter((el) => el instanceof Element);
    if (elements.length === 0) return;

    // Create animations with ScrollTrigger when the DOM is ready
    const animations = elements.map((el, index) => {
      return gsapInstance.fromTo(
        el,
        { ...gallery.animation.from },
        {
          ...gallery.animation.to,
          duration: gallery.animation.duration,
          ease: gallery.animation.ease,
          delay: index * (gallery.animation.stagger || 0.15),
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );
    });

    setIsReady(true);

    // Clean up on unmount
    return () => {
      animations.forEach((anim) => {
        if (anim && anim.scrollTrigger) {
          anim.scrollTrigger.kill();
        }
        anim.kill();
      });
    };
  }, [gallery.id, gallery.animation, elementsRef, gsapInstance]);

  // Preload next and previous images in carousel
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen")
      return;
    if (!gallery.items.length) return;
    const preload = (index: number) => {
      const item = gallery.items[index];
      if (item && item.type === "image" && item.url) {
        const img = new window.Image();
        img.src = item.url;
      }
    };
    // Preload next and previous images
    preload((activeIndex + 1) % gallery.items.length);
    preload((activeIndex - 1 + gallery.items.length) % gallery.items.length);
  }, [activeIndex, gallery.layout, gallery.items]);

  // Handle different gallery layouts
  const getLayoutClass = (): string => {
    switch (gallery.layout) {
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[60vh] md:min-h-screen w-full";
      case "masonry":
        return "columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 min-h-[60vh] md:min-h-screen w-full";
      case "carousel":
      case "fullscreen":
        return "relative min-h-[60vh] md:min-h-screen w-full";
      default:
        return "flex flex-wrap gap-4 min-h-[60vh] md:min-h-screen w-full";
    }
  };

  // Set up carousel autoplay for carousel layouts
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen")
      return;
    if (!isReady) return;

    const interval = setInterval(() => {
      if (!isTransitioning && prevIndex === null) {
        triggerNextSlide();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isTransitioning, prevIndex, gallery.layout, isReady]);

  // Improved crossfade transition logic
  const triggerNextSlide = (): void => {
    if (isTransitioning || !gallery.items.length) return;
    const next = (activeIndex + 1) % gallery.items.length;
    setPrevIndex(activeIndex);
    setActiveIndex(next);
    setIsTransitioning(true);
    setTimeout(() => {
      setPrevIndex(null);
      setIsTransitioning(false);
    }, 400); // 400ms crossfade
  };

  // Define a no-op function for onLoad to satisfy the type requirements
  const handleMediaLoad = () => {
    // No operation needed
  };

  // Render the appropriate layout
  const renderLayout = () => {
    switch (gallery.layout) {
      case "carousel":
      case "fullscreen": {
        const activeItem = gallery.items[activeIndex];
        const prevItem = prevIndex !== null ? gallery.items[prevIndex] : null;
        return (
          <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
            {/* Previous image (fading out) */}
            {prevItem && (
              <div
                className={`media-item absolute inset-0 transition-opacity duration-400 ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
                style={{ zIndex: 1 }}
              >
                <MediaItem
                  item={prevItem}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {/* Current image (fading in) */}
            <div
              className={`media-item absolute inset-0 transition-opacity duration-400 opacity-100`}
              style={{ zIndex: 2 }}
            >
              <MediaItem
                item={activeItem}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
      }

      case "grid":
      case "masonry": {
        // Virtualized grid for performance
        const columnCount = 3; // Common default for desktop
        const rowCount = Math.ceil(gallery.items.length / columnCount);
        const cellWidth = 300; // px
        const cellHeight = 300; // px
        const width = columnCount * cellWidth;
        const height = 900; // Show 3 rows at a time (can be adjusted)

        return (
          <Grid
            columnCount={columnCount}
            rowCount={rowCount}
            columnWidth={cellWidth}
            rowHeight={cellHeight}
            width={width}
            height={height}
            itemData={gallery.items}
          >
            {({ columnIndex, rowIndex, style, data }) => {
              const index = rowIndex * columnCount + columnIndex;
              if (index >= data.length) return null;
              const item = data[index];
              return (
                <div style={style} key={item.id} className="p-2">
                  <MediaItem item={item} />
                </div>
              );
            }}
          </Grid>
        );
      }

      default:
        return gallery.items.map((item, index) => (
          <div
            key={item.id}
            className={
              gallery.layout === "masonry" ? "mb-4 break-inside-avoid" : ""
            }
          >
            <MediaItem
              item={item}
              forwardedRef={(el) => {
                if (elementsRef.current) {
                  elementsRef.current[index] = el;
                }
              }}
              onLoad={handleMediaLoad}
            />
          </div>
        ));
    }
  };

  return (
    <section className="gallery-row w-full m-0 p-0 min-h-[60vh] md:min-h-screen">
      <div
        ref={containerRef}
        className={getLayoutClass() + " h-full w-full m-0 p-0"}
      >
        {renderLayout()}
      </div>
    </section>
  );
}
