"use client";

import { useRef } from "react";
import GalleryRow from "./GalleryRow";
import { GalleryConfig } from "../types";

interface GalleryProps {
  galleries: GalleryConfig[];
}

export default function Gallery({ galleries }: GalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={galleryRef} className="gallery-container">
      {galleries.map((gallery) => (
        <GalleryRow key={gallery.id} gallery={gallery} />
      ))}
    </div>
  );
}