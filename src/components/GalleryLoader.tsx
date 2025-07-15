
import { getAllGalleries } from '../utils/galleryLoader';
import GallerySection from './GallerySection';

export default async function GalleryLoader() {
  const galleries = getAllGalleries();

  if (galleries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No galleries found</h2>
        <p className="mb-4">
          Please add images or videos to the <code>/public/assets/galleryX/</code> folders.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {galleries.map((gallery) => (
        <GallerySection key={gallery.id} id={gallery.id} items={gallery.items} />
      ))}
    </div>
  );
}
