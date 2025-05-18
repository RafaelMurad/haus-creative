import { GalleryConfig } from "../types";
import Gallery from "./Gallery";
import { GalleryFileService } from "../services/galleryFileService";
import { GalleryMetadataService } from "../services/galleryMetadataService";

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
    const galleryConfigs = await Promise.all(
      galleryDirs.map(async (galleryId) => {
        const mediaFiles = await fileService.getGalleryFiles(galleryId);
        return metadataService.generateGalleryConfig(galleryId, mediaFiles);
      })
    );

    return galleryConfigs;
  } catch (error) {
    console.error("Error loading gallery configurations:", error);
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
          Please create folders in the <code>/public/assets/</code> directory to
          automatically generate galleries.
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
