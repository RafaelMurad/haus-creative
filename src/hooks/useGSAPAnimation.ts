'use client'

import { useRef, useCallback, DependencyList, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { AnimationEffectType, EaseFunctionType } from '../types'

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

interface AnimationOptions {
  effect?: AnimationEffectType
  duration?: number
  ease?: EaseFunctionType
  delay?: number
  stagger?: number
  from?: Record<string, any>
  to?: Record<string, any>
  scrollTrigger?: ScrollTriggerOptions
  onComplete?: () => void
  onStart?: () => void
  onUpdate?: () => void
}

interface UseGSAPAnimationReturn {
  elementRef: React.RefObject<HTMLElement | null>
  elementsRef: React.RefObject<(HTMLElement | null)[]>
  playAnimation: (customOptions?: Partial<AnimationOptions>) => gsap.core.Tween | undefined
  killAnimation: () => void
  isAnimating: boolean
}

/**
 * Custom hook for handling GSAP animations using the official useGSAP hook
 */
export default function useGSAPAnimation(
  options: AnimationOptions,
  deps: DependencyList = []
): UseGSAPAnimationReturn {
  const elementRef = useRef<HTMLElement | null>(null)
  const elementsRef = useRef<(HTMLElement | null)[]>([])
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Default animation options
  const defaultOptions: AnimationOptions = {
    effect: 'fade',
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.15,
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    scrollTrigger: {
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  }

  // Merge default options with provided options
  const animationOptions = { ...defaultOptions, ...options }

  // Effect-specific presets
  const getEffectPreset = (effect: string): { from: Record<string, any>; to: Record<string, any> } => {
    switch (effect) {
      case 'fade':
        return {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      case 'slide-up':
        return {
          from: { opacity: 0, y: 50 },
          to: { opacity: 1, y: 0 }
        }
      case 'slide-down':
        return {
          from: { opacity: 0, y: -50 },
          to: { opacity: 1, y: 0 }
        }
      case 'slide-left':
        return {
          from: { opacity: 0, x: 50 },
          to: { opacity: 1, x: 0 }
        }
      case 'slide-right':
        return {
          from: { opacity: 0, x: -50 },
          to: { opacity: 1, x: 0 }
        }
      case 'scale':
        return {
          from: { opacity: 0, scale: 0.9 },
          to: { opacity: 1, scale: 1 }
        }
      case 'clip-reveal':
        return {
          from: { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', opacity: 1 },
          to: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1 }
        }
      default:
        return {
          from: animationOptions.from || {},
          to: animationOptions.to || {}
        }
    }
  }

  // Combine effect preset with custom options
  const effectPreset = getEffectPreset(animationOptions.effect || 'fade')
  const finalFrom = { ...effectPreset.from, ...animationOptions.from }
  const finalTo = { ...effectPreset.to, ...animationOptions.to }

  // Kill animation helper
  const killAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill()
      animationRef.current = null
    }
    setIsAnimating(false)
  }, [])

  // Use the official useGSAP hook
  useGSAP(() => {
    // Kill any existing animation
    killAnimation()

    // For single element animation
    if (elementRef.current) {
      if (!(elementRef.current instanceof Element)) {
        return
      }

      const animation = gsap.fromTo(
        elementRef.current,
        finalFrom,
        {
          ...finalTo,
          duration: animationOptions.duration,
          ease: animationOptions.ease,
          delay: animationOptions.delay,
          onStart: () => {
            setIsAnimating(true)
            animationOptions.onStart?.()
          },
          onComplete: () => {
            setIsAnimating(false)
            animationOptions.onComplete?.()
          },
          onUpdate: animationOptions.onUpdate,
          scrollTrigger: {
            trigger: elementRef.current,
            ...animationOptions.scrollTrigger
          }
        }
      )

      animationRef.current = animation
    }

    // For multiple elements animation (with stagger)
    if (elementsRef.current.length > 0) {
      const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element)

      if (elements.length === 0) return

      const triggerElement = elements[0]
      const animation = gsap.fromTo(
        elements,
        finalFrom,
        {
          ...finalTo,
          duration: animationOptions.duration,
          ease: animationOptions.ease,
          stagger: animationOptions.stagger,
          delay: animationOptions.delay,
          onStart: () => {
            setIsAnimating(true)
            animationOptions.onStart?.()
          },
          onComplete: () => {
            setIsAnimating(false)
            animationOptions.onComplete?.()
          },
          onUpdate: animationOptions.onUpdate,
          scrollTrigger: {
            trigger: triggerElement,
            ...animationOptions.scrollTrigger
          }
        }
      )

      animationRef.current = animation
    }
  }, deps)

  // Helper function to manually trigger animations
  const playAnimation = useCallback((customOptions: Partial<AnimationOptions> = {}): gsap.core.Tween | undefined => {
    // Kill existing animation
    killAnimation()

    const mergedOptions = { ...animationOptions, ...customOptions }
    const customEffectPreset = getEffectPreset(mergedOptions.effect || 'fade')
    const customFrom = { ...customEffectPreset.from, ...mergedOptions.from }
    const customTo = { ...customEffectPreset.to, ...mergedOptions.to }

    if (elementRef.current) {
      if (elementRef.current instanceof Element) {
        const animation = gsap.fromTo(
          elementRef.current,
          customFrom,
          {
            ...customTo,
            duration: mergedOptions.duration,
            ease: mergedOptions.ease,
            delay: mergedOptions.delay,
            onStart: () => {
              setIsAnimating(true)
              mergedOptions.onStart?.()
            },
            onComplete: () => {
              setIsAnimating(false)
              mergedOptions.onComplete?.()
            },
            onUpdate: mergedOptions.onUpdate
          }
        )
        animationRef.current = animation
        return animation
      }
      return undefined
    }

    if (elementsRef.current.length > 0) {
      const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element)

      if (elements.length === 0) return undefined

      const animation = gsap.fromTo(
        elements,
        customFrom,
        {
          ...customTo,
          duration: mergedOptions.duration,
          ease: mergedOptions.ease,
          stagger: mergedOptions.stagger,
          delay: mergedOptions.delay,
          onStart: () => {
            setIsAnimating(true)
            mergedOptions.onStart?.()
          },
          onComplete: () => {
            setIsAnimating(false)
            mergedOptions.onComplete?.()
          },
          onUpdate: mergedOptions.onUpdate
        }
      )
      animationRef.current = animation
      return animation
    }

    return undefined
  }, [killAnimation, animationOptions])

  return {
    elementRef,
    elementsRef,
    playAnimation,
    killAnimation,
    isAnimating
  }
}