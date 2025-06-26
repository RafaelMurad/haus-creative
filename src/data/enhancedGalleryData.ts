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
        // No animation config - will default to NONE for video galleries
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
        // No transitionTime - videos should loop continuously without interruption
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
    },
    {
        id: 'gallery5',
        title: 'Video Gallery 5',
        description: 'Additional video content showcase',
        layout: 'carousel',
        // No animation config - will default to NONE for easier coding
        galleryContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '4rem 2rem 0 2rem'
        },
        container: {
            width: '72%', // reduced by 15% from 85%
            maxWidth: '1347px', // reduced proportionally from 1585px
            height: '73vh', // same as gallery3
            minHeight: '485px', // same as gallery3
            maxHeight: '85vh', // same as gallery3
            aspectRatio: '16/9', // Set to 16:9 for proper video ratio
            alignment: 'center',
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
        },
        // No transitionTime - videos should loop continuously without interruption
        items: []
    },
    {
        id: 'gallery6',
        title: 'Magazine Cover Treadmill',
        description: 'Small magazine covers sliding right to left like on a treadmill',
        layout: 'carousel',
        animation: {
            effect: AnimationEffects.SLIDE,
            duration: 1.2,
            ease: EaseFunctions.POWER2_INOUT
        },
        galleryContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '0',
            overflow: 'hidden', // Hide images sliding off-screen
            width: '100vw' // Full viewport width for treadmill wrapper
        },
        container: {
            width: '100vw', // Half viewport width for each item
            maxWidth: '100vw',
            height: '73vh', // Keeping magazine proportions (2:3 ratio)
            minHeight: '73vh',
            maxHeight: '73vh',
            alignment: 'center',
            background: 'transparent', // No background for magazine effect
            padding: '0',
        },
        transitionTime: 2500, // 2.5 seconds for smooth treadmill effect
        items: []
    },
    {
        id: 'gallery7',
        title: 'Gallery 7',
        description: 'Seventh gallery showcase',
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
        id: 'gallery8',
        title: 'Static Image Gallery',
        description: 'Static image showcase with same layout as video gallery',
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
            width: '85%', // same as gallery3
            maxWidth: '1585px', // same as gallery3
            height: '73vh', // same as gallery3
            minHeight: '485px', // same as gallery3
            maxHeight: '85vh', // same as gallery3
            aspectRatio: '16/9', // same as gallery3 for consistent layout
            alignment: 'center',
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
        },
        transitionTime: 3000, // 3 seconds for image transitions
        items: []
    }
];

export default enhancedGalleryData;