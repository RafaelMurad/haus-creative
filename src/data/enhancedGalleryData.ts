
import { GalleryConfig, AnimationEffects, EaseFunctions } from '../types';

const enhancedGalleryData: GalleryConfig[] = [
    {
        id: 'gallery1',
        title: 'Gallery 1',
        description: 'First gallery showcase',
        layout: 'fullscreen',
        animation: {
            effect: AnimationEffects.FADE,
            duration: 0.7,
            ease: EaseFunctions.POWER2_INOUT
        },
        galleryContainer: {
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
        },

        container: {
            width: '100%',
            maxWidth: '100vw',
            height: '100vh',
            minHeight: '100vh',
            maxHeight: '100vh',
            aspectRatio: 'auto',
            alignment: 'center',
            background: '#fff',
            borderRadius: '0',
            padding: '0',
        },
        transitionTime: 2000,
        items: []
    },
    {
        id: 'gallery2',
        title: 'Product Collection',
        description: 'Full catalog of available products',
        layout: 'carousel',
        animation: {
            effect: AnimationEffects.FADE,
            duration: 0.8,
            ease: EaseFunctions.POWER2_INOUT
        },
        galleryContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '4rem 2rem 0 2rem'
        },
        container: {
            width: '80%',
            maxWidth: '100vw',
            height: '70vh',
            minHeight: '400px',
            maxHeight: '90vh',
            aspectRatio: 'auto',
            alignment: 'center',
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
        },
        transitionTime: 2500,
        items: []
    }
];

export default enhancedGalleryData;