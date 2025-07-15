import { MediaItem, GalleryConfig, GalleryType } from '../types';

// Simple utility to detect file type
function getMediaType(filename: string): 'image' | 'video' {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'mov'].includes(ext || '')) {
        return 'video';
    }
    return 'image';
}

// Create media item from filename
function createMediaItem(galleryId: string, filename: string, index: number): MediaItem {
    const type = getMediaType(filename);
    const url = `/assets/${galleryId}/${filename}`;
    
    // For videos, try to find cover image
    let thumbUrl: string | undefined;
    if (type === 'video') {
        const baseName = filename.split('.')[0];
        const possibleCovers = [
            `${galleryId.charAt(0).toUpperCase() + galleryId.slice(1)}-Cover.png`,
            `${baseName}-Cover.png`
        ];
        
        // Use first possible cover (in real app, you'd check if file exists)
        thumbUrl = `/assets/${galleryId}/${possibleCovers[0]}`;
    }
    
    return {
        id: `${galleryId}-${index}`,
        title: `${galleryId} Item ${index + 1}`,
        description: `Media item from ${galleryId}`,
        type,
        url,
        thumbUrl
    };
}

// Gallery configurations - defines behavior for each gallery
const galleryConfigs: Omit<GalleryConfig, 'items'>[] = [
    { id: 'gallery1', type: 'crossfade', autoAdvance: 2000 },
    { id: 'gallery2', type: 'crossfade', autoAdvance: 800 },
    { id: 'gallery3', type: 'video' }, // No auto-advance for videos
    { id: 'gallery4', type: 'crossfade', autoAdvance: 1000 },
    { id: 'gallery5', type: 'video' }, // No auto-advance for videos
    { id: 'gallery6', type: 'treadmill' },
    { id: 'gallery7', type: 'crossfade', autoAdvance: 2000 },
    { id: 'gallery8', type: 'crossfade', autoAdvance: 3000 },
    { id: 'gallery9', type: 'video' }, // No auto-advance for videos
    { id: 'gallery10', type: 'video' }, // No auto-advance for videos
    { id: 'gallery11', type: 'treadmill' },
    { id: 'gallery12', type: 'crossfade', autoAdvance: 2000 }
];

// Mock file lists (in real app, this would scan the file system)
const mockAssetFiles: Record<string, string[]> = {
    gallery1: ['Gallery1-1.png', 'Gallery1-2.png', 'Gallery1-3.png', 'Gallery1-4.png', 'Gallery1-5.png', 'Gallery1-6.jpg', 'Gallery1-7.png', 'Gallery1-8.png', 'Gallery1-9.png', 'Gallery1-10.png'],
    gallery2: ['Gallery2-1.png', 'Gallery2-2.png', 'Gallery2-3.png', 'Gallery2-4.png', 'Gallery2-5.png', 'Gallery2-6.png', 'Gallery2-7.png', 'Gallery2-8.png', 'Gallery2-9.png', 'Gallery2-10.png'],
    gallery3: ['Gallery3-Video.mp4'],
    gallery4: ['Gallery4-1.png', 'Gallery4-2.png', 'Gallery4-3.png', 'Gallery4-4.png', 'Gallery4-5.png', 'Gallery4-6.png', 'Gallery4-7.png', 'Gallery4-8.png'],
    gallery5: ['Gallery5-Video.mp4'],
    gallery6: ['Gallery6-1.png', 'Gallery6-2.png', 'Gallery6-3.png', 'Gallery6-4.png'],
    gallery7: ['Gallery7-1 .png', 'Gallery7-2.png', 'Gallery7-3.png', 'Gallery7-4.png', 'Gallery7-5.png', 'Gallery7-6.png', 'Gallery7-7.png', 'Gallery7-8.png', 'Gallery7-9.png'],
    gallery8: ['Gallery8-1.png'],
    gallery9: ['Gallery9-Video.mp4'],
    gallery10: ['Gallery10-Ouronyx.mp4', 'Gallery10-Ouronyx-Mobile.mp4'],
    gallery11: ['Gallery11-1.png', 'Gallery11-2.png'],
    gallery12: ['Gallery12-1.png', 'Gallery12-2.png', 'Gallery12-3.png', 'Gallery12-4.png', 'Gallery12-5.png', 'Gallery12-6.png']
};

// Load all gallery configurations with their assets
export function loadGalleries(): GalleryConfig[] {
    return galleryConfigs.map(config => {
        const files = mockAssetFiles[config.id] || [];
        const items = files.map((filename, index) => 
            createMediaItem(config.id, filename, index)
        );
        
        return {
            ...config,
            items
        };
    });
}