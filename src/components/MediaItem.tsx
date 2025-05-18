"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { MediaItem as MediaItemType } from "../types";

interface MediaItemProps {
  item: MediaItemType;
  className?: string;
  onLoad?: () => void; // Changed from required to optional
  forwardedRef?: (element: HTMLElement | null) => void;
}

export default function MediaItem({
  item,
  className = "",
  onLoad,
  forwardedRef,
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
            style={{ objectFit: "cover" }}
            className="w-full h-full object-cover"
            onLoad={onLoad}
            priority={true} // Always prioritize images in carousel/fullscreen layouts
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
        isFullViewport.current = parent.classList.contains("media-item");
      }
    }
  }, []);

  const style = item.size
    ? {
        width: item.size.width,
        height: item.size.height,
      }
    : isFullViewport.current
    ? { minHeight: "100vh", minWidth: "100vw", height: "100vh", width: "100vw" }
    : {};

  return (
    <div
      className={`media-item relative overflow-hidden w-full h-full ${
        isFullViewport.current ? "h-screen w-screen" : ""
      } ${className}`}
      style={style}
    >
      {renderMedia()}
    </div>
  );
}
