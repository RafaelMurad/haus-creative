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

// Container styling configuration
export interface ContainerConfig {
    width?: string;
    maxWidth?: string;
    height?: string;
    minHeight?: string;
    maxHeight?: string;
    aspectRatio?: string;
    alignment?: 'left' | 'center' | 'right';
    background?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
}

// Gallery container styling configuration
export interface GalleryContainerConfig {
    padding?: string;
    display?: string;
    alignItems?: string;
    justifyContent?: string;
    minHeight?: string;
    background?: string;
    overflow?: string;
    width?: string;
}

// Styling configuration for each gallery
export interface GalleryStyling {
    container?: ContainerConfig;
    galleryContainer?: GalleryContainerConfig;
}

export interface GalleryConfig {
    id: string;
    type: GalleryType;
    autoAdvance?: number; // milliseconds, only for crossfade/video
    styling?: GalleryStyling; // Restored styling configurations
    items: MediaItem[];
}