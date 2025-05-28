/**
 * Debug helper utilities for the gallery container system
 */

/**
 * Debug function to log gallery container structure
 * Only logs in development environment
 */
export function debugGalleryStructure(galleryId: string, containerData: any): void {
    if (process.env.NODE_ENV !== 'development') return;

    console.group(`Gallery Structure Debug: ${galleryId}`);
    console.log('Gallery container config:', containerData.galleryContainer || 'Not configured');
    console.log('Inner container config:', containerData.container || 'Not configured');
    console.log('Items count:', containerData.items?.length || 0);

    if (containerData.items?.length > 0) {
        const firstItem = containerData.items[0];
        console.log('Sample item:', {
            id: firstItem.id,
            type: firstItem.type,
            url: firstItem.url || firstItem.imageUrl || 'No URL found',
        });
    }

    console.groupEnd();
}

/**
 * Logs image loading success/failure for debugging purposes
 */
export function debugImageLoad(galleryId: string, imageUrl: string, success: boolean): void {
    if (process.env.NODE_ENV !== 'development') return;

    if (success) {
        console.debug(`✅ [${galleryId}] Successfully loaded: ${imageUrl}`);
    } else {
        console.warn(`❌ [${galleryId}] Failed to load: ${imageUrl}`);
    }
}
