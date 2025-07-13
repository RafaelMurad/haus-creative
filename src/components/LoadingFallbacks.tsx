"use client";

interface GalleryLoadingFallbackProps {
  itemCount?: number;
}

export const GalleryLoadingFallback = ({
  itemCount = 0,
}: GalleryLoadingFallbackProps) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
    <h3 className="text-lg font-medium mb-2">Loading Gallery...</h3>
    <p className="text-gray-600 text-sm">
      {itemCount > 0
        ? `Preparing ${itemCount} items...`
        : "Preparing interactive gallery experience"}
    </p>
  </div>
);

interface MediaItemLoadingFallbackProps {
  showSpinner?: boolean;
}

export const MediaItemLoadingFallback = ({
  showSpinner = true,
}: MediaItemLoadingFallbackProps) => (
  <div className="media-item-placeholder bg-gray-100 rounded-lg animate-pulse">
    <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center">
      {showSpinner && (
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      )}
    </div>
  </div>
);

interface GalleryRowLoadingFallbackProps {
  itemCount?: number;
}

export const GalleryRowLoadingFallback = ({
  itemCount = 3,
}: GalleryRowLoadingFallbackProps) => (
  <div className="gallery-row-placeholder p-4">
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: Math.min(itemCount, 5) }).map((_, index) => (
        <MediaItemLoadingFallback key={index} showSpinner={index === 0} />
      ))}
    </div>
  </div>
);
