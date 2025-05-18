// Enhanced gallery data structure with support for multiple media types and GSAP animations
import { GalleryConfig } from '../types';

const enhancedGalleryData: GalleryConfig[] = [
    {
        id: 'gallery1',
        title: 'Gallery 1',
        description: 'First gallery showcase',
        layout: 'carousel',
        animation: {
            effect: 'fade',
            duration: 0.7,
            ease: 'power2.inOut'
        },
        items: []  // Initialize empty array to satisfy TypeScript
    },
    {
        id: 'gallery2',
        title: 'Gallery 2',
        description: 'Second gallery showcase',
        layout: 'carousel',
        animation: {
            effect: 'fade',
            duration: 0.7,
            ease: 'power2.inOut'
        },
        container: {
            width: '61%',
            alignment: 'right'
        },
        items: []  // Initialize empty array to satisfy TypeScript
    }
];

export default enhancedGalleryData;