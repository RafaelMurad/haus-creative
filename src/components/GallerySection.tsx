import React from 'react';
import { MediaItem } from '../utils/galleryLoader';
import MediaItemComponent from './MediaItem';

interface GallerySectionProps {
  id: string;
  items: MediaItem[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ id, items }) => {
  // TODO: Add GSAP transitions (crossfade/treadmill) here
  return (
    <section className="w-full h-screen flex items-center justify-center bg-white">
      {/* You can add a title or overlay here if needed */}
      <div className="w-full h-full flex items-center justify-center">
        {/* For now, just show the first item as a placeholder */}
        {items.length > 0 ? (
          <MediaItemComponent item={items[0]} />
        ) : (
          <div className="text-gray-400">No media found</div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
