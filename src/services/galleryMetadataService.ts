import { GalleryConfig, MediaItem } from '../types';

/**
 * Service for handling gallery metadata and configuration generation
 */
export class GalleryMetadataService {
  /**
   * Generate a gallery configuration from files
   */
  generateGalleryConfig(galleryId: string, files: string[]): GalleryConfig {
    // Create media items from files
    const items: MediaItem[] = files.map((file, index) => ({
      id: `${galleryId}-item-${index + 1}`,
      type: this.getMediaType(file),
      url: file,
      alt: `Gallery ${galleryId} - Item ${index + 1}`,
      title: `Item ${index + 1}`,
      description: `Description for item ${index + 1} in gallery ${galleryId}`,
      metadata: {
        width: 1920,
        height: 1080,
        size: '2.5MB',
        format: this.getFileExtension(file)
      }
    }));

    // Determine gallery type based on content
    const galleryType = this.determineGalleryType(items);

    return {
      id: galleryId,
      title: `Gallery ${galleryId}`,
      description: `A collection of media items for gallery ${galleryId}`,
      type: galleryType,
      items,
      autoAdvance: galleryType === 'crossfade' ? 5000 : undefined,
      styling: this.getDefaultStyling(galleryType),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        itemCount: items.length,
        totalSize: this.calculateTotalSize(items)
      }
    };
  }

  /**
   * Determine the media type from file extension
   */
  private getMediaType(file: string): 'image' | 'video' {
    const extension = this.getFileExtension(file).toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    return videoExtensions.includes(extension) ? 'video' : 'image';
  }

  /**
   * Get file extension from path
   */
  private getFileExtension(file: string): string {
    return file.split('.').pop() || '';
  }

  /**
   * Determine gallery type based on content
   */
  private determineGalleryType(items: MediaItem[]): 'static' | 'crossfade' | 'treadmill' | 'video' {
    if (items.length === 0) return 'static';
    if (items.length === 1) return 'static';
    
    const hasVideos = items.some(item => item.type === 'video');
    if (hasVideos) return 'video';
    
    // For multiple images, use crossfade by default
    return 'crossfade';
  }

  /**
   * Get default styling for gallery type
   */
  private getDefaultStyling(galleryType: string) {
    const baseStyling = {
      container: {
        width: '100%',
        height: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        background: 'transparent',
        borderRadius: '0',
        padding: '0',
        margin: '0'
      },
      galleryContainer: {
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
        width: '100%'
      }
    };

    // Add specific styling for different gallery types
    switch (galleryType) {
      case 'treadmill':
        return {
          ...baseStyling,
          galleryContainer: {
            ...baseStyling.galleryContainer,
            overflow: 'hidden'
          }
        };
      case 'crossfade':
        return {
          ...baseStyling,
          container: {
            ...baseStyling.container,
            position: 'relative'
          }
        };
      default:
        return baseStyling;
    }
  }

  /**
   * Calculate total size of all items
   */
  private calculateTotalSize(items: MediaItem[]): string {
    const totalBytes = items.reduce((total, item) => {
      const size = item.metadata?.size || '0B';
      const bytes = this.parseSize(size);
      return total + bytes;
    }, 0);

    return this.formatSize(totalBytes);
  }

  /**
   * Parse size string to bytes
   */
  private parseSize(size: string): number {
    const units: { [key: string]: number } = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    };

    const match = size.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    return value * (units[unit] || 1);
  }

  /**
   * Format bytes to human readable size
   */
  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)}${units[unitIndex]}`;
  }
}