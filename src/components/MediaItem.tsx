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
  const [isInView, setIsInView] = useState(priority); // Priority items start as visible

  const ref = forwardedRef || ((el: HTMLElement | null) => {
    localRef.current = el;
  });

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isLoaded) return; // Skip if priority or already loaded

    const element = localRef.current;
    if (!element) return;

    intersectionRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          intersectionRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    intersectionRef.current.observe(element);

    return () => {
      intersectionRef.current?.disconnect();
    };
  }, [priority, isLoaded]);

  // Optimized video playback control with RAF
  const handleVideoPlayback = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || !isInView) return;

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

  // Control video playback based on isActive prop
  useEffect(() => {
    if (item.type === 'video' && isInView) {
      handleVideoPlayback();
    }
  }, [isActive, item.type, handleVideoPlayback, isInView]);

  // Optimized load handlers with debouncing
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  // Don't render anything until in view (unless priority)
  if (!isInView && !priority) {
    return (
      <div
        ref={ref as (instance: HTMLDivElement | null) => void}
        className="w-full h-full bg-gray-100"
        style={{ minHeight: "200px" }}
      />
    );
  }

  // Render the appropriate media based on type
  const renderMedia = () => {
    if (hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
          Failed to load media
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
            preload={priority ? "metadata" : "none"}
            style={{ pointerEvents: "none" }}
            controls={false}
            disablePictureInPicture={true}
            disableRemotePlaybook={true}
          />
        );
      case "gif":
        return (
          <img
            ref={ref as (instance: HTMLImageElement | null) => void}
            src={item.url}
            alt={item.title}
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

        return (
          <Image
            src={item.url || item.imageUrl || ""}
            alt={item.title}
            fill
            style={{
              objectFit: isTreadmill ? "contain" : "cover",
              objectPosition: "center",
            }}
            className="w-full h-full"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            quality={priority ? 90 : 75} // Higher quality for priority images
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, (max-width: 1600px) 100vw, (max-width: 1920px) 100vw, 100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDyZH9E8vI8dvwWR8WkJnKdL3c4c1/wB1/9k="
          />
        );
    }
  };

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
  const getContentContainerStyle = () => {
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
  };

  // Loading state with skeleton
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
          <div className="loading-skeleton w-full h-full rounded"></div>
        </div>
      </div>
    );
  }

  // Simplify structure - one main container with content
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
  // Custom comparison for memo optimization
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.priority === nextProps.priority &&
    prevProps.className === nextProps.className
  );
});