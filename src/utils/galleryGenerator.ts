import { GalleryConfig, MediaItem, AnimationConfig } from '../types';
import { getAssetPath } from './assetPath';

/**
 * Detects file type based on extension
 * 
 * @param filename - File to check
 * @returns Media type ('image', 'video', or 'gif')
 */
export function detectFileType(filename: string): 'image' | 'video' | 'gif' {
    const extension = filename.split('.').pop()?.toLowerCase();

    if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) {
        return 'video';
    } else if (extension === 'gif') {
        return 'gif';
    } else {
        // Default to image for jpg, png, webp, etc.
        return 'image';
    }
}

/**
 * Generate a media item from a filename
 * 
 * @param galleryId - ID of the gallery
 * @param filename - Filename of the media
 * @param index - Index for unique ID generation
 * @returns Media item configuration
 */
export function createMediaItemFromFile(
    galleryId: string,
    filename: string,
    index: number
): MediaItem {
    // No longer extract title from filename - we don't want to display any text
    const type = detectFileType(filename);
    const url = getAssetPath(galleryId, filename);

    return {
        id: `${galleryId}-${index}`,
        title: "",  // Add empty string to satisfy type requirements
        description: "", // Add empty string to satisfy type requirements
        type,
        url,
        thumbUrl: type === 'video' ? getAssetPath(galleryId, `thumb-${filename.split('.')[0]}.jpg`) : undefined,
        category: galleryId
    };
}

/**
 * Get default animation config
 * 
 * @returns Default animation configuration
 */
export function getDefaultAnimationConfig(): AnimationConfig {
    return {
        effect: 'fade',
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        from: { opacity: 0, y: 20 },
        to: { opacity: 1, y: 0 }
    };
}

/**
 * Generate gallery config from file list
 * 
 * @param galleryId - ID of the gallery
 * @param files - List of files in the gallery folder
 * @param options - Optional gallery configuration options
 * @returns Complete gallery configuration
 */
export function generateGalleryConfig(
    galleryId: string,
    files: string[],
    options?: {
        title?: string;
        description?: string;
        layout?: 'grid' | 'carousel' | 'masonry' | 'fullscreen';
        animation?: Partial<AnimationConfig>;
    }
): GalleryConfig {
    // Create media items from files
    const items = files.map((file, index) =>
        createMediaItemFromFile(galleryId, file, index)
    );

    // Create default animation config
    const defaultAnimation = getDefaultAnimationConfig();

    return {
        id: galleryId,
        // Keep title and description as empty strings to maintain data structure
        // but ensure they won't be displayed
        title: "",
        description: "",
        layout: options?.layout || 'grid',
        animation: {
            ...defaultAnimation,
            ...options?.animation
        },
        items
    };
}