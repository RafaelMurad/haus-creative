/**
 * Service for handling gallery file operations
 */
export class GalleryFileService {
  private baseUrl: string;
  private assetPrefix: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_GALLERY_BASE_URL || '';
    this.assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '/assets';
  }

  /**
   * Ensure the assets directory exists (client-side only)
   */
  async ensureAssetsDirectory(): Promise<void> {
    // This is a client-side operation, so we'll just return
    // In a real implementation, this might check if the directory exists
    return Promise.resolve();
  }

  /**
   * Get gallery directories from the assets folder
   */
  async getGalleryDirectories(): Promise<string[]> {
    // For now, return a static list of known galleries
    // In a real implementation, this would scan the assets directory
    return [
      'gallery1',
      'gallery2', 
      'gallery3',
      'gallery4',
      'gallery5',
      'gallery6',
      'gallery7',
      'gallery8',
      'gallery9',
      'gallery10',
      'gallery11'
    ];
  }

  /**
   * Get files for a specific gallery
   */
  async getGalleryFiles(galleryId: string): Promise<string[]> {
    // For now, return a static list of files
    // In a real implementation, this would scan the gallery directory
    const mockFiles = [
      `${this.assetPrefix}/${galleryId}/image1.jpg`,
      `${this.assetPrefix}/${galleryId}/image2.jpg`,
      `${this.assetPrefix}/${galleryId}/image3.jpg`,
      `${this.assetPrefix}/${galleryId}/image4.jpg`,
      `${this.assetPrefix}/${galleryId}/image5.jpg`
    ];

    return Promise.resolve(mockFiles);
  }

  /**
   * Get the full URL for an asset
   */
  getAssetUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `${this.baseUrl}${path}`;
  }

  /**
   * Check if a file exists
   */
  async fileExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(this.getAssetUrl(path), { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
}