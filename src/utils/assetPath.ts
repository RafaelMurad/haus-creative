/**
 * Utility functions for resolving asset paths based on gallery ID
 */

/**
 * Creates an asset URL for a gallery item based on the gallery ID and file name
 * 
 * @param galleryId - The ID of the gallery
 * @param fileName - The file name of the asset
 * @returns The complete path to the asset
 */
export function getAssetPath(galleryId: string, fileName: string): string {
    // Base path to assets folder
    const basePath = '/assets';

    // Clean the gallery ID to ensure it's a valid folder name
    const safeGalleryId = galleryId.replace(/[^a-z0-9-_]/gi, '').toLowerCase();

    // Construct the full path
    const fullPath = `${basePath}/${safeGalleryId}/${fileName}`;

    // Optional: Log paths in development environment
    if (process.env.NODE_ENV === 'development') {
        // Use console.debug to avoid cluttering the console too much
        console.debug(`Asset path generated: ${fullPath}`);
    }

    return fullPath;
}

/**
 * Get all assets in a gallery folder (to be used with server components)
 * 
 * Note: This is a placeholder for server component implementation.
 * Server components would need to use the Node.js fs module or similar
 * to read directory contents.
 * 
 * @param galleryId - The ID of the gallery
 * @returns Array of asset file paths
 */
export async function getGalleryAssets(galleryId: string): Promise<string[]> {
    // This would be implemented with actual filesystem operations in a server component
    return [];
}

/**
 * Creates an asset file name from a title by slugifying it
 * 
 * @param title - The title to convert to a filename
 * @returns Slugified filename
 */
export function titleToFileName(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}