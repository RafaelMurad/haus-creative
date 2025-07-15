"use client";

import { useState, useEffect } from "react";
import { GalleryConfig } from "../types";
import { loadGalleries } from "../utils/loadAssets";
import Gallery from "./Gallery";

export default function GalleryClient() {
  const [galleries, setGalleries] = useState<GalleryConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple synchronous loading
    try {
      const loadedGalleries = loadGalleries();
      setGalleries(loadedGalleries);
    } catch (error) {
      console.error("Error loading galleries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading galleries...</div>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">No galleries found</div>
      </div>
    );
  }

  return <Gallery galleries={galleries} />;
}