// Original gallery types
export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
}

export interface GallerySection {
    id: string;
    title: string;
    description: string;
    effect: string;
    items: GalleryItem[];
}

// Enhanced gallery types
export interface MediaItem {
    id: string;
    title: string;
    description: string;
    type: 'image' | 'video' | 'gif';
    url: string;
    imageUrl?: string; // Added for backward compatibility
    thumbUrl?: string;
    category: string;
    size?: {
        width?: string | number;
        height?: string | number;
    };
}

export interface AnimationConfig {
    effect: string;
    duration: number;
    ease: string;
    delay?: number;
    stagger?: number;
    from?: Record<string, any>;
    to?: Record<string, any>;
}

export interface GalleryConfig {
    id: string;
    title: string;
    description: string;
    layout?: 'grid' | 'carousel' | 'masonry' | 'fullscreen';
    animation: AnimationConfig;
    items: MediaItem[];
}