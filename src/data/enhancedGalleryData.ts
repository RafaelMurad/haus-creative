// Enhanced gallery data structure with support for multiple media types and GSAP animations
import { GalleryConfig, AnimationEffects, EaseFunctions } from '../types';

const enhancedGalleryData: GalleryConfig[] = [
    {
        id: 'gallery1',
        title: 'Gallery 1',
        description: 'First gallery showcase',
        layout: 'carousel',
        animation: {
            effect: AnimationEffects.FADE,
            duration: 0.7,
            ease: EaseFunctions.POWER2_INOUT
        },
        items: []  // Initialize empty array to satisfy TypeScript
    },
    {
        id: 'gallery2',
        title: 'Product Collection',
        description: 'Full catalog of available products',
        layout: 'carousel',
        animation: {
            effect: AnimationEffects.NONE,
            duration: 0,
            ease: EaseFunctions.NONE
        },
        container: {
            width: '80%',
            maxWidth: '100vw',
            height: '70vh',
            minHeight: '400px',
            maxHeight: '90vh',
            aspectRatio: 'auto',
            alignment: 'center',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '12px',
            padding: '1rem',
            margin: '0 auto',
        },
        transitionTime: 700,
        items: []  // Initialize empty array to satisfy TypeScript
    }
];

export default enhancedGalleryData;