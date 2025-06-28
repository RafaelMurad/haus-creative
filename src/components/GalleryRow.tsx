"use client";

import {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { lazy, Suspense } from "react";
import useGsapAnimation from "../hooks/useGsapAnimation";
import {
  GalleryConfig,
  MediaItem as MediaItemType,
  AnimationEffects,
} from "../types";

// Lazy load heavy components
const MediaItem = lazy(() => import("./MediaItem"));
const VirtualizedGrid = lazy(() => import("./VirtualizedGrid"));
const TreadmillGallery = lazy(() => import("./TreadmillGallery"));

interface GalleryRowProps {
  gallery: GalleryConfig;
}

export default function GalleryRow({ gallery }: GalleryRowProps) {
  // Memoize animation config to prevent unnecessary recalculations
  const animationConfig = useMemo(() => {
    return gallery.animation || {
      effect: "none" as const,
      duration: 0,
      ease: "none" as const,
      stagger: 0,
      from: {},
      to: {},
    };
  }, [gallery.animation]);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [gsapInstance, setGsapInstance] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Detect mobile and reduced motion preferences
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReducedMotion = () => 
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    checkMobile();
    checkReducedMotion();

    window.addEventListener('resize', checkMobile);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  // Intersection Observer for viewport detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
      intersectionObserverRef.current = observer;
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      intersectionObserverRef.current?.disconnect();
    };
  }, []);

  // Lazy load GSAP only when needed and visible
  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;
    
    let isMounted = true;
    
    const loadGsap = async () => {
      try {
        const gsapModule = await import("gsap");
        if (isMounted) {
          setGsapInstance(gsapModule.gsap || gsapModule.default || gsapModule);
        }
      } catch (error) {
        console.warn('Failed to load GSAP:', error);
      }
    };

    if (gallery.layout === "carousel" || gallery.layout === "fullscreen") {
      loadGsap();
    }

    return () => {
      isMounted = false;
    };
  }, [gallery.layout, isVisible, prefersReducedMotion]);

  // Set isReady immediately for carousel/fullscreen layouts
  useEffect(() => {
    if (gallery.layout === "carousel" || gallery.layout === "fullscreen") {
      setIsReady(true);
    }
  }, [gallery.layout]);

  // Set up the elements ref without ScrollTrigger initially
  const { elementsRef } = useGsapAnimation(
    {
      effect: animationConfig.effect,
      duration: prefersReducedMotion ? 0 : animationConfig.duration,
      ease: animationConfig.ease,
      stagger: prefersReducedMotion ? 0 : (animationConfig.stagger || 0.15),
      from: animationConfig.from,
      to: animationConfig.to,
    },
    [gallery.id, prefersReducedMotion]
  );

  // Set up ScrollTrigger after the component mounts and refs are populated
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    if (!gsapInstance || prefersReducedMotion) return;

    const elements = elementsRef.current
      .filter(Boolean)
      .filter((el) => el instanceof Element);
    if (elements.length === 0) return;

    // Create animations with ScrollTrigger when the DOM is ready
    const animations = elements.map((el, index) => {
      return gsapInstance.fromTo(
        el,
        { ...animationConfig.from },
        {
          ...animationConfig.to,
          duration: animationConfig.duration,
          ease: animationConfig.ease,
          delay: index * (animationConfig.stagger || 0.15),
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
  }, [gallery.id, animationConfig, elementsRef, gsapInstance, prefersReducedMotion]);

  // Optimized preloading with intersection observer
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen")
      return;
    if (!gallery.items.length || !isVisible) return;

    const preloadImage = (url: string) => {
      const img = new window.Image();
      img.src = url;
    };

    // Preload current, next and previous images
    const currentItem = gallery.items[activeIndex];
    const nextItem = gallery.items[(activeIndex + 1) % gallery.items.length];
    const prevItem = gallery.items[(activeIndex - 1 + gallery.items.length) % gallery.items.length];

    [currentItem, nextItem, prevItem].forEach(item => {
      if (item && item.type === "image" && item.url) {
        preloadImage(item.url);
      }
    });
  }, [activeIndex, gallery.layout, gallery.items, isVisible]);

  // Memoize container styles to prevent recalculation
  const containerStyles = useMemo(() => {
    if (!gallery.container) return { width: "100%", height: "100%" };

    const styles: React.CSSProperties = {};

    if (gallery.container.width) {
      styles.width = gallery.container.width;
    } else {
      styles.width = "100%";
    }

    if (gallery.container.minWidth) styles.minWidth = gallery.container.minWidth;
    if (gallery.container.maxWidth) styles.maxWidth = gallery.container.maxWidth;

    if (gallery.container.height) {
      styles.height = gallery.container.height;
    } else {
      styles.height = "100%";
    }

    if (gallery.container.minHeight) styles.minHeight = gallery.container.minHeight;
    if (gallery.container.maxHeight) styles.maxHeight = gallery.container.maxHeight;
    if (gallery.container.aspectRatio) styles.aspectRatio = gallery.container.aspectRatio;

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

    if (gallery.container.padding) styles.padding = gallery.container.padding;
    if (gallery.container.margin && typeof gallery.container.margin === "string") {
      styles.margin = gallery.container.margin;
    }
    if (gallery.container.background) styles.background = gallery.container.background;
    if (gallery.container.borderRadius) styles.borderRadius = gallery.container.borderRadius;

    return styles;
  }, [gallery.container]);

  // Memoize layout class to prevent recalculation
  const layoutClass = useMemo(() => {
    const baseClass = "w-full";
    const mobileClass = isMobile ? "min-h-[100dvh]" : "min-h-[60vh] md:min-h-screen";
    
    switch (gallery.layout) {
      case "grid":
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 ${mobileClass} ${baseClass}`;
      case "masonry":
        return `columns-1 md:columns-2 lg:columns-3 gap-2 md:gap-4 space-y-2 md:space-y-4 ${mobileClass} ${baseClass}`;
      case "fullscreen":
        return "relative h-full w-full overflow-hidden flex items-center justify-center";
      case "carousel":
        return "relative h-full w-full overflow-hidden flex items-center justify-center";
      default:
        return `flex flex-wrap gap-2 md:gap-4 ${mobileClass} ${baseClass}`;
    }
  }, [gallery.layout, isMobile]);

  // Optimized slide transition with requestAnimationFrame
  const triggerNextSlide = useCallback((): void => {
    if (isTransitioning || !gallery.items.length) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const next = (activeIndex + 1) % gallery.items.length;
    setPrevIndex(activeIndex);
    setActiveIndex(next);
    setIsTransitioning(true);

    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setPrevIndex(null);
    }, (animationConfig.duration || 0.7) * 1000 + 100);
  }, [isTransitioning, gallery.items.length, activeIndex, animationConfig.duration]);

  // Set up carousel autoplay for carousel layouts
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen")
      return;
    if (!isReady || !isVisible) return;
    if (!gallery.transitionTime) return;

    const interval = setInterval(() => {
      triggerNextSlide();
    }, gallery.transitionTime);

    return () => clearInterval(interval);
  }, [gallery.layout, isReady, gallery.transitionTime, triggerNextSlide, isVisible]);

  // Optimized crossfade animation with RAF
  useLayoutEffect(() => {
    if (prevIndex === null || !isTransitioning) return;
    if (!prevRef.current || !activeRef.current) return;
    if (!gsapInstance || prefersReducedMotion) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const duration = prefersReducedMotion ? 0 : (animationConfig.duration || 0.7);
    const ease = animationConfig.ease || "power2.inOut";

    const completeTransition = () => {
      setPrevIndex(null);
      setIsTransitioning(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    if (prefersReducedMotion) {
      gsapInstance.set(prevRef.current, { opacity: 0 });
      gsapInstance.set(activeRef.current, { opacity: 1 });
      completeTransition();
      return;
    }

    switch (animationConfig.effect) {
      case "none": {
        gsapInstance.set(prevRef.current, { opacity: 0 });
        gsapInstance.set(activeRef.current, { opacity: 1 });
        completeTransition();
        break;
      }

      case "slide": {
        gsapInstance.set(activeRef.current, { x: "100%", opacity: 1 });
        timelineRef.current = gsapInstance.timeline({
          onComplete: completeTransition,
        });

        timelineRef.current
          .to(prevRef.current, { x: "-100%", opacity: 1, duration, ease }, 0)
          .to(activeRef.current, { x: "0%", opacity: 1, duration, ease }, 0);
        break;
      }

      case "scale": {
        gsapInstance.set(activeRef.current, { opacity: 0, scale: 0.8 });
        timelineRef.current = gsapInstance.timeline({
          onComplete: completeTransition,
        });

        timelineRef.current
          .to(prevRef.current, { opacity: 0, scale: 0.8, duration, ease }, 0)
          .to(activeRef.current, { opacity: 1, scale: 1, duration, ease }, 0);
        break;
      }

      default: {
        gsapInstance.set(activeRef.current, { opacity: 0 });
        timelineRef.current = gsapInstance.timeline({
          onComplete: completeTransition,
        });

        timelineRef.current
          .to(prevRef.current, { opacity: 0, duration, ease }, 0)
          .to(activeRef.current, { opacity: 1, duration, ease }, 0);
      }
    }
  }, [prevIndex, isTransitioning, animationConfig, gsapInstance, prefersReducedMotion]);

  // Don't render anything until visible
  if (!isVisible) {
    return (
      <section
        ref={containerRef}
        className="gallery-row w-full m-0 p-0 min-h-[100dvh]"
        data-visible="false"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="loading-skeleton w-16 h-16 rounded-full"></div>
        </div>
      </section>
    );
  }

  // Render the appropriate layout
  const renderLayout = () => {
    switch (gallery.layout) {
      case "carousel":
      case "fullscreen": {
        // Special handling for treadmill galleries
        if (gallery.id === "gallery6" || gallery.id === "gallery11") {
          return (
            <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}>
              <TreadmillGallery gallery={gallery} />
            </Suspense>
          );
        }

        const activeItem = gallery.items[activeIndex];
        const prevItem = prevIndex !== null ? gallery.items[prevIndex] : null;

        if (!activeItem) {
          return (
            <div className="flex items-center justify-center h-full w-full text-gray-500">
              No active item to display
            </div>
          );
        }

        const isFullscreen = gallery.layout === "fullscreen";
        const containerStyle: React.CSSProperties = isFullscreen
          ? {
              height: "100vh",
              height: "100dvh", // Dynamic viewport height for mobile
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
            {prevItem && (
              <div
                ref={prevRef}
                className="media-item absolute inset-0 w-full h-full"
                style={{ zIndex: 1 }}
              >
                <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}>
                  <MediaItem
                    item={prevItem}
                    className="w-full h-full object-cover"
                    priority={false}
                    isActive={false}
                  />
                </Suspense>
              </div>
            )}
            <div
              ref={activeRef}
              className="media-item absolute inset-0 w-full h-full"
              style={{ zIndex: 2 }}
            >
              <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}>
                <MediaItem
                  item={activeItem}
                  className="w-full h-full object-cover"
                  priority={true}
                  isActive={true}
                />
              </Suspense>
            </div>
          </div>
        );
      }

      case "grid":
      case "masonry": {
        // Use virtualized grid for large galleries
        if (gallery.items.length > 50) {
          return (
            <Suspense fallback={<div className="w-full h-96 bg-gray-100 animate-pulse" />}>
              <VirtualizedGrid items={gallery.items} />
            </Suspense>
          );
        }

        return gallery.items.map((item, index) => (
          <div
            key={item.id}
            className={
              gallery.layout === "masonry" ? "mb-2 md:mb-4 break-inside-avoid" : ""
            }
          >
            <Suspense fallback={<div className="w-full h-64 bg-gray-100 animate-pulse" />}>
              <MediaItem
                item={item}
                priority={index < 6} // Only prioritize first 6 items
                forwardedRef={(el) => {
                  if (elementsRef.current) {
                    elementsRef.current[index] = el;
                  }
                }}
              />
            </Suspense>
          </div>
        ));
      }

      default:
        return gallery.items.map((item, index) => (
          <div
            key={item.id}
            className={
              gallery.layout === "masonry" ? "mb-2 md:mb-4 break-inside-avoid" : ""
            }
          >
            <Suspense fallback={<div className="w-full h-64 bg-gray-100 animate-pulse" />}>
              <MediaItem
                item={item}
                priority={index < 6}
                forwardedRef={(el) => {
                  if (elementsRef.current) {
                    elementsRef.current[index] = el;
                  }
                }}
              />
            </Suspense>
          </div>
        ));
    }
  };

  const sectionHeight = gallery.container?.height
    ? undefined
    : isMobile ? "min-h-[100dvh]" : "min-h-[60vh] md:min-h-screen";

  const isFullscreen = gallery.layout === "fullscreen";

  return (
    <section
      className={`gallery-row w-full m-0 p-0 ${sectionHeight} ${
        isFullscreen ? "fullscreen-gallery" : ""
      }`}
      ref={containerRef}
      data-visible="true"
    >
      <div
        className={`w-full ${isFullscreen ? "h-screen h-[100dvh]" : ""}`}
        style={gallery.galleryContainer ? { ...gallery.galleryContainer } : {}}
      >
        <div
          className={`gallery-content ${isFullscreen ? "h-full" : ""}`}
          style={
            gallery.container
              ? { ...containerStyles }
              : { position: "relative", width: "100%", height: "100%" }
          }
        >
          <div className={`${layoutClass} ${isFullscreen ? "h-full" : ""}`}>
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