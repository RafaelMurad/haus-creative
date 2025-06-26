"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { MediaItem as MediaItemType } from "../types";
import { debugImageLoad } from "../utils/debugHelper";

interface MediaItemProps {
  item: MediaItemType;
  className?: string;
  onLoad?: () => void;
  forwardedRef?: (element: HTMLElement | null) => void;
  priority?: boolean;
  isActive?: boolean; // Add prop to control video playback
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
  isActive = true, // Default to active for backwards compatibility
  containerConfig,
}: MediaItemProps) {
  const isFullViewport = useRef<boolean>(false);
  const localRef = useRef<HTMLElement | null>(null);

  const ref =
    forwardedRef ||
    ((el: HTMLElement | null) => {
      localRef.current = el;
    });

  // Control video playback based on isActive prop
  useEffect(() => {
    const videoElement = localRef.current as HTMLVideoElement;
    if (videoElement && videoElement.tagName === "VIDEO") {
      if (isActive) {
        // Wait for video to be ready before playing
        const attemptPlay = async () => {
          try {
            if (videoElement.isConnected && videoElement.readyState >= 2) {
              await videoElement.play();
            } else if (videoElement.isConnected) {
              // If not ready, wait a bit and try again
              setTimeout(attemptPlay, 100);
            }
          } catch (error: any) {
            if (
              error.name !== "AbortError" &&
              error.name !== "NotAllowedError"
            ) {
              console.warn("Video play failed:", error);
            }
          }
        };

        // Start attempting to play immediately
        attemptPlay();
      } else {
        // Immediately pause when not active
        if (videoElement.isConnected) {
          videoElement.pause();
        }
      }
    }
  }, [isActive]);

  // Render the appropriate media based on type
  const renderMedia = () => {
    switch (item.type) {
      case "video":
        return (
          <video
            ref={ref as (instance: HTMLVideoElement | null) => void}
            src={item.url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            {...(item.thumbUrl && { poster: item.thumbUrl })}
            onLoadedData={onLoad}
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
            onLoad={onLoad}
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
            onLoad={() => {
              if (onLoad) onLoad();
              // Log successful image load in development
              if (process.env.NODE_ENV === "development") {
                console.debug(
                  `Successfully loaded image: ${item.url || item.imageUrl}`
                );
              }
            }}
            onError={() => {
              // Log failed image load in development
              if (process.env.NODE_ENV === "development") {
                console.error(
                  `Failed to load image: ${item.url || item.imageUrl}`
                );
              }
            }}
            priority={priority}
            quality={95}
            sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, (max-width: 1600px) 1600px, (max-width: 1920px) 1920px, 2048px"
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
        // Check if this is part of a fullscreen layout
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
        minHeight: "100vh", // For fullscreen mode
        maxHeight: "100vh", // For fullscreen mode
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

    // If height is not explicitly set, add a min-height to ensure content is visible
    if (!containerConfig.height && !containerConfig.minHeight) {
      styles.minHeight = "300px"; // Add a default minimum height
    }

    // Ensure alignment is handled correctly for centering if specified
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

  // No container: simple structure with just the necessary positioning
  return (
    <div
      className="media-content relative w-full h-full"
      style={{ position: "relative" as const, minHeight: "200px", ...style }}
    >
      {renderMedia()}
    </div>
  );
});
