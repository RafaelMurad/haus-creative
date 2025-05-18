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
                    effect: 'scale'
                }
            },
            'gallery2': {
                title: 'Product Collection',
                description: 'Full catalog of available products',
                layout: 'grid'
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