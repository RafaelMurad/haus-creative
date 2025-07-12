'use client'

import dynamic from 'next/dynamic'
import { GalleryConfig } from '../types'
import { shouldLoadDynamically, logPerformanceMetrics } from '../utils/componentLoader'
import { GalleryLoadingFallback } from './LoadingFallbacks'
import { useEffect, useState } from 'react'

// Dynamically import Gallery component with intelligent loading
const Gallery = dynamic(() => {
  const startTime = performance.now()
  return import('./Gallery').then(module => {
    const loadTime = performance.now() - startTime
    logPerformanceMetrics('Gallery', loadTime)
    return module
  })
}, {
  loading: () => <GalleryLoadingFallback />,
  ssr: false // Disable SSR for better performance with GSAP
})

// Fallback for when dynamic loading is not needed
import GalleryStatic from './Gallery'

interface DynamicGalleryProps {
  galleries: GalleryConfig[];
  className?: string;
}

const DynamicGallery = ({ 
  galleries, 
  className = '' 
}: DynamicGalleryProps) => {
  const [useDynamic, setUseDynamic] = useState(true)

  useEffect(() => {
    // Calculate total items across all galleries
    const totalItems = galleries.reduce((sum, gallery) => sum + gallery.items.length, 0)
    
    // Decide whether to use dynamic loading
    const shouldUseDynamic = shouldLoadDynamically(totalItems, 'gallery')
    setUseDynamic(shouldUseDynamic)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DynamicGallery] Total items: ${totalItems}, Using dynamic loading: ${shouldUseDynamic}`)
    }
  }, [galleries])

  // Use static component for small galleries or high-end devices
  if (!useDynamic) {
    return (
      <GalleryStatic 
        galleries={galleries} 
        className={className}
      />
    )
  }

  // Use dynamic component for large galleries or slower devices
  return (
    <Gallery 
      galleries={galleries} 
      className={className}
    />
  )
}

export default DynamicGallery
