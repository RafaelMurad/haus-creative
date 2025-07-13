"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { MediaItem as MediaItemType } from "../types";
import {
  shouldLoadDynamically,
  logPerformanceMetrics,
} from "../utils/componentLoader";
import { MediaItemLoadingFallback } from "./LoadingFallbacks";

// Dynamically import MediaItem with performance monitoring
const MediaItemDynamic = dynamic(
  () => {
    const startTime = performance.now();
    return import("./MediaItem").then((module) => {
      const loadTime = performance.now() - startTime;
      logPerformanceMetrics("MediaItem", loadTime);
      return module;
    });
  },
  {
    loading: () => <MediaItemLoadingFallback />,
    ssr: false, // Disable SSR for better performance with GSAP
  }
);

// Static import for priority items
import MediaItemStatic from "./MediaItem";

interface DynamicMediaItemProps {
  item: MediaItemType;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
  isActive?: boolean;
  totalItems?: number; // Used for intelligent loading decisions
}

const DynamicMediaItem = ({
  item,
  priority = false,
  className = "",
  onLoad,
  isActive,
  totalItems = 1,
}: DynamicMediaItemProps) => {
  const [useDynamic, setUseDynamic] = useState(true);

  useEffect(() => {
    // Always use static loading for priority items
    if (priority) {
      setUseDynamic(false);
      return;
    }

    // Decide whether to use dynamic loading based on total items
    const shouldUseDynamic = shouldLoadDynamically(totalItems, "media-item");
    setUseDynamic(shouldUseDynamic);

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[DynamicMediaItem] Item ${item.id}, Priority: ${priority}, Total items: ${totalItems}, Using dynamic: ${shouldUseDynamic}`
      );
    }
  }, [item.id, priority, totalItems]);

  // Use static component for priority items or small collections
  if (!useDynamic) {
    return (
      <MediaItemStatic
        item={item}
        priority={priority}
        className={className}
        onLoad={onLoad}
        isActive={isActive}
      />
    );
  }

  // Use dynamic component for non-priority items in large collections
  return (
    <MediaItemDynamic
      item={item}
      priority={priority}
      className={className}
      onLoad={onLoad}
      isActive={isActive}
    />
  );
};

export default DynamicMediaItem;
