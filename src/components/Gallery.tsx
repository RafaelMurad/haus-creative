"use client";

import { useRef } from "react";
import SmartGalleryRow from "./SmartGalleryRow";
import PerformanceAnalytics from "./PerformanceAnalytics";
import enhancedGalleryData from "../data/enhancedGalleryData";
import { GalleryConfig } from "../types";

interface GalleryProps {
  galleries?: GalleryConfig[];
  className?: string;
}

const Gallery = ({
  galleries = enhancedGalleryData,
  className = "",
}: GalleryProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={galleryRef} className={`gallery-container ${className}`}>
      {/* Performance Analytics Dashboard - Development Only */}
      <PerformanceAnalytics 
        className="fixed top-4 right-4 max-w-sm z-50"
        showDetails={false}
      />
      
      {galleries.map((gallery) => (
        <SmartGalleryRow key={gallery.id} gallery={gallery} />
      ))}
    </div>
  );
};

export default Gallery;
