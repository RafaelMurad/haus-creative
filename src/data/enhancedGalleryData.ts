// Enhanced gallery data structure with support for multiple media types and GSAP animations
import { GalleryConfig, MediaItem, AnimationConfig } from '../types';

const enhancedGalleryData: GalleryConfig[] = [
    {
        id: 'hero-gallery',
        title: 'Beauty Essentials',
        description: 'Capturing the essence of skincare and beauty products in their purest form.',
        layout: 'carousel',
        animation: {
            effect: 'fade',
            duration: 0.25,
            ease: 'power2.inOut',
            crossfade: {
                from: { opacity: 0, scale: 1.05, filter: 'blur(4px)' },
                to: { opacity: 1, scale: 1, filter: 'blur(0px)' },
                prevOut: { opacity: 0, scale: 0.95, filter: 'blur(8px)' }
            }
        },
        items: [
            {
                id: 'beauty-1',
                title: 'Morning Ritual',
                description: 'Essential skincare for your daily routine',
                type: 'image',
                url: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Beauty'
            },
            {
                id: 'beauty-2',
                title: 'Essence Collection',
                description: 'Premium serums for radiant skin',
                type: 'image',
                url: 'https://images.pexels.com/photos/5069609/pexels-photo-5069609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Beauty'
            },
            {
                id: 'beauty-video',
                title: 'Product Spotlight',
                description: 'Featured product demonstration',
                type: 'video',
                url: 'https://example.com/videos/beauty-product.mp4',
                thumbUrl: 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg',
                category: 'Beauty'
            }
        ]
    },
    {
        id: 'fashion-gallery',
        title: 'Fashion Statements',
        description: 'Bold expressions through contemporary fashion photography.',
        layout: 'grid',
        animation: {
            effect: 'clip-reveal',
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.15,
            from: {
                clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
                scale: 1.1
            },
            to: {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                scale: 1
            }
        },
        items: [
            {
                id: 'fashion-1',
                title: 'Urban Sophistication',
                description: 'Contemporary street style with an edge',
                type: 'image',
                url: 'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Fashion'
            },
            {
                id: 'fashion-2',
                title: 'Minimalist Appeal',
                description: 'Clean lines and structured silhouettes',
                type: 'image',
                url: 'https://images.pexels.com/photos/2468339/pexels-photo-2468339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Fashion'
            },
            {
                id: 'fashion-gif',
                title: 'Motion Editorial',
                description: 'Fashion in motion',
                type: 'gif',
                url: 'https://example.com/gifs/fashion.gif',
                category: 'Fashion'
            }
        ]
    },
    {
        id: 'video-showcase',
        title: 'Motion & Film',
        description: 'Exploring movement and visual storytelling through video and animated content.',
        layout: 'masonry',
        animation: {
            effect: 'slide-up',
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.2
        },
        items: [
            {
                id: 'video-1',
                title: 'Cinematic Product Story',
                description: 'Narrative-driven product visualization',
                type: 'video',
                url: 'https://assets.mixkit.co/videos/preview/mixkit-product-moving-through-a-production-line-11069-large.mp4',
                thumbUrl: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Video'
            },
            {
                id: 'video-2',
                title: 'Urban Motion',
                description: 'City life captured in motion',
                type: 'video',
                url: 'https://assets.mixkit.co/videos/preview/mixkit-arial-view-of-city-traffic-9262-large.mp4',
                thumbUrl: 'https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Video'
            },
            {
                id: 'gif-1',
                title: 'Abstract Flow',
                description: 'Fluid motion graphics experiment',
                type: 'gif',
                url: 'https://media3.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif?cid=ecf05e47uf5oc61gdz88od3ronatvu8vtk91jyq0jp2w63q7&ep=v1_gifs_search&rid=giphy.gif&ct=g',
                category: 'Animation'
            },
            {
                id: 'video-3',
                title: 'Minimalist Movement',
                description: 'Simple motion with powerful visuals',
                type: 'video',
                url: 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-mechanical-keyboard-close-up-2429-large.mp4',
                thumbUrl: 'https://images.pexels.com/photos/3379937/pexels-photo-3379937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Video'
            }
        ]
    },
    {
        id: 'fullscreen-experience',
        title: 'Immersive Visuals',
        description: 'Full-screen visual experiences that tell a story.',
        layout: 'fullscreen',
        animation: {
            effect: 'fade',
            duration: 1.2,
            ease: 'power2.inOut'
        },
        items: [
            {
                id: 'fullscreen-1',
                title: 'Urban Perspective',
                description: 'Architecture and urban spaces from a new point of view',
                type: 'image',
                url: 'https://images.pexels.com/photos/1707823/pexels-photo-1707823.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Fullscreen'
            },
            {
                id: 'fullscreen-2',
                title: 'Material Study',
                description: 'Exploration of texture and light',
                type: 'image',
                url: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Fullscreen'
            },
            {
                id: 'fullscreen-video',
                title: 'Slow Motion Elegance',
                description: 'Capturing the beauty of deliberate movement',
                type: 'video',
                url: 'https://assets.mixkit.co/videos/preview/mixkit-tour-of-an-old-town-of-europe-by-the-sea-22609-large.mp4',
                thumbUrl: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                category: 'Fullscreen'
            }
        ]
    }
];

export default enhancedGalleryData;