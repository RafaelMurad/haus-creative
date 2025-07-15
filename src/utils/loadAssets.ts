import { MediaItem, GalleryConfig, GalleryType } from '../types';

// Simple utility to detect file type
function getMediaType(filename: string): 'image' | 'video' {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'mov'].includes(ext || '')) {
        return 'video';
    }
    return 'image';
}

// Create media item from filename
function createMediaItem(galleryId: string, filename: string, index: number): MediaItem {
    const type = getMediaType(filename);
    const url = `/assets/${galleryId}/${filename}`;
    
    // For videos, try to find cover image
    let thumbUrl: string | undefined;
    if (type === 'video') {
        const baseName = filename.split('.')[0];
        const possibleCovers = [
            `${galleryId.charAt(0).toUpperCase() + galleryId.slice(1)}-Cover.png`,
            `${baseName}-Cover.png`
        ];
        
        // Use first possible cover (in real app, you'd check if file exists)
        thumbUrl = `/assets/${galleryId}/${possibleCovers[0]}`;
    }
    
    return {
        id: `${galleryId}-${index}`,
        title: `${galleryId} Item ${index + 1}`,
        description: `Media item from ${galleryId}`,
        type,
        url,
        thumbUrl
    };
}

// Gallery configurations with restored styling from enhancedGalleryData
const galleryConfigs: Omit<GalleryConfig, 'items'>[] = [
    {
        id: 'gallery1',
        type: 'crossfade',
        autoAdvance: 2000,
        styling: {
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
            }
        }
    },
    {
        id: 'gallery2',
        type: 'crossfade',
        autoAdvance: 800,
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '4rem 2rem 0 2rem'
            },
            container: {
                width: '90%',
                maxWidth: '1800px',
                height: '85vh',
                minHeight: '500px',
                maxHeight: '95vh',
                aspectRatio: 'auto',
                alignment: 'center',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
            }
        }
    },
    {
        id: 'gallery3',
        type: 'video',
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '4rem 2rem 0 2rem'
            },
            container: {
                width: '85%',
                maxWidth: '1585px',
                height: '73vh',
                minHeight: '485px',
                maxHeight: '85vh',
                aspectRatio: '16/9',
                alignment: 'center',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
            }
        }
    },
    {
        id: 'gallery4',
        type: 'crossfade',
        autoAdvance: 1000,
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '4rem 2rem 0 2rem'
            },
            container: {
                width: '58%',
                maxWidth: '1150px',
                height: '85vh',
                minHeight: '500px',
                maxHeight: '95vh',
                aspectRatio: 'auto',
                alignment: 'center',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
            }
        }
    },
    {
        id: 'gallery5',
        type: 'video',
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '4rem 2rem 0 2rem'
            },
            container: {
                width: '72%',
                maxWidth: '1347px',
                height: '73vh',
                minHeight: '485px',
                maxHeight: '85vh',
                aspectRatio: '16/9',
                alignment: 'center',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
            }
        }
    },
    {
        id: 'gallery6',
        type: 'treadmill',
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '0',
                overflow: 'hidden',
                width: '100vw'
            },
            container: {
                width: '100vw',
                maxWidth: '100vw',
                height: '73vh',
                minHeight: '73vh',
                maxHeight: '73vh',
                alignment: 'center',
                background: 'transparent',
                padding: '0',
            }
        }
    },
    {
        id: 'gallery7',
        type: 'crossfade',
        autoAdvance: 2000,
        styling: {
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
            }
        }
    },
    {
        id: 'gallery8',
        type: 'crossfade',
        autoAdvance: 3000,
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '4rem 2rem 0 2rem'
            },
            container: {
                width: '85%',
                maxWidth: '1585px',
                height: '73vh',
                minHeight: '485px',
                maxHeight: '85vh',
                aspectRatio: '16/9',
                alignment: 'center',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
            }
        }
    },
    {
        id: 'gallery9',
        type: 'video',
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '4rem 2rem 0 2rem'
            },
            container: {
                width: '85%',
                maxWidth: '1585px',
                height: '73vh',
                minHeight: '485px',
                maxHeight: '85vh',
                aspectRatio: '16/9',
                alignment: 'center',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
            }
        }
    },
    {
        id: 'gallery10',
        type: 'video',
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '4rem 2rem 0 2rem'
            },
            container: {
                width: '90%',
                maxWidth: '1800px',
                height: '85vh',
                minHeight: '500px',
                maxHeight: '95vh',
                aspectRatio: '16/9',
                alignment: 'center',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
            }
        }
    },
    {
        id: 'gallery11',
        type: 'treadmill',
        styling: {
            galleryContainer: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '0',
                overflow: 'hidden',
                width: '100vw'
            },
            container: {
                width: '100vw',
                maxWidth: '100vw',
                height: '73vh',
                minHeight: '73vh',
                maxHeight: '73vh',
                alignment: 'center',
                background: 'transparent',
                padding: '0',
            }
        }
    },
    {
        id: 'gallery12',
        type: 'crossfade',
        autoAdvance: 2000,
        styling: {
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
            }
        }
    }
];

// Mock file lists (in real app, this would scan the file system)
const mockAssetFiles: Record<string, string[]> = {
    gallery1: ['Gallery1-1.png', 'Gallery1-2.png', 'Gallery1-3.png', 'Gallery1-4.png', 'Gallery1-5.png', 'Gallery1-6.jpg', 'Gallery1-7.png', 'Gallery1-8.png', 'Gallery1-9.png', 'Gallery1-10.png'],
    gallery2: ['Gallery2-1.png', 'Gallery2-2.png', 'Gallery2-3.png', 'Gallery2-4.png', 'Gallery2-5.png', 'Gallery2-6.png', 'Gallery2-7.png', 'Gallery2-8.png', 'Gallery2-9.png', 'Gallery2-10.png'],
    gallery3: ['Gallery3-Video.mp4'],
    gallery4: ['Gallery4-1.png', 'Gallery4-2.png', 'Gallery4-3.png', 'Gallery4-4.png', 'Gallery4-5.png', 'Gallery4-6.png', 'Gallery4-7.png', 'Gallery4-8.png'],
    gallery5: ['Gallery5-Video.mp4'],
    gallery6: ['Gallery6-1.png', 'Gallery6-2.png', 'Gallery6-3.png', 'Gallery6-4.png'],
    gallery7: ['Gallery7-1 .png', 'Gallery7-2.png', 'Gallery7-3.png', 'Gallery7-4.png', 'Gallery7-5.png', 'Gallery7-6.png', 'Gallery7-7.png', 'Gallery7-8.png', 'Gallery7-9.png'],
    gallery8: ['Gallery8-1.png'],
    gallery9: ['Gallery9-Video.mp4'],
    gallery10: ['Gallery10-Ouronyx.mp4', 'Gallery10-Ouronyx-Mobile.mp4'],
    gallery11: ['Gallery11-1.png', 'Gallery11-2.png'],
    gallery12: ['Gallery12-1.png', 'Gallery12-2.png', 'Gallery12-3.png', 'Gallery12-4.png', 'Gallery12-5.png', 'Gallery12-6.png']
};

// Load all gallery configurations with their assets
export function loadGalleries(): GalleryConfig[] {
    return galleryConfigs.map(config => {
        const files = mockAssetFiles[config.id] || [];
        const items = files.map((filename, index) => 
            createMediaItem(config.id, filename, index)
        );
        
        return {
            ...config,
            items
        };
    });
}