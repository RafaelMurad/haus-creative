// Enhanced gallery data structure with support for multiple media types and GSAP animations
import { GalleryConfig, AnimationEffects, EaseFunctions } from '../types';

const enhancedGalleryData: GalleryConfig[] = [
    {
        id: 'gallery1',
        title: 'Gallery 1',
        description: 'First gallery showcase',
        layout: 'fullscreen', // Changed to fullscreen layout
        animation: {
            effect: AnimationEffects.FADE,
            duration: 0.7,
            ease: EaseFunctions.POWER2_INOUT
        },
        galleryContainer: {
            padding: '0', // No padding for full viewport
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh', // Full viewport height
        },
        // Remove container styling to make it take the full viewport
        container: {
            width: '100%',
            maxWidth: '100vw',
            height: '100vh',
            minHeight: '100vh',
            maxHeight: '100vh',
            aspectRatio: 'auto',
            alignment: 'center',
            background: 'transparent', // No background
            borderRadius: '0', // No border radius
            padding: '0', // No padding
        },
        transitionTime: 700,
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
        galleryContainer: {
            padding: '4rem 2rem 0 2rem', // top, right, bottom, left
            display: 'flex',
            alignItems: 'flex-start', // or 'center', 'flex-end'
            justifyContent: 'center', // or 'flex-start', 'flex-end'
            minHeight: '80vh',
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
            // No margin here, handled by outer container
        },
        transitionTime: 700,
        items: []  // Initialize empty array to satisfy TypeScript
    }
];

export default enhancedGalleryData;