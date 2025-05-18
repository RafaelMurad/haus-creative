import { GalleryConfig, MediaItem, AnimationConfig } from '../types';
import { getAssetPath } from './assetPath';
import { getAnimationConfig } from './animationConfigs';

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
    return getAnimationConfig('fade');
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

    // Get the animation config based on the effect
    const effect = options?.animation?.effect || 'fade';
    const defaultAnimation = getAnimationConfig(effect);
    
    // Merge any custom animation options
    const mergedAnimation = {
        ...defaultAnimation,
        ...(options?.animation || {})
    };

    return {
        id: galleryId,
        title: options?.title || "",
        description: options?.description || "",
        layout: options?.layout || 'grid',
        animation: mergedAnimation,
        items
    };
}