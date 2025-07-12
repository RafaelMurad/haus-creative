import { NextResponse } from 'next/server';
import { GalleryConfig } from '../../../types';
import { GalleryFileService } from '../../../services/galleryFileService';
import { GalleryMetadataService } from '../../../services/galleryMetadataService';
import enhancedGalleryData from '../../../data/enhancedGalleryData';

// Initialize services
const fileService = new GalleryFileService();
const metadataService = new GalleryMetadataService();

async function loadGalleryConfigurations(): Promise<GalleryConfig[]> {
  try {
    // Ensure assets directory exists
    await fileService.ensureAssetsDirectory();

    // Get gallery directories
    const galleryDirs = await fileService.getGalleryDirectories();

    // If no gallery directories found, return empty array
    if (galleryDirs.length === 0) {
      console.warn("No gallery directories found in assets folder");
      return [];
    }

    // Generate configurations for each gallery
    const dynamicGalleryConfigs = await Promise.all(
      galleryDirs.map(async (galleryId) => {
        const mediaFiles = await fileService.getGalleryFiles(galleryId);
        return metadataService.generateGalleryConfig(galleryId, mediaFiles);
      })
    );

    // Merge dynamic configs with enhanced static data
    const mergedConfigs = dynamicGalleryConfigs.map((dynamicConfig) => {
      const staticConfig = enhancedGalleryData.find(
        (g) => g.id === dynamicConfig.id
      );
      if (staticConfig) {
        // Create a deep merge of the configs
        const mergedConfig = {
          ...dynamicConfig, // Start with dynamic config
          ...staticConfig, // Override with static config properties
          items: dynamicConfig.items, // Keep the dynamic items
          // Ensure container configs are properly handled
          container: staticConfig.container
            ? { ...staticConfig.container }
            : undefined,
          galleryContainer: staticConfig.galleryContainer
            ? { ...staticConfig.galleryContainer }
            : undefined,
          // Ensure animation config is properly handled
          animation: staticConfig.animation
            ? { ...staticConfig.animation }
            : dynamicConfig.animation,
        };
        return mergedConfig;
      }
      return dynamicConfig; // If no static config, return dynamic one
    });

    // Add any galleries from enhancedGalleryData that weren't found dynamically
    enhancedGalleryData.forEach((staticGallery) => {
      if (!mergedConfigs.some((mc) => mc.id === staticGallery.id)) {
        // If a gallery in enhancedGalleryData doesn't have a corresponding folder,
        // we might still want to render it if it has items defined statically.
        // For now, we assume items are primarily dynamic.
        // If staticGallery.items.length > 0, you could add it here.
        // console.warn(`Static gallery ${staticGallery.id} not found in dynamic configs. Add if it has items.`);
      }
    });

    // Sort galleries by numerical order (gallery1, gallery2, gallery3, etc.)
    mergedConfigs.sort((a, b) => {
      // Extract numbers from gallery IDs (e.g., "gallery1" -> 1)
      const aNum = parseInt(a.id.replace("gallery", "")) || 0;
      const bNum = parseInt(b.id.replace("gallery", "")) || 0;
      return aNum - bNum;
    });

    return mergedConfigs;
  } catch (error) {
    console.error("Error loading gallery configurations:", error);
    return [];
  }
}

export async function GET() {
  try {
    const galleries = await loadGalleryConfigurations();
    
    return NextResponse.json({
      success: true,
      data: galleries,
      count: galleries.length
    });
  } catch (error) {
    console.error('API Error loading galleries:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load galleries',
        data: []
      },
      { status: 500 }
    );
  }
}
