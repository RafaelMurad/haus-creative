// Simplified types for gallery system
export interface MediaItem {
    id: string;
    title: string;
    description: string;
    type: 'image' | 'video';
    url: string;
    thumbUrl?: string; // For video thumbnails
}

export type GalleryType = 'static' | 'crossfade' | 'treadmill' | 'video';

export interface GalleryConfig {
    id: string;
    type: GalleryType;
    autoAdvance?: number; // milliseconds, only for crossfade/video
    items: MediaItem[];
}