'use client'

import { useRef, memo } from 'react'
import { lazy, Suspense } from 'react'
import enhancedGalleryData from '../data/enhancedGalleryData'
import { GalleryConfig } from '../types'

// Lazy load GalleryRow for better code splitting
const GalleryRow = lazy(() => import('./GalleryRow'))

interface GalleryProps {
  galleries?: GalleryConfig[];
  className?: string;
}

const Gallery = memo(({ 
  galleries = enhancedGalleryData,
  className = '' 
}: GalleryProps) => {
  const galleryRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={galleryRef} className={`gallery-container ${className}`}>
      {galleries.map(gallery => (
        <Suspense 
          key={gallery.id} 
          fallback={
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          }
        >
          <GalleryRow gallery={gallery} />
        </Suspense>
      ))}
    </div>
  )
})

Gallery.displayName = 'Gallery'

export default Gallery