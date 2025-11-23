"use client";

import { MediaSource, MediaType } from "@/config/site";
import Image from "next/image";

interface MediaRendererProps {
  media: MediaSource;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

/**
 * MediaRenderer - Universal component for rendering different media types
 * Supports: video, image, and gif
 */
export function MediaRenderer({
  media,
  className = "",
  priority = false,
  fill = true,
  sizes = "100vw",
}: MediaRendererProps) {
  const baseClassName = `${className}`.trim();

  switch (media.type) {
    case "video":
      return (
        <VideoMedia
          media={media}
          className={baseClassName}
        />
      );
    case "gif":
      return (
        <GifMedia
          media={media}
          className={baseClassName}
          priority={priority}
          fill={fill}
          sizes={sizes}
        />
      );
    case "image":
    default:
      return (
        <ImageMedia
          media={media}
          className={baseClassName}
          priority={priority}
          fill={fill}
          sizes={sizes}
        />
      );
  }
}

// =============================================================================
// VIDEO MEDIA
// =============================================================================

interface VideoMediaProps {
  media: MediaSource;
  className?: string;
}

function VideoMedia({ media, className }: VideoMediaProps) {
  return (
    <video
      className={className}
      playsInline
      autoPlay={media.autoPlay !== false}
      loop={media.loop !== false}
      muted={media.muted !== false}
      poster={media.poster}
    >
      {/* Mobile video source */}
      {media.srcMobile && (
        <source
          src={media.srcMobile}
          type="video/mp4"
          media="(max-width: 768px)"
        />
      )}
      {/* Desktop video source */}
      <source src={media.src} type={getVideoMimeType(media.src)} />
    </video>
  );
}

// =============================================================================
// IMAGE MEDIA
// =============================================================================

interface ImageMediaProps {
  media: MediaSource;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

function ImageMedia({
  media,
  className,
  priority,
  fill,
  sizes,
}: ImageMediaProps) {
  // For responsive images with mobile variant
  if (media.srcMobile) {
    return (
      <picture>
        <source media="(max-width: 768px)" srcSet={media.srcMobile} />
        <img
          src={media.src}
          alt={media.alt || ""}
          className={className}
          loading={priority ? "eager" : "lazy"}
        />
      </picture>
    );
  }

  // Use Next.js Image for optimization when no mobile variant
  if (fill) {
    return (
      <Image
        src={media.src}
        alt={media.alt || ""}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt || ""}
      width={1920}
      height={1080}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}

// =============================================================================
// GIF MEDIA
// =============================================================================

interface GifMediaProps {
  media: MediaSource;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

function GifMedia({
  media,
  className,
  priority,
  fill,
  sizes,
}: GifMediaProps) {
  // GIFs need unoptimized to preserve animation
  if (fill) {
    return (
      <Image
        src={media.src}
        alt={media.alt || ""}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        unoptimized // Required for GIF animation
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt || ""}
      width={1920}
      height={1080}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized // Required for GIF animation
    />
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function getVideoMimeType(src: string): string {
  const ext = src.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    case "mov":
      return "video/quicktime";
    case "mp4":
    default:
      return "video/mp4";
  }
}
