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

// Define animation effects as string literals
export type AnimationEffectType = 'fade' | 'slide' | 'slide-up' | 'slide-down' | 'scale' | 'none';

// Define ease functions as string literals
export type EaseFunctionType = 'power1.in' | 'power1.out' | 'power1.inOut' |
    'power2.in' | 'power2.out' | 'power2.inOut' |
    'power3.in' | 'power3.out' | 'power3.inOut' | 'none';

// Constants for compile-time safety and runtime use
export const AnimationEffects = {
    FADE: 'fade',
    SLIDE: 'slide',
    SCALE: 'scale',
    NONE: 'none'
} as const;

export const EaseFunctions = {
    POWER1_IN: 'power1.in',
    POWER1_OUT: 'power1.out',
    POWER1_INOUT: 'power1.inOut',
    POWER2_IN: 'power2.in',
    POWER2_OUT: 'power2.out',
    POWER2_INOUT: 'power2.inOut',
    NONE: 'none'
} as const;

// Update AnimationConfig interface
export interface AnimationConfig {
    effect: AnimationEffectType;
    duration: number;
    ease: EaseFunctionType;
    delay?: number;
    stagger?: number;
    from?: Record<string, any>;
    to?: Record<string, any>;
    crossfade?: {
        from?: Record<string, any>;
        to?: Record<string, any>;
        prevOut?: Record<string, any>;
    };
}

interface ContainerConfig {
    width?: string;  // e.g. '61%'
    minWidth?: string; // e.g. '300px'
    maxWidth?: string; // e.g. '61vw'
    height?: string; // e.g. '50vh'
    minHeight?: string; // e.g. '200px'
    maxHeight?: string; // e.g. '80vh'
    aspectRatio?: string; // e.g. '16/9'
    alignment?: 'left' | 'right' | 'center'; // Corresponds to margin: auto for center
    background?: string; // e.g. 'rgba(255,255,255,0.9)'
    padding?: string; // e.g. '1rem' or '10px 20px'
    margin?: string; // e.g. '0 auto' or '1rem'
    borderRadius?: string; // e.g. '12px' or '50%'
}

interface GalleryContainerConfig {
    padding?: string;
    display?: string;
    alignItems?: string;
    justifyContent?: string;
    minHeight?: string;
    [key: string]: any;
}

export interface GalleryConfig {
    id: string;
    title: string;
    description: string;
    layout?: 'grid' | 'carousel' | 'masonry' | 'fullscreen';
    animation: AnimationConfig;
    items: MediaItem[];
    transitionTime?: number;  // Add transition time for carousel
    container?: ContainerConfig;  // Add container configuration
    galleryContainer?: GalleryContainerConfig;
}