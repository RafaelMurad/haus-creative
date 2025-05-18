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
  containerConfig,
}: MediaItemProps) {
  const isFullViewport = useRef<boolean>(false);
  const localRef = useRef<HTMLElement | null>(null);

  const ref =
    forwardedRef ||
    ((el: HTMLElement | null) => {
      localRef.current = el;
    });

  // Render the appropriate media based on type
  const renderMedia = () => {
    switch (item.type) {
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
        return (
          <Image
            src={item.url || item.imageUrl || ""}
            alt={item.title}
            fill
            style={{
              objectFit: "cover",
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
            priority={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
        isFullViewport.current = parent.classList.contains("media-item") || 
                                 parent.closest('.fullscreen-gallery') !== null;
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
        position: "relative",
        minHeight: "100vh", // For fullscreen mode
        maxHeight: "100vh",  // For fullscreen mode
      }
    : { position: "relative" };

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
          position: "relative",
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
      style={{ position: "relative", minHeight: "200px", ...style }}
    >
      {renderMedia()}
    </div>
  );
});
