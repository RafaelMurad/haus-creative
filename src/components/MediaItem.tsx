"use client";

import { useRef, useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import { MediaItem as MediaItemType } from "../types";

interface MediaItemProps {
  item: MediaItemType;
  className?: string;
  onLoad?: () => void;
  forwardedRef?: (element: HTMLElement | null) => void;
  priority?: boolean;
  isActive?: boolean;
  containerConfig?: {
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    height?: string;
    minHeight?: string;
    maxHeight?: string;
    aspectRatio?: string;
    alignment?: "center" | "left" | "right";
    background?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
  };
}

export default memo(function MediaItem({
  item,
  className = "",
  onLoad,
  forwardedRef,
  priority = false,
  isActive = true,
  containerConfig,
}: MediaItemProps) {
  const isFullViewport = useRef<boolean>(false);
  const localRef = useRef<HTMLElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intersectionRef = useRef<IntersectionObserver | null>(null);
  const [isInView, setIsInView] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const ref = forwardedRef || ((el: HTMLElement | null) => {
    localRef.current = el;
  });

  // Set up intersection observer for lazy loading
  useEffect(() => {
    const element = localRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: "50px",
        threshold: 0.1
      }
    );

    observer.observe(element);
    intersectionRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, []);

  // Enhanced video playback with battery optimization
  const handleVideoPlayback = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || !isInView) return;

    // Check battery status for mobile optimization
    const isMobile = window.innerWidth < 768;
    if (isMobile && 'getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        if (battery.level < 0.2 && !battery.charging) {
          // Skip video autoplay on low battery
          return;
        }
      } catch (error) {
        // Battery API not supported, continue normally
      }
    }

    const playVideo = () => {
      if (isActive && videoElement.readyState >= 2) {
        videoElement.play().catch(error => {
          if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
            console.warn("Video play failed:", error);
          }
        });
      } else if (!isActive) {
        videoElement.pause();
      } else {
        requestAnimationFrame(playVideo);
      }
    };

    requestAnimationFrame(playVideo);
  }, [isActive, isInView]);

  useEffect(() => {
    if (item.type === 'video' && isInView) {
      handleVideoPlayback();
    }
  }, [isActive, item.type, handleVideoPlayback, isInView]);

  // Enhanced error handling with retry logic
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    retryCountRef.current = 0;
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    retryCountRef.current += 1;
    
    if (retryCountRef.current < maxRetries) {
      // Retry loading after a delay
      setTimeout(() => {
        const img = localRef.current as HTMLImageElement;
        if (img && img.src) {
          img.src = img.src; // Force reload
        }
      }, 1000 * retryCountRef.current); // Exponential backoff
    } else {
      setHasError(true);
    }
  }, []);

  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad();
  }, [onLoad]);

  // Determine if we need to force full viewport for carousel/fullscreen
  useEffect(() => {
    const element = localRef.current;
    if (element) {
      const parent = element.parentElement;
      if (parent) {
        isFullViewport.current =
          parent.classList.contains("media-item") ||
          parent.closest(".fullscreen-gallery") !== null;
      }
    }
  }, []);

  // Style based on item size or container context
  const style = item.size
    ? {
        width: item.size.width,
        height: item.size.height,
      }
    : isFullViewport.current
    ? {
        height: "100%",
        width: "100%",
        position: "relative" as const,
        minHeight: "100vh",
        maxHeight: "100vh",
      }
    : { position: "relative" as const };

  // Container style builder
  const getContentContainerStyle = useCallback(() => {
    if (!containerConfig) return {};
    const styles: React.CSSProperties = {};
    if (containerConfig.width) styles.width = containerConfig.width;
    if (containerConfig.minWidth) styles.minWidth = containerConfig.minWidth;
    if (containerConfig.maxWidth) styles.maxWidth = containerConfig.maxWidth;
    if (containerConfig.height) styles.height = containerConfig.height;
    if (containerConfig.minHeight) styles.minHeight = containerConfig.minHeight;
    if (containerConfig.maxHeight) styles.maxHeight = containerConfig.maxHeight;
    if (containerConfig.aspectRatio)
      styles.aspectRatio = containerConfig.aspectRatio;
    if (containerConfig.padding) styles.padding = containerConfig.padding;
    if (containerConfig.background)
      styles.background = containerConfig.background;
    if (containerConfig.borderRadius)
      styles.borderRadius = containerConfig.borderRadius;
    if (containerConfig.margin) styles.margin = containerConfig.margin;

    if (!containerConfig.height && !containerConfig.minHeight) {
      styles.minHeight = "300px";
    }

    if (containerConfig.alignment === "center" && !containerConfig.margin) {
      styles.marginLeft = "auto";
      styles.marginRight = "auto";
    } else if (
      containerConfig.alignment === "left" &&
      !containerConfig.margin
    ) {
      styles.marginRight = "auto";
    } else if (
      containerConfig.alignment === "right" &&
      !containerConfig.margin
    ) {
      styles.marginLeft = "auto";
    }
    return styles;
  }, [containerConfig]);

  // Don't render until in view (unless priority)
  if (!isInView && !priority) {
    return (
      <div
        ref={ref as (instance: HTMLDivElement | null) => void}
        className="w-full h-full bg-gray-100"
        style={{ minHeight: "200px" }}
      />
    );
  }

  // Enhanced media rendering
  const renderMedia = () => {
    if (hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4">
          <div className="text-center">
            <p className="mb-2">Failed to load media</p>
            <button
              onClick={() => {
                setHasError(false);
                retryCountRef.current = 0;
                setIsLoaded(false);
              }}
              className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (item.type) {
      case "video":
        return (
          <video
            ref={(el) => {
              videoRef.current = el;
              if (ref) ref(el as HTMLElement);
            }}
            src={item.url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            {...(item.thumbUrl && { poster: item.thumbUrl })}
            onLoadedData={handleVideoLoad}
            onError={handleImageError}
            preload={priority ? "metadata" : "none"}
            style={{ pointerEvents: "none" }}
            controls={false}
            disablePictureInPicture={true}
            disableRemotePlayback={true}
          />
        );
      case "gif":
        return (
          <img
            ref={ref as (instance: HTMLImageElement | null) => void}
            src={item.url}
            alt={item.title || "Gallery image"}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        );
      case "image":
      default:
        const isTreadmill =
          item.url?.includes("gallery6/") ||
          item.url?.includes("gallery11/") ||
          item.imageUrl?.includes("gallery6/") ||
          item.imageUrl?.includes("gallery11/");

        // Use Next.js Image component for optimization
        return (
          <Image
            ref={ref as (instance: HTMLImageElement | null) => void}
            src={item.url || item.imageUrl || ""}
            alt={item.title || "Gallery image"}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            fill
            sizes={isTreadmill ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            style={{
              objectFit: isTreadmill ? "contain" : "cover",
              objectPosition: "center",
            }}
          />
        );
    }
  };

  // Show loading state while image loads
  if (!isLoaded && !hasError && isInView) {
    return (
      <div
        className="media-content relative w-full h-full bg-gray-100"
        style={containerConfig ? {
          position: "relative" as const,
          minHeight: containerConfig.minHeight || "300px",
          ...getContentContainerStyle(),
        } : { position: "relative" as const, minHeight: "200px", ...style }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="loading-skeleton w-full h-full rounded animate-pulse bg-gray-200"></div>
        </div>
      </div>
    );
  }

  // Render with container configuration or simple container
  if (containerConfig) {
    return (
      <div
        className="media-content relative w-full h-full"
        style={{
          position: "relative" as const,
          minHeight: containerConfig.minHeight || "300px",
          ...getContentContainerStyle(),
        }}
      >
        {renderMedia()}
      </div>
    );
  }

  return (
    <div
      className="media-content relative w-full h-full"
      style={{ position: "relative" as const, minHeight: "200px", ...style }}
    >
      {renderMedia()}
    </div>
  );
}, (prevProps, nextProps) => {
  // Enhanced comparison for memo optimization
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.url === nextProps.item.url &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.priority === nextProps.priority &&
    prevProps.className === nextProps.className
  );
});