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

/**
 * Performance debugging helper
 */
export function debugPerformance(label: string, fn: () => void): void {
    if (process.env.NODE_ENV !== 'development') return;
    
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
}

/**
 * Memory usage debugging
 */
export function debugMemoryUsage(): void {
    if (process.env.NODE_ENV !== 'development') return;
    if (!('memory' in performance)) return;
    
    const memory = (performance as any).memory;
    console.log('🧠 Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    });
}