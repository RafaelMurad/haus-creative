'use client'

import { useRef, memo } from 'react'
import { lazy, Suspense } from 'react'
import enhancedGalleryData from '../data/enhancedGalleryData'
import { GalleryConfig } from '../types'
import ErrorBoundary from './ErrorBoundary'

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
        <ErrorBoundary key={gallery.id}>
          <Suspense 
            fallback={
              <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <div className="loading-skeleton w-16 h-16 rounded-full"></div>
              </div>
            }
          >
            <GalleryRow gallery={gallery} />
          </Suspense>
        </ErrorBoundary>
      ))}
    </div>
  )
})

Gallery.displayName = 'Gallery'

export default Gallery