/**
 * Network-aware Loading Hook
 * Phase 3.2 Chunk 2: React integration for adaptive resource loading
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  getNetworkAwareLoader, 
  NetworkInfo, 
  LoadingStrategy, 
  ResourcePriority 
} from '../utils/networkAwareLoader'

interface NetworkAwareHookReturn {
  networkInfo: NetworkInfo | null
  loadingStrategy: LoadingStrategy
  shouldLoadResource: (priority: ResourcePriority) => boolean
  getOptimalImageQuality: () => 'high' | 'medium' | 'low'
  getOptimalBundleStrategy: () => 'preload' | 'lazy' | 'minimal'
  isSlowConnection: boolean
  isSaveDataEnabled: boolean
}

export const useNetworkAware = (): NetworkAwareHookReturn => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null)
  const [loadingStrategy, setLoadingStrategy] = useState<LoadingStrategy>(LoadingStrategy.MODERATE)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loader = getNetworkAwareLoader()
    
    // Get initial values
    setNetworkInfo(loader.getNetworkInfo())
    setLoadingStrategy(loader.getLoadingStrategy())

    // Subscribe to strategy changes
    const unsubscribe = loader.onStrategyChange(() => {
      setNetworkInfo(loader.getNetworkInfo())
      setLoadingStrategy(loader.getLoadingStrategy())
    })

    return unsubscribe
  }, [])

  const shouldLoadResource = useCallback((priority: ResourcePriority): boolean => {
    if (typeof window === 'undefined') return true
    
    const loader = getNetworkAwareLoader()
    return loader.shouldLoadResource(priority)
  }, [])

  const getOptimalImageQuality = useCallback((): 'high' | 'medium' | 'low' => {
    if (typeof window === 'undefined') return 'medium'
    
    const loader = getNetworkAwareLoader()
    return loader.getOptimalImageQuality()
  }, [])

  const getOptimalBundleStrategy = useCallback((): 'preload' | 'lazy' | 'minimal' => {
    if (typeof window === 'undefined') return 'lazy'
    
    const loader = getNetworkAwareLoader()
    return loader.getOptimalBundleStrategy()
  }, [])

  // Derived values for convenience
  const isSlowConnection = networkInfo ? 
    (networkInfo.effectiveType === '2g' || networkInfo.effectiveType === 'slow-2g' || networkInfo.downlink < 1) : 
    false

  const isSaveDataEnabled = networkInfo?.saveData || false

  return {
    networkInfo,
    loadingStrategy,
    shouldLoadResource,
    getOptimalImageQuality,
    getOptimalBundleStrategy,
    isSlowConnection,
    isSaveDataEnabled
  }
}

// Hook for adaptive image loading
export const useAdaptiveImageLoading = () => {
  const { getOptimalImageQuality, shouldLoadResource } = useNetworkAware()

  const getImageProps = useCallback((priority: ResourcePriority = ResourcePriority.MEDIUM) => {
    const quality = getOptimalImageQuality()
    const shouldLoad = shouldLoadResource(priority)

    return {
      quality,
      shouldLoad,
      loading: shouldLoad ? 'eager' as const : 'lazy' as const,
      priority: priority === ResourcePriority.CRITICAL
    }
  }, [getOptimalImageQuality, shouldLoadResource])

  return { getImageProps }
}

// Hook for adaptive component loading
export const useAdaptiveComponentLoading = () => {
  const { getOptimalBundleStrategy, shouldLoadResource } = useNetworkAware()

  const shouldPreloadComponent = useCallback((priority: ResourcePriority = ResourcePriority.MEDIUM): boolean => {
    const strategy = getOptimalBundleStrategy()
    const shouldLoad = shouldLoadResource(priority)

    return strategy === 'preload' && shouldLoad
  }, [getOptimalBundleStrategy, shouldLoadResource])

  const getComponentLoadingStrategy = useCallback((priority: ResourcePriority = ResourcePriority.MEDIUM) => {
    const bundleStrategy = getOptimalBundleStrategy()
    const shouldLoad = shouldLoadResource(priority)

    if (!shouldLoad && priority !== ResourcePriority.CRITICAL) {
      return 'disabled'
    }

    return bundleStrategy
  }, [getOptimalBundleStrategy, shouldLoadResource])

  return {
    shouldPreloadComponent,
    getComponentLoadingStrategy
  }
}

// Hook for network-aware GSAP loading
export const useAdaptiveGSAPLoading = () => {
  const { loadingStrategy, shouldLoadResource } = useNetworkAware()
  const [gsapLoadingRecommendation, setGsapLoadingRecommendation] = useState<{
    shouldLoadGSAP: boolean
    loadingPriority: ResourcePriority
    delayLoading: boolean
  }>({
    shouldLoadGSAP: true,
    loadingPriority: ResourcePriority.MEDIUM,
    delayLoading: false
  })

  useEffect(() => {
    const recommendation = {
      shouldLoadGSAP: shouldLoadResource(ResourcePriority.MEDIUM),
      loadingPriority: ResourcePriority.MEDIUM,
      delayLoading: false
    }

    switch (loadingStrategy) {
      case LoadingStrategy.AGGRESSIVE:
        recommendation.shouldLoadGSAP = true
        recommendation.loadingPriority = ResourcePriority.HIGH
        break

      case LoadingStrategy.MODERATE:
        recommendation.shouldLoadGSAP = true
        recommendation.loadingPriority = ResourcePriority.MEDIUM
        recommendation.delayLoading = true // Wait for user interaction
        break

      case LoadingStrategy.CONSERVATIVE:
        recommendation.shouldLoadGSAP = false // Load only on demand
        recommendation.loadingPriority = ResourcePriority.LOW
        recommendation.delayLoading = true
        break

      case LoadingStrategy.MINIMAL:
        recommendation.shouldLoadGSAP = false
        recommendation.loadingPriority = ResourcePriority.LOW
        recommendation.delayLoading = true
        break
    }

    setGsapLoadingRecommendation(recommendation)
  }, [loadingStrategy, shouldLoadResource])

  return gsapLoadingRecommendation
}
