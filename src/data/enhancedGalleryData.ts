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
            effect: AnimationEffects.NONE,
            duration: 0.9,
            ease: EaseFunctions.NONE
        },
        galleryContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '4rem 2rem 0 2rem'
        },
        container: {
            width: '90%', // increased for more space
            maxWidth: '1800px', // increased max width
            height: '85vh', // increased from 70vh for better image display
            minHeight: '500px', // increased from 400px
            maxHeight: '95vh', // increased from 90vh
            aspectRatio: 'auto',
            alignment: 'center',
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
        },
        transitionTime: 800,
        items: []
    },
    {
        id: 'gallery3',
        title: 'Video Gallery',
        description: 'Showcase of video content',
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
            width: '85%', // increased by 10% from 77%
            maxWidth: '1585px', // increased proportionally
            height: '73vh', // increased by 10% from 66vh
            minHeight: '485px', // increased by 10% from 440px
            maxHeight: '85vh', // increased by 10% from 77vh
            aspectRatio: '16/9', // Set to 16:9 for proper video ratio
            alignment: 'center',
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
        },
        // No transitionTime needed for videos since they auto-play and loop
        items: []
    },
    {
        id: 'gallery4',
        title: 'Image Slideshow',
        description: 'Cycling image gallery',
        layout: 'carousel',
        animation: {
            effect: AnimationEffects.NONE,
            duration: 0.0,
            ease: EaseFunctions.NONE
        },
        galleryContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '4rem 2rem 0 2rem'
        },
        container: {
            width: '58%', // reduced by another 20% from 72%
            maxWidth: '1150px', // reduced proportionally from 1440px
            height: '85vh', // same as gallery2
            minHeight: '500px', // same as gallery2
            maxHeight: '95vh', // same as gallery2
            aspectRatio: 'auto',
            alignment: 'center',
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
        },
        transitionTime: 1000, // 1 second transition speed
        items: []
    }
];

export default enhancedGalleryData;