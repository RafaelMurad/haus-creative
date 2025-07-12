/**
 * Performance Monitoring Hook - Updated for Web Vitals
 * Phase 3.1 Chunk 2: React integration for Web Vitals monitoring
 */

import { useEffect, useState, useCallback } from 'react'
import { initializePerformanceMonitoring, getPerformanceMonitor, PerformanceMetric } from '../utils/webVitalsMonitoring'

interface PerformanceHookReturn {
  performanceScore: number
  metrics: PerformanceMetric[]
  isMonitoring: boolean
  startMonitoring: () => void
  stopMonitoring: () => void
  clearMetrics: () => void
  exportMetrics: () => string
}

export const usePerformanceMonitoring = (): PerformanceHookReturn => {
  const [performanceScore, setPerformanceScore] = useState<number>(0)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false)

  // Initialize performance monitoring on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializePerformanceMonitoring()
      setIsMonitoring(true)
    }

    // Cleanup is handled automatically by web-vitals
    return () => {
      setIsMonitoring(false)
    }
  }, [])

  // Update metrics and score periodically
  useEffect(() => {
    if (!isMonitoring) return

    const updateMetrics = () => {
      const monitor = getPerformanceMonitor()
      if (monitor) {
        const currentMetrics = monitor.getMetrics()
        const currentScore = monitor.getPerformanceScore()
        
        setMetrics(currentMetrics)
        setPerformanceScore(currentScore)
      }
    }

    // Update immediately
    updateMetrics()

    // Set up periodic updates every 2 seconds (more frequent for development)
    const interval = setInterval(updateMetrics, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const startMonitoring = useCallback(() => {
    if (typeof window !== 'undefined') {
      initializePerformanceMonitoring()
      setIsMonitoring(true)
    }
  }, [])

  const stopMonitoring = useCallback(() => {
    // Web vitals monitoring stops automatically
    setIsMonitoring(false)
  }, [])

  const clearMetrics = useCallback(() => {
    const monitor = getPerformanceMonitor()
    if (monitor) {
      monitor.clearMetrics()
      setMetrics([])
      setPerformanceScore(0)
    }
  }, [])

  const exportMetrics = useCallback((): string => {
    const monitor = getPerformanceMonitor()
    return monitor ? monitor.exportMetrics() : '[]'
  }, [])

  return {
    performanceScore,
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearMetrics,
    exportMetrics,
  }
}

// Hook for tracking custom performance events
export const usePerformanceEvent = () => {
  const trackEvent = useCallback((eventName: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      if (duration !== undefined) {
        // Dispatch custom event with duration
        window.dispatchEvent(new CustomEvent(`performance:${eventName}`, {
          detail: { duration }
        }))
      } else {
        // Mark start/end events
        performance.mark(`${eventName}-start`)
        
        return () => {
          performance.mark(`${eventName}-end`)
          performance.measure(`${eventName}-duration`, `${eventName}-start`, `${eventName}-end`)
          
          const measure = performance.getEntriesByName(`${eventName}-duration`)[0]
          window.dispatchEvent(new CustomEvent(`performance:${eventName}`, {
            detail: { duration: measure.duration }
          }))
        }
      }
    }
  }, [])

  return { trackEvent }
}

// Hook for monitoring component render performance
export const useRenderPerformance = (componentName: string) => {
  const [renderTime, setRenderTime] = useState<number>(0)
  const [renderCount, setRenderCount] = useState<number>(0)

  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      setRenderTime(duration)
      setRenderCount(prev => prev + 1)
      
      // Track in performance monitoring
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('performance:componentRender', {
          detail: { 
            componentName, 
            duration,
            renderCount: renderCount + 1
          }
        }))
      }
    }
  })

  return { renderTime, renderCount }
}

// Hook for monitoring gallery-specific performance
export const useGalleryPerformance = () => {
  const [galleryMetrics, setGalleryMetrics] = useState({
    imagesLoaded: 0,
    averageLoadTime: 0,
    totalLoadTime: 0,
    gsapLoadTime: 0,
  })

  const trackImageLoad = useCallback((loadTime: number) => {
    setGalleryMetrics(prev => ({
      ...prev,
      imagesLoaded: prev.imagesLoaded + 1,
      totalLoadTime: prev.totalLoadTime + loadTime,
      averageLoadTime: (prev.totalLoadTime + loadTime) / (prev.imagesLoaded + 1),
    }))
  }, [])

  const trackGSAPLoad = useCallback((loadTime: number) => {
    setGalleryMetrics(prev => ({
      ...prev,
      gsapLoadTime: loadTime,
    }))

    // Dispatch GSAP performance event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performance:gsapLoad', {
        detail: { duration: loadTime }
      }))
    }
  }, [])

  const trackGalleryReady = useCallback(() => {
    // Dispatch gallery ready event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gallery:initEnd'))
    }
  }, [])

  return {
    galleryMetrics,
    trackImageLoad,
    trackGSAPLoad,
    trackGalleryReady,
  }
}
