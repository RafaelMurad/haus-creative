"use client";
import {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import MediaItem from "./MediaItem";
import useGSAP from "../hooks/useGSAP";
import {
  GalleryConfig,
  MediaItem as MediaItemType,
  AnimationEffects,
} from "../types";
import { FixedSizeGrid as Grid } from "react-window";

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
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Use simplified GSAP loading
  const {
    isLoaded: isAnimationReady,
    gsapInstance,
    killAnimations,
  } = useGSAP();

  // Elements ref for animations
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

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

  // Set isReady based on layout and animation needs
  useEffect(() => {
    if (gallery.layout === "carousel" || gallery.layout === "fullscreen") {
      setIsReady(true);
    } else if (isAnimationReady) {
      setIsReady(true);
    }
  }, [isAnimationReady, gallery.layout]);

  // Basic animation setup for grid/masonry layouts
  useEffect(() => {
    if (gallery.layout === "carousel" || gallery.layout === "fullscreen") return;
    if (!isAnimationReady || !containerRef.current || !gsapInstance) return;

    const elements = elementsRef.current
      .filter(Boolean)
      .filter((el) => el instanceof Element);
    
    if (elements.length === 0) return;

    let animations: any[] = [];
    try {
      // Simple fade-in animation for grid items
      animations = elements.map((el, index) => {
        return gsapInstance.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
          }
        );
      });
      setIsReady(true);
    } catch (error) {
      console.error("Error setting up animations:", error);
      setIsReady(true);
    }

    return () => {
      animations.forEach((anim) => {
        if (anim && anim.kill) {
          anim.kill();
        }
      });
    };
  }, [isAnimationReady, gsapInstance, gallery.layout]);

  // Preload images for carousel
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen") return;
    if (!gallery.items.length) return;

    const preload = (index: number) => {
      const item = gallery.items[index];
      if (item && item.type === "image" && item.url) {
        const img = new window.Image();
        img.src = item.url;
      }
    };

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

    // Alignment
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
    if (gallery.container.margin && typeof gallery.container.margin === "string") {
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

  const getLayoutClass = (): string => {
    switch (gallery.layout) {
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
      case "masonry":
        return "columns-1 md:columns-2 lg:columns-3 gap-4";
      case "carousel":
      case "fullscreen":
        return "relative w-full h-full overflow-hidden";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
    }
  };

  // Navigation handlers for carousel
  const triggerNextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    const nextIndex = (activeIndex + 1) % gallery.items.length;
    setPrevIndex(activeIndex);
    setActiveIndex(nextIndex);
    setIsTransitioning(true);
    
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [activeIndex, gallery.items.length, isTransitioning]);

  const triggerPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    const prevIdx = (activeIndex - 1 + gallery.items.length) % gallery.items.length;
    setPrevIndex(activeIndex);
    setActiveIndex(prevIdx);
    setIsTransitioning(true);
    
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [activeIndex, gallery.items.length, isTransitioning]);

  // Auto-advance for carousel
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen") return;
    if (!isReady || !gallery.transitionTime) return;

    const interval = setInterval(() => {
      triggerNextSlide();
    }, gallery.transitionTime);

    return () => clearInterval(interval);
  }, [gallery.layout, isReady, gallery.transitionTime, triggerNextSlide]);

  // Simple crossfade animation
  useLayoutEffect(() => {
    if (prevIndex === null || !isTransitioning) return;
    if (!prevRef.current || !activeRef.current || !gsapInstance) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const duration = getAnimationConfig().duration || 0.7;

    switch (getAnimationConfig().effect) {
      case "none": {
        gsapInstance.set(prevRef.current, { opacity: 0 });
        gsapInstance.set(activeRef.current, { opacity: 1 });
        setPrevIndex(null);
        break;
      }
      case "fade":
      default: {
        timelineRef.current = gsapInstance.timeline({
          onComplete: () => setPrevIndex(null)
        });
        timelineRef.current
          .to(prevRef.current, { opacity: 0, duration: duration / 2 })
          .to(activeRef.current, { opacity: 1, duration: duration / 2 }, "-=0.1");
      }
    }
  }, [prevIndex, isTransitioning, gsapInstance]);

  const handleMediaLoad = () => {
    // No operation needed
  };

  // Render the appropriate layout
  const renderLayout = () => {
    switch (gallery.layout) {
      case "carousel":
      case "fullscreen": {
        return (
          <div className="relative w-full h-full">
            {/* Active item */}
            <div
              ref={activeRef}
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: 1 }}
            >
              <MediaItem
                item={gallery.items[activeIndex]}
                onLoad={handleMediaLoad}
              />
            </div>

            {/* Previous item for transitions */}
            {prevIndex !== null && (
              <div
                ref={prevRef}
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: 1 }}
              >
                <MediaItem
                  item={gallery.items[prevIndex]}
                  onLoad={handleMediaLoad}
                />
              </div>
            )}

            {/* Navigation buttons */}
            <button
              onClick={triggerPrevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity z-10"
              disabled={isTransitioning}
            >
              ←
            </button>
            <button
              onClick={triggerNextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity z-10"
              disabled={isTransitioning}
            >
              →
            </button>
          </div>
        );
      }

      case "grid":
      case "masonry":
      default: {
        return (
          <>
            {gallery.items.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => { elementsRef.current[index] = el; }}
                className="break-inside-avoid mb-4"
              >
                <MediaItem
                  item={item}
                  onLoad={handleMediaLoad}
                />
              </div>
            ))}
          </>
        );
      }
    }
  };

  // Calculate section height based on container configuration
  const sectionHeight = gallery.container?.height
    ? undefined
    : "min-h-[60vh] md:min-h-screen";

  const isFullscreen = gallery.layout === "fullscreen";

  return (
    <section
      className={`gallery-row w-full m-0 p-0 ${sectionHeight} ${
        isFullscreen ? "fullscreen-gallery" : ""
      }`}
    >
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
          <div className={`${getLayoutClass()} ${isFullscreen ? "h-full" : ""}`}>
            {gallery.items.length > 0 ? (
              renderLayout()
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No media items found for {gallery.id}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
