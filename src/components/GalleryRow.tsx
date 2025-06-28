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
import { usePerformanceMonitor } from "../hooks/usePerformanceMonitor";
import { useAnalytics } from "../utils/analytics";
import {
  GalleryConfig,
  MediaItem as MediaItemType,
  AnimationEffects,
} from "../types";

// Import MediaItem (not lazy loaded for better performance)
import MediaItem from "./MediaItem";
const VirtualizedGrid = lazy(() => import("./VirtualizedGrid"));
const TreadmillGallery = lazy(() => import("./TreadmillGallery"));

interface GalleryRowProps {
  gallery: GalleryConfig;
}

export default function GalleryRow({ gallery }: GalleryRowProps) {
  const { trackGallery, trackPerformance } = useAnalytics();
  
  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor({
    enabled: true,
    onMetrics: (metrics) => {
      trackPerformance(metrics);
    }
  });

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
  const viewStartTimeRef = useRef<number>(0);

  // Detect mobile and reduced motion preferences
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('unknown');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReducedMotion = () => 
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    // Check network connection
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setConnectionSpeed(connection.effectiveType || 'unknown');
      }
    };

    checkMobile();
    checkReducedMotion();
    checkConnection();

    window.addEventListener('resize', checkMobile);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  // Enhanced Intersection Observer with analytics
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const wasVisible = isVisible;
        const nowVisible = entry.isIntersecting;
        
        setIsVisible(nowVisible);

        if (nowVisible && !wasVisible) {
          viewStartTimeRef.current = Date.now();
          trackGallery({
            galleryId: gallery.id,
            action: 'view',
            data: {
              layout: gallery.layout,
              itemCount: gallery.items.length,
              isMobile,
              connectionSpeed
            }
          });
        } else if (!nowVisible && wasVisible && viewStartTimeRef.current > 0) {
          const viewDuration = Date.now() - viewStartTimeRef.current;
          trackGallery({
            galleryId: gallery.id,
            action: 'interaction',
            data: {
              viewDuration,
              layout: gallery.layout
            }
          });
        }
      },
      {
        rootMargin: '100px',
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
  }, [gallery.id, gallery.layout, gallery.items.length, isMobile, connectionSpeed, trackGallery, isVisible]);

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

  // Adaptive loading based on connection speed
  const shouldReduceQuality = useMemo(() => {
    return connectionSpeed === 'slow-2g' || connectionSpeed === '2g';
  }, [connectionSpeed]);

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
        trackGallery({
          galleryId: gallery.id,
          action: 'error',
          data: { error: 'GSAP load failed' }
        });
      }
    };

    if (gallery.layout === "carousel" || gallery.layout === "fullscreen") {
      loadGsap();
    }

    return () => {
      isMounted = false;
    };
  }, [gallery.layout, gallery.id, isVisible, prefersReducedMotion]);

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

  // Optimized preloading with intersection observer and connection awareness
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen")
      return;
    if (!gallery.items.length || !isVisible) return;
    if (shouldReduceQuality) return; // Skip preloading on slow connections

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
  }, [activeIndex, gallery.layout, gallery.items, isVisible, shouldReduceQuality]);

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

    // Track slide transition
    trackGallery({
      galleryId: gallery.id,
      action: 'interaction',
      data: {
        action: 'slide_transition',
        fromIndex: activeIndex,
        toIndex: next
      }
    });

    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setPrevIndex(null);
    }, (animationConfig.duration || 0.7) * 1000 + 100);
  }, [isTransitioning, gallery.items.length, activeIndex, animationConfig.duration, gallery.id, trackGallery]);

  // Set up carousel autoplay for carousel layouts with adaptive timing
  useEffect(() => {
    if (gallery.layout !== "carousel" && gallery.layout !== "fullscreen")
      return;
    if (!isReady || !isVisible) return;
    if (!gallery.transitionTime) return;

    // Adjust timing based on connection speed
    let adjustedTransitionTime = gallery.transitionTime;
    if (shouldReduceQuality) {
      adjustedTransitionTime *= 1.5; // Slower transitions on slow connections
    }

    const interval = setInterval(() => {
      triggerNextSlide();
    }, adjustedTransitionTime);

    return () => clearInterval(interval);
  }, [gallery.layout, isReady, gallery.transitionTime, triggerNextSlide, isVisible, shouldReduceQuality]);

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
              height: "100dvh", // Use dynamic viewport height for mobile
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
                <MediaItem
                  item={prevItem}
                  className="w-full h-full object-cover"
                  priority={false}
                  isActive={false}
                />
              </div>
            )}
            <div
              ref={activeRef}
              className="media-item absolute inset-0 w-full h-full"
              style={{ zIndex: 2 }}
            >
              <MediaItem
                item={activeItem}
                className="w-full h-full object-cover"
                priority={true}
                isActive={true}
              />
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
            <MediaItem
              item={item}
              priority={index < 6} // Only prioritize first 6 items
            />
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
            <MediaItem
              item={item}
              priority={index < 6}
            />
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