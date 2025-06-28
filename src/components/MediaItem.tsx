"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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

import { memo } from "react";

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

  const ref = forwardedRef || ((el: HTMLElement | null) => {
    localRef.current = el;
  });

  // Optimized video playback control
  const handleVideoPlayback = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      try {
        if (videoElement.isConnected && videoElement.readyState >= 2) {
          await videoElement.play();
        } else if (videoElement.isConnected) {
          // Use requestAnimationFrame for better performance
          const attemptPlay = () => {
            if (videoElement.readyState >= 2) {
              videoElement.play().catch(error => {
                if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
                  console.warn("Video play failed:", error);
                }
              });
            } else {
              requestAnimationFrame(attemptPlay);
            }
          };
          requestAnimationFrame(attemptPlay);
        }
      } catch (error: any) {
        if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
          console.warn("Video play failed:", error);
        }
      }
    } else {
      if (videoElement.isConnected) {
        videoElement.pause();
      }
    }
  }, [isActive]);

  // Control video playback based on isActive prop
  useEffect(() => {
    if (item.type === 'video') {
      handleVideoPlayback();
    }
  }, [isActive, item.type, handleVideoPlayback]);

  // Optimized load handlers
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
    if (process.env.NODE_ENV === "development") {
      console.debug(`Successfully loaded image: ${item.url || item.imageUrl}`);
    }
  }, [onLoad, item.url, item.imageUrl]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    if (process.env.NODE_ENV === "development") {
      console.error(`Failed to load image: ${item.url || item.imageUrl}`);
    }
  }, [item.url, item.imageUrl]);

  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

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
            preload="metadata"
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
            alt={item.title}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={priority ? "eager" : "lazy"}
          />
        );
      case "image":
      default:
        // Check if this is a treadmill gallery (gallery6 or gallery11) to use contain instead of cover
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
            quality={85} // Reduced from 95 for better performance
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

  // Loading state
  if (!isLoaded && !hasError) {
    return (
      <div
        className="media-content relative w-full h-full bg-gray-100 animate-pulse"
        style={containerConfig ? {
          position: "relative" as const,
          minHeight: containerConfig.minHeight || "300px",
          ...getContentContainerStyle(),
        } : { position: "relative" as const, minHeight: "200px", ...style }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
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
});