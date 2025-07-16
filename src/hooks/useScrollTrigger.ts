'use client'

import { useEffect, useRef, useCallback, DependencyList } from 'react'
import { useGSAP } from '../contexts/GSAPContext'

interface ScrollTriggerOptions {
  trigger?: HTMLElement | string | null
  start?: string
  end?: string
  toggleActions?: string
  scrub?: boolean | number
  pin?: boolean | string | HTMLElement
  markers?: boolean
  id?: string
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
  onUpdate?: (self: any) => void
  onRefresh?: () => void
  onRefreshInit?: () => void
  [key: string]: any
}

interface UseScrollTriggerReturn {
  triggerRef: React.RefObject<HTMLElement | null>
  scrollTrigger: React.RefObject<any | null>
  createScrollTrigger: (options?: ScrollTriggerOptions) => any
  kill: () => void
  refresh: () => void
  enable: () => void
  disable: () => void
}

/**
 * Custom hook for handling GSAP ScrollTrigger animations
 */
export default function useScrollTrigger(
  options: ScrollTriggerOptions = {},
  deps: DependencyList = []
): UseScrollTriggerReturn {
  const { gsap, isReady } = useGSAP()
  const triggerRef = useRef<HTMLElement>(null)
  const scrollTriggerRef = useRef<any>(null)

  // Create ScrollTrigger
  const createScrollTrigger = useCallback((scrollTriggerOptions: ScrollTriggerOptions = {}) => {
    if (!isReady || !triggerRef.current) return null

    // Kill existing ScrollTrigger
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    const mergedOptions = { ...options, ...scrollTriggerOptions }
    
    const scrollTrigger = gsap.to(triggerRef.current, {
      scrollTrigger: {
        trigger: triggerRef.current,
        ...mergedOptions
      }
    })

    scrollTriggerRef.current = scrollTrigger.scrollTrigger
    return scrollTrigger.scrollTrigger
  }, [isReady, gsap, options])

  // Kill ScrollTrigger
  const kill = useCallback(() => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }
  }, [])

  // Refresh ScrollTrigger
  const refresh = useCallback(() => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.refresh()
    }
  }, [])

  // Enable ScrollTrigger
  const enable = useCallback(() => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.enable()
    }
  }, [])

  // Disable ScrollTrigger
  const disable = useCallback(() => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.disable()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      kill()
    }
  }, [kill])

  // Recreate ScrollTrigger when dependencies change
  useEffect(() => {
    if (isReady) {
      createScrollTrigger()
    }
  }, [isReady, createScrollTrigger, ...deps])

  return {
    triggerRef,
    scrollTrigger: scrollTriggerRef,
    createScrollTrigger,
    kill,
    refresh,
    enable,
    disable
  }
}