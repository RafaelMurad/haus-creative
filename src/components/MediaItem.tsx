"use client";

import { useRef } from "react";
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
  const localRef = useRef<HTMLElement | null>(null);
  const ref =
    forwardedRef ||
    ((el: HTMLElement | null) => {
      localRef.current = el;
    });

  // Handle media type rendering
  const renderMedia = () => {
    switch (item.type) {
      case "video":
        return (
          <video
            ref={ref as (instance: HTMLVideoElement | null) => void}
            src={item.url}
            poster={item.thumbUrl}
            controls={false}
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
            className="w-full h-full object-cover"
            onLoadedData={onLoad}
          />
        );
      case "gif":
        // GIFs are treated as images in HTML, but Next.js Image does not support animated GIFs
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
            priority={false}
            sizes="(max-width: 768px) 100vw, 700px"
          />
        );
    }
  };

  // Determine if we need to force full viewport for carousel/fullscreen
  const isFullViewport =
    className.includes("carousel") || className.includes("fullscreen");
  const style = item.size
    ? {
        width: item.size.width,
        height: item.size.height,
      }
    : isFullViewport
    ? { minHeight: "100vh", minWidth: "100vw", height: "100vh", width: "100vw" }
    : {};

  return (
    <div
      className={`media-item relative overflow-hidden w-full h-full ${
        isFullViewport ? "h-screen w-screen" : ""
      } ${className}`}
      style={style}
    >
      {renderMedia()}
    </div>
  );
}
