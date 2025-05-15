import { promises as fs } from 'fs';
import path from 'path';
import { GalleryConfig } from '../types';
import { generateGalleryConfig } from '../utils/galleryGenerator';
import Gallery from './Gallery';

// Gallery customization metadata
interface GalleryMeta {
  [galleryId: string]: {
    title?: string;
    description?: string;
    layout?: 'grid' | 'carousel' | 'masonry' | 'fullscreen';
    animation?: {
      effect?: string;
      duration?: number;
      ease?: string;
      stagger?: number;
    };
  };
}

// Default metadata for galleries
const galleryMetadata: GalleryMeta = {
  // Add custom configurations for specific galleries
  'gallery1': {
    title: 'Featured Products',
    description: 'Our most popular items this season',
    layout: 'carousel',
  },
  'gallery2': {
    title: 'Product Collection',
    description: 'Full catalog of available products',
    layout: 'grid'
  },
  // You can add more custom configurations here
};

async function loadGalleryConfigurations(): Promise<GalleryConfig[]> {
  try {
    // Get path to assets directory
    const assetsDirectory = path.join(process.cwd(), 'public', 'assets');
    
    // Check if assets directory exists
    try {
      await fs.access(assetsDirectory);
    } catch (error) {
      console.warn(`Assets directory not found at ${assetsDirectory}. Creating directory...`);
      // Create assets directory if it doesn't exist
      await fs.mkdir(assetsDirectory, { recursive: true });
      return []; // Return empty array as there's no content yet
    }
    
    // Read all subdirectories in the assets folder
    const dirs = await fs.readdir(assetsDirectory, { withFileTypes: true });
    const galleryDirs = dirs.filter(dir => dir.isDirectory()).map(dir => dir.name);
    
    // If no gallery directories found, return empty array
    if (galleryDirs.length === 0) {
      console.warn('No gallery directories found in assets folder');
      return [];
    }
    
    // Generate configurations for each gallery
    const galleryConfigs = await Promise.all(
      galleryDirs.map(async (galleryId) => {
        // Read all files in this gallery's directory
        const galleryPath = path.join(assetsDirectory, galleryId);
        const files = await fs.readdir(galleryPath);
        
        // Filter only media files
        const mediaFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', 
                  '.mp4', '.webm', '.mov', '.avi'].includes(ext);
        });
        
        // Get gallery metadata if it exists
        const metadata = galleryMetadata[galleryId] || {};
        
        // Generate and return gallery config
        return generateGalleryConfig(galleryId, mediaFiles, metadata);
      })
    );
    
    return galleryConfigs;
  } catch (error) {
    console.error('Error loading gallery configurations:', error);
    return [];
  }
}

export default async function GalleryLoader() {
  // Load galleries from folders
  const galleries = await loadGalleryConfigurations();
  
  // Display a message if no galleries were found
  if (galleries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No galleries found</h2>
        <p className="mb-4">
          Please create folders in the <code>/public/assets/</code> directory to automatically generate galleries.
        </p>
        <p className="text-sm opacity-75">
          Example: <code>/public/assets/gallery1/image1.jpg</code>
        </p>
      </div>
    );
  }
  
  // Render the gallery component with loaded data
  return <Gallery galleries={galleries} />;
}