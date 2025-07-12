'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { GalleryConfig } from '../types'
import { shouldLoadDynamically, logPerformanceMetrics } from '../utils/componentLoader'
import { GalleryRowLoadingFallback } from './LoadingFallbacks'

// Dynamically import GalleryRow with performance monitoring
const GalleryRowDynamic = dynamic(() => {
  const startTime = performance.now()
  return import('./GalleryRow').then(module => {
    const loadTime = performance.now() - startTime
    logPerformanceMetrics('GalleryRow', loadTime)
    return module
  })
}, {
  loading: () => <GalleryRowLoadingFallback />,
  ssr: false
})

// Static import for small galleries
import GalleryRowStatic from './GalleryRow'

interface SmartGalleryRowProps {
  gallery: GalleryConfig;
}

const SmartGalleryRow = ({ 
  gallery
}: SmartGalleryRowProps) => {
  const [useDynamic, setUseDynamic] = useState(true)

  useEffect(() => {
    // Decide whether to use dynamic loading based on gallery size
    const shouldUseDynamic = shouldLoadDynamically(gallery.items.length, 'gallery-row')
    setUseDynamic(shouldUseDynamic)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SmartGalleryRow] Gallery ${gallery.id} items: ${gallery.items.length}, Using dynamic: ${shouldUseDynamic}`)
    }
  }, [gallery])

  // Use static component for small galleries
  if (!useDynamic) {
    return (
      <GalleryRowStatic 
        gallery={gallery}
      />
    )
  }

  // Use dynamic component for large galleries
  return (
    <GalleryRowDynamic 
      gallery={gallery}
    />
  )
}

export default SmartGalleryRow
