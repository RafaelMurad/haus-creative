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

    // For videos, try to find a cover image with common naming patterns
    let thumbUrl: string | undefined;
    if (type === 'video') {
        // Try different cover image naming patterns in order of preference
        const videoBaseName = filename.split('.')[0];
        const possibleCoverNames = [
            // First try simple gallery naming pattern (most common)
            `${galleryId.charAt(0).toUpperCase() + galleryId.slice(1)}-Cover.png`,
            // Then try video-specific patterns if simple pattern doesn't work
            `${videoBaseName}-Cover.png`,
            `${videoBaseName}-cover.png`,
            `thumb-${videoBaseName}.jpg`
        ];

        // Try to find a cover image by checking common naming patterns
        // Check each possible cover name and use the first one that would exist
        for (const coverName of possibleCoverNames) {
            // For client-side, we'll make educated guesses based on known patterns
            // since we can't easily check file existence in the browser
            const isLikelyToExist = checkLikelyCoverExistence(galleryId, coverName);
            if (isLikelyToExist) {
                thumbUrl = getAssetPath(galleryId, coverName);
                break;
            }
        }

        // Fallback: no cover image found, video will play without poster
        if (!thumbUrl) {
            thumbUrl = undefined;
        }
    }

    return {
        id: `${galleryId}-${index}`,
        title: "",  // Add empty string to satisfy type requirements
        description: "", // Add empty string to satisfy type requirements
        type,
        url,
        thumbUrl,
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
        transitionTime?: number;
    }
): GalleryConfig {
    // For video galleries, prioritize video files first, then other media
    const sortedFiles = [...files].sort((a, b) => {
        const aType = detectFileType(a);
        const bType = detectFileType(b);

        // Videos first, then images
        if (aType === 'video' && bType !== 'video') return -1;
        if (bType === 'video' && aType !== 'video') return 1;

        // Within the same type, sort alphabetically
        return a.localeCompare(b);
    });

    // Create media items from sorted files
    const items = sortedFiles.map((file, index) =>
        createMediaItemFromFile(galleryId, file, index)
    );

    // Get the animation config based on the effect
    const effect = options?.animation?.effect || 'none';
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
        transitionTime: options?.transitionTime,
        items
    };
}

/**
 * Check if a cover image is likely to exist based on known patterns
 * Since we can't easily check file existence in client-side code,
 * we make educated guesses based on known gallery structures
 * 
 * @param galleryId - ID of the gallery
 * @param coverName - Name of the potential cover file
 * @returns Whether the cover is likely to exist
 */
function checkLikelyCoverExistence(galleryId: string, coverName: string): boolean {
    // Known existing cover patterns for specific galleries
    const knownCovers: Record<string, string[]> = {
        'gallery3': ['Gallery3-Cover.png'],
        'gallery5': ['Gallery5-Cover.png'],
        'gallery9': ['Gallery9-Cover.png'],
        'gallery10': ['Gallery10-Cover.png'],
    };

    // Check if this gallery has known cover files
    if (knownCovers[galleryId]) {
        return knownCovers[galleryId].includes(coverName);
    }

    // For other galleries, prefer the simple gallery-specific naming pattern
    // e.g., "Gallery4-Cover.png" (without the video name in it)
    const simplePattern = `${galleryId.charAt(0).toUpperCase() + galleryId.slice(1)}-Cover.png`;
    if (coverName === simplePattern) {
        return true;
    }

    return false;
}