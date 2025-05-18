import { GalleryConfig } from '../types';
import { generateGalleryConfig } from '../utils/galleryGenerator';

interface GalleryMeta {
    [galleryId: string]: {
        title?: string;
        description?: string;
        layout?: 'grid' | 'carousel' | 'masonry' | 'fullscreen';
        animation?: {
            effect: string;
        };
        transitionTime?: number;  // New property for carousel transition timing
    };
}

export class GalleryMetadataService {
    private galleryMetadata: GalleryMeta;

    constructor() {
        // Initialize with default metadata
        this.galleryMetadata = {
            'gallery1': {
                title: 'Featured Products',
                description: 'Our most popular items this season',
                layout: 'carousel',
                animation: {
                    effect: 'fade'
                },
                transitionTime: 2000  // 2 seconds for gallery1
            },
            'gallery2': {
                title: 'Product Collection',
                description: 'Full catalog of available products',
                layout: 'carousel',
                animation: {
                    effect: 'none'
                },
                transitionTime: 700  // 0.7 seconds for gallery2
            }
        };
    }

    getMetadataForGallery(galleryId: string) {
        return this.galleryMetadata[galleryId] || {};
    }

    async generateGalleryConfig(galleryId: string, files: string[]): Promise<GalleryConfig> {
        const metadata = this.getMetadataForGallery(galleryId);
        return generateGalleryConfig(galleryId, files, metadata);
    }

    updateGalleryMetadata(galleryId: string, metadata: Partial<GalleryMeta[string]>) {
        this.galleryMetadata[galleryId] = {
            ...this.galleryMetadata[galleryId],
            ...metadata
        };
    }
}