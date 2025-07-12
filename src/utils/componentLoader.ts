'use client'

import dynamic from 'next/dynamic'
import { ComponentType, ReactElement } from 'react'

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  // Load components dynamically after this many items
  MEDIA_ITEMS_THRESHOLD: 10,
  // Load components dynamically for galleries with more than this many items
  GALLERY_SIZE_THRESHOLD: 20,
  // Connection speed detection (if available)
  SLOW_CONNECTION_THRESHOLD: 1000 // milliseconds
}

// Connection speed detection
export const getConnectionSpeed = (): 'fast' | 'slow' | 'unknown' => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    if (connection) {
      // Check effective connection type
      const effectiveType = connection.effectiveType
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        return 'slow'
      }
      if (effectiveType === '3g' || effectiveType === '4g') {
        return 'fast'
      }
    }
  }
  return 'unknown'
}

// Device capability detection
export const getDeviceCapability = (): 'high' | 'medium' | 'low' => {
  if (typeof navigator === 'undefined') return 'medium'
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4
  
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4
  
  // Simple scoring system
  if (cores >= 8 && memory >= 8) return 'high'
  if (cores >= 4 && memory >= 4) return 'medium'
  return 'low'
}

// Dynamic loading strategy decision
export const shouldLoadDynamically = (
  itemCount: number,
  componentType: 'gallery' | 'media-item' | 'gallery-row'
): boolean => {
  const connectionSpeed = getConnectionSpeed()
  const deviceCapability = getDeviceCapability()
  
  // Always load dynamically on slow connections
  if (connectionSpeed === 'slow') return true
  
  // Load dynamically on low-end devices
  if (deviceCapability === 'low') return true
  
  // Component-specific thresholds
  switch (componentType) {
    case 'media-item':
      return itemCount > PERFORMANCE_THRESHOLDS.MEDIA_ITEMS_THRESHOLD
    case 'gallery-row':
      return itemCount > PERFORMANCE_THRESHOLDS.GALLERY_SIZE_THRESHOLD
    case 'gallery':
      return true // Always load gallery dynamically for better UX
    default:
      return false
  }
}

// Dynamic component factory
export const createDynamicComponent = <T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    ssr?: boolean;
    loading?: () => ReactElement;
  } = {}
) => {
  return dynamic(importFn, {
    loading: options.loading,
    ssr: options.ssr !== false // Default to SSR enabled unless explicitly disabled
  })
}

// Performance monitoring
export const logPerformanceMetrics = (componentName: string, loadTime: number) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${componentName} loaded in ${loadTime}ms`)
  }
}
