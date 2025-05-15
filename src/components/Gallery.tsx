'use client'

import { useRef } from 'react'
import GalleryRow from './GalleryRow'
import enhancedGalleryData from '../data/enhancedGalleryData'
import { GalleryConfig } from '../types'

interface GalleryProps {
  galleries?: GalleryConfig[];
  className?: string;
}

const Gallery = ({ 
  galleries = enhancedGalleryData,
  className = '' 
}: GalleryProps) => {
  const galleryRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={galleryRef} className={`gallery-container ${className}`}>
      {galleries.map(gallery => (
        <GalleryRow 
          key={gallery.id} 
          gallery={gallery} 
        />
      ))}
    </div>
  )
}

export default Gallery