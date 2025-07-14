"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import MediaItem from "./MediaItem";
import useGsapAnimation from "../hooks/useGsapAnimation";
import {
  GalleryConfig,
  MediaItem as MediaItemType,
  AnimationEffects,
} from "../types";
import { FixedSizeGrid as Grid } from "react-window";
// import gsap from "gsap"; // No longer needed, handled by useGsapAnimation
import { debugGalleryStructure } from "../utils/debugHelper";

interface GalleryRowProps {
  gallery: GalleryConfig;
}

export default function GalleryRow({ gallery }: GalleryRowProps) {
  // Helper function to get animation config with defaults
  const getAnimationConfig = () => {
    return (
      gallery.animation || {
        effect: "none" as const,
        duration: 0,
        ease: "none" as const,
        stagger: 0,
        from: {},
        to: {},
      }
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null); // Track previous image for crossfade
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  // Removed gsapInstance state, handled by useGsapAnimation

  // Debug gallery structure in development
  useEffect(() => {
    debugGalleryStructure(gallery.id, gallery);
  }, [gallery]);

  // Cleanup on unmount: kill GSAP timelines, clear timeouts, null refs
  useEffect(() => {
    return () => {
      // Null refs first to help GC
      containerRef.current = null;
      activeRef.current = null;
      prevRef.current = null;
      // Then kill timelines/contexts
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Removed dynamic import of gsap, handled globally

  // Set isReady immediately for carousel/fullscreen layouts
  useEffect(() => {
    if (gallery.layout === "carousel" || gallery.layout === "fullscreen") {
      setIsReady(true);
    }
  }, [gallery.layout]);

  // Set up the elements ref without ScrollTrigger initially
  const { elementsRef } = useGsapAnimation(
    {
      effect: getAnimationConfig().effect,
      duration: getAnimationConfig().duration,
      ease: getAnimationConfig().ease,
      stagger: getAnimationConfig().stagger || 0.15,
      from: getAnimationConfig().from,
      to: getAnimationConfig().to,
    },
    [gallery.id]
  );

  // useGsapAnimation now handles ScrollTrigger and cleanup
  useEffect(() => {
    setIsReady(true);
  }, []);

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

  const getContainerClass = (): string => {
    const baseClasses = "relative";
    if (!gallery.container) return baseClasses + " w-full";

    return baseClasses;
  };

  const getContainerStyle = (): React.CSSProperties => {
    if (!gallery.container) return { width: "100%", height: "100%" };

    const styles: React.CSSProperties = {};

    // Width properties
    if (gallery.container.width) {
      styles.width = gallery.container.width;
    } else {
      styles.width = "100%";
    }

    if (gallery.container.minWidth) {
      styles.minWidth = gallery.container.minWidth;
    }

    if (gallery.container.maxWidth) {
      styles.maxWidth = gallery.container.maxWidth;
    }

    // Height properties
    if (gallery.container.height) {
      styles.height = gallery.container.height;
    } else {
      // Default height if not specified - needed for proper layout
      styles.height = "100%";
    }

    if (gallery.container.minHeight) {
      styles.minHeight = gallery.container.minHeight;
    }

    if (gallery.container.maxHeight) {
      styles.maxHeight = gallery.container.maxHeight;
    }

    // Aspect ratio
    if (gallery.container.aspectRatio) {
      styles.aspectRatio = gallery.container.aspectRatio;
    }

    // Add alignment styles
    switch (gallery.container.alignment) {
      case "right":
        styles.marginLeft = "auto";
        styles.marginRight = "0";
        break;
      case "center":
        styles.marginLeft = "auto";
        styles.marginRight = "auto";
        break;
      case "left":
        styles.marginRight = "auto";
        styles.marginLeft = "0";
        break;
    }

    // Additional style properties
    if (gallery.container.padding) {
      styles.padding = gallery.container.padding;
    }

    if (
      gallery.container.margin &&
      typeof gallery.container.margin === "string"
    ) {
      styles.margin = gallery.container.margin;
    }

    if (gallery.container.background) {
      styles.background = gallery.container.background;
    }

    if (gallery.container.borderRadius) {
      styles.borderRadius = gallery.container.borderRadius;
    }

    return styles;
  };

  // Handle different gallery layouts
  const getLayoutClass = (): string => {
    switch (gallery.layout) {
      case "grid":
        // Grid layout handles its own width/height internally or via parent constraints
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[60vh] md:min-h-screen w-full";
      case "masonry":
        return "columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 min-h-[60vh] md:min-h-screen w-full";
      case "fullscreen":
        // Fullscreen mode - take over entire viewport with no margins or padding
        return "relative h-full w-full overflow-hidden flex items-center justify-center";
      case "carousel":
        // For carousel, ensure it gets proper height and handles overflow
        return "relative h-full w-full overflow-hidden flex items-center justify-center";
      default:
        // Default layout also handles its own width or relies on parent
        return "flex flex-wrap gap-4 min-h-[60vh] md:min-h-screen w-full";
    }
  };

  // Improved GSAP crossfade transition logic using useGSAP
  const triggerNextSlide = useCallback((): void => {
    if (isTransitioning || !gallery.items.length) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const next = (activeIndex + 1) % gallery.items.length;
    setPrevIndex(activeIndex);
    setActiveIndex(next);
    setIsTransitioning(true);

    // Reduced fallback timeout for better responsiveness
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setPrevIndex(null);
    }, (getAnimationConfig().duration || 0.7) * 1000 + 100);
  }, [isTransitioning, gallery.items.length, activeIndex, getAnimationConfig]);

  // Animate crossfade/slide/scale using useGSAP context-safe pattern
  useGSAP(() => {
    if (prevIndex === null) return;
    // Animate previous slide out
    if (prevRef.current) {
      gsap.to(prevRef.current, {
        opacity: 0,
        duration: getAnimationConfig().duration || 0.7,
        ease: getAnimationConfig().ease || "power1.inOut",
        onComplete: () => {
          if (prevRef.current) {
            gsap.set(prevRef.current, { opacity: 1 }); // Reset for next use
          }
        },
      });
    }
    // Animate active slide in
    if (activeRef.current) {
      gsap.fromTo(
        activeRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: getAnimationConfig().duration || 0.7,
          ease: getAnimationConfig().ease || "power1.inOut",
        }
      );
    }
  }, [prevIndex, activeIndex, gallery.id]);

  // Set up carousel autoplay for carousel layouts
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen")
      return;
    if (!isReady) return;
    if (!gallery.transitionTime) return; // No autoplay for galleries without transitionTime (like video galleries)

    const interval = setInterval(() => {
      triggerNextSlide();
    }, gallery.transitionTime); // Use configured time

    return () => clearInterval(interval);
  }, [gallery.layout, isReady, gallery.transitionTime, triggerNextSlide]);

  // Animate crossfade when prevIndex changes
  // TODO: Refactor crossfade/slide/scale animations to use useGSAP contextSafe pattern for event-driven transitions
  // (This will be handled in the next incremental step)

  // Define a no-op function for onLoad to satisfy the type requirements
  const handleMediaLoad = () => {
    // No operation needed
  };

  // Render the appropriate layout
  const renderLayout = () => {
    switch (gallery.layout) {
      case "carousel":
      case "fullscreen": {
        // Special handling for infinite scroll treadmill effect (gallery6 and gallery11)

        if (gallery.id === "gallery6" || gallery.id === "gallery11") {
          const trackRef = useRef<HTMLDivElement>(null);
          // Use a ref to store cleanup functions for treadmill effect
          const treadmillCleanupRef = useRef<(() => void) | null>(null);

          useEffect(() => {
            if (!trackRef.current) return;
            let currentTimeline: gsap.core.Timeline | null = null;
            let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
            let ctx: gsap.Context | null = null;

            const getWindowDimensions = () => {
              const baseImageWidth = 720;
              const imageWidth =
                gallery.id === "gallery11"
                  ? Math.round(baseImageWidth * 0.8)
                  : baseImageWidth;
              return {
                width: window.innerWidth,
                imageWidth,
              };
            };

            const calculateCenterPosition = (imageIndex, width, imageWidth) => {
              const gap = width;
              const imagePosition = imageIndex * (imageWidth + gap);
              const centerPosition = (width - imageWidth) / 2;
              return centerPosition - imagePosition;
            };

            const createTimeline = () => {
              const { width, imageWidth } = getWindowDimensions();
              const gap = width;
              const totalItems = gallery.items.length;
              const centerPositions = Array.from(
                { length: totalItems },
                (_, i) => calculateCenterPosition(i + 1, width, imageWidth)
              );
              const tl = gsap.timeline({ repeat: -1 });
              tl.to({}, { duration: 2 });
              for (let i = 0; i < totalItems; i++) {
                const targetPosition = centerPositions[i];
                tl.to(trackRef.current, {
                  x: targetPosition,
                  duration: 1.8,
                  ease: "power1.inOut",
                  force3D: true,
                });
                if (i < totalItems - 1) {
                  tl.to({}, { duration: 2 });
                }
              }
              tl.set(trackRef.current, {
                x: 0,
                force3D: true,
              });
              return tl;
            };

            const handleResize = () => {
              if (currentTimeline) {
                currentTimeline.kill();
                currentTimeline = null;
              }
              gsap.set(trackRef.current, {
                x: 0,
                force3D: true,
              });
              currentTimeline = createTimeline();
            };

            const debouncedResize = () => {
              if (resizeTimeout) clearTimeout(resizeTimeout);
              resizeTimeout = setTimeout(handleResize, 150);
            };

            ctx = gsap.context(() => {
              currentTimeline = createTimeline();
              window.addEventListener("resize", debouncedResize);
            }, trackRef);

            treadmillCleanupRef.current = () => {
              // Null refs first to help GC
              if (trackRef.current) trackRef.current = null;
              // Then remove listeners and kill timelines/contexts
              window.removeEventListener("resize", debouncedResize);
              if (resizeTimeout) {
                clearTimeout(resizeTimeout);
                resizeTimeout = null;
              }
              if (currentTimeline) {
                currentTimeline.kill();
                currentTimeline = null;
              }
              if (ctx) {
                ctx.revert();
                ctx = null;
              }
            };

            return () => {
              if (treadmillCleanupRef.current) treadmillCleanupRef.current();
              treadmillCleanupRef.current = null;
            };
          }, [gallery.items]);

          return (
            <div
              className="treadmill-container"
              style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                pointerEvents: "none", // Disable all interactions
              }}
            >
              <div
                ref={trackRef}
                className="treadmill-track"
                style={{
                  display: "flex",
                  alignItems: "center",
                  transform: "translateX(calc((100vw - 720px) / 2))", // Initial CSS centering to prevent flash
                  willChange: "transform",
                  gap: "100vw", // Full viewport width gap - only one image visible at a time
                  pointerEvents: "none", // Disable all interactions on track
                }}
              >
                {/* Duplicate the images array for seamless loop */}
                {[...gallery.items, ...gallery.items].map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    style={{
                      flexShrink: 0,
                      width: "720px", // Increased by 20% from 600px
                      height: "96vh", // Increased by 20% from 80vh
                      maxHeight: "960px", // Increased by 20% from 800px
                      pointerEvents: "none", // Disable all interactions on image containers
                    }}
                  >
                    <MediaItem
                      item={item}
                      className="w-full h-full object-cover border-none outline-none pointer-events-none"
                      priority={index < 6} // Prioritize first few items
                      isActive={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        }

        const activeItem = gallery.items[activeIndex];
        const prevItem = prevIndex !== null ? gallery.items[prevIndex] : null;

        // Safety check for items
        if (!activeItem) {
          return (
            <div className="flex items-center justify-center h-full w-full text-gray-500">
              No active item to display
            </div>
          );
        }

        // Add special styles for fullscreen mode
        const isFullscreen = gallery.layout === "fullscreen";
        const containerStyle: React.CSSProperties = isFullscreen
          ? {
              height: "100vh",
              width: "100vw",
              position: "relative",
              margin: 0,
              padding: 0,
            }
          : {
              height: "100%",
              width: "100%",
              position: "relative" as "relative",
            };

        return (
          <div
            className={`relative overflow-hidden flex items-center justify-center ${
              isFullscreen ? "fullscreen-container" : ""
            }`}
            style={containerStyle}
          >
            {/* Previous slide (fading out) */}
            {prevItem && (
              <div
                ref={prevRef}
                className="media-item absolute inset-0 w-full h-full"
                style={{ zIndex: 1 }}
              >
                <MediaItem
                  item={prevItem}
                  className="w-full h-full object-cover"
                  priority={true}
                  isActive={false} // Previous item should not be active (pause videos)
                />
              </div>
            )}
            {/* Current slide (fading in) */}
            <div
              ref={activeRef}
              className="media-item absolute inset-0 w-full h-full"
              style={{ zIndex: 2 }}
            >
              <MediaItem
                item={activeItem}
                className="w-full h-full object-cover"
                priority={true}
                isActive={true} // Current item should be active (play videos)
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
                  <MediaItem item={item} priority={true} />
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
              priority={true}
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

  // For the outer gallery-row container, we always ensure it's full width
  // The inner content container is only rendered if gallery.container exists
  const sectionHeight = gallery.container?.height
    ? undefined // If container has explicit height, don't set min-height on section
    : "min-h-[60vh] md:min-h-screen";

  // Add fullscreen-gallery class if layout is fullscreen
  const isFullscreen = gallery.layout === "fullscreen";

  return (
    <section
      className={`gallery-row w-full m-0 p-0 ${sectionHeight} ${
        isFullscreen ? "fullscreen-gallery" : ""
      }`}
    >
      {/* Outer full-width container, configurable per gallery */}
      <div
        className={`w-full ${isFullscreen ? "h-screen" : ""}`}
        ref={containerRef}
        style={gallery.galleryContainer ? { ...gallery.galleryContainer } : {}}
      >
        <div
          className={`gallery-content ${isFullscreen ? "h-full" : ""}`}
          style={
            gallery.container
              ? { ...getContainerStyle() }
              : { position: "relative", width: "100%", height: "100%" }
          }
        >
          <div
            className={`${getLayoutClass()} ${isFullscreen ? "h-full" : ""}`}
          >
            {gallery.items.length > 0 ? (
              renderLayout()
            ) : (
              <div className="flex items-center justify-center h-full w-full text-gray-500">
                No images found for this gallery
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
