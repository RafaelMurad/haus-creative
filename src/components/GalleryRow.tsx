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
      if (!isTransitioning) {
        nextSlide();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isTransitioning, gallery.layout, isReady]);

  // Carousel transition logic
  const nextSlide = (): void => {
    if (isTransitioning || !gallery.items.length) return;

    setIsTransitioning(true);
    const nextIndex = (activeIndex + 1) % gallery.items.length;

    // Use GSAP to create a fade effect
    const container = containerRef.current?.querySelector(".media-item");

    if (container && gsapInstance) {
      // Create a timeline for smooth transition
      const timeline = gsapInstance.timeline({
        onComplete: () => {
          setActiveIndex(nextIndex);
          // Immediately update the image source by triggering a state change

          // Then fade the new image back in
          gsapInstance.to(container, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              setIsTransitioning(false);
            },
          });
        },
      });

      // Fade out current image
      timeline.to(container, {
        opacity: 0,
        scale: 0.97,
        duration: 0.6,
        ease: "power2.inOut",
      });
    } else {
      // Fallback if container not found
      setActiveIndex(nextIndex);
      setIsTransitioning(false);
    }
  };

  // Define a no-op function for onLoad to satisfy the type requirements
  const handleMediaLoad = () => {
    // No operation needed
  };

  // Render the appropriate layout
  const renderLayout = () => {
    switch (gallery.layout) {
      case "carousel":
      case "fullscreen":
        // Use a single container with a single image that changes source
        const activeItem = gallery.items[activeIndex];

        return (
          <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
            <div className="media-item relative overflow-hidden w-full h-full flex items-center justify-center min-h-[60vh] md:min-h-screen">
              {activeItem.type === "video" ? (
                <video
                  src={activeItem.url}
                  poster={activeItem.thumbUrl}
                  controls={false}
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  className="w-full h-full object-cover"
                  ref={(el) => {
                    if (elementsRef.current) {
                      elementsRef.current[activeIndex] = el;
                    }
                  }}
                  onLoadedData={handleMediaLoad}
                />
              ) : (
                <img
                  src={activeItem.url || activeItem.imageUrl}
                  alt={activeItem.title || ""}
                  className="w-full h-full object-cover"
                  ref={(el) => {
                    if (elementsRef.current) {
                      elementsRef.current[activeIndex] = el;
                    }
                  }}
                  onLoad={handleMediaLoad}
                />
              )}
            </div>
          </div>
        );

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
