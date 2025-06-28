'use client'

import { useEffect, useRef, DependencyList, useCallback } from 'react'

// Lazy load GSAP only when needed
let gsapInstance: any = null;
let ScrollTriggerInstance: any = null;

const loadGSAP = async () => {
  if (!gsapInstance) {
    const gsapModule = await import('gsap');
    gsapInstance = gsapModule.gsap || gsapModule.default || gsapModule;
    
    if (typeof window !== 'undefined') {
      const ScrollTriggerModule = await import('gsap/dist/ScrollTrigger');
      ScrollTriggerInstance = ScrollTriggerModule.ScrollTrigger;
      gsapInstance.registerPlugin(ScrollTriggerInstance);
    }
  }
  return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };
};

// Define GSAP-specific types to match their API
type DOMTarget = any;

interface ScrollTriggerOptions {
    trigger?: HTMLElement | string | null;
    start?: string;
    end?: string;
    toggleActions?: string;
    scrub?: boolean | number;
    pin?: boolean | string | HTMLElement;
    markers?: boolean;
    id?: string;
    [key: string]: any;
}

import { AnimationEffectType, EaseFunctionType } from '../types';

interface AnimationOptions {
    effect?: AnimationEffectType;
    duration?: number;
    ease?: EaseFunctionType;
    delay?: number;
    stagger?: number;
    from?: Record<string, any>;
    to?: Record<string, any>;
    scrollTrigger?: ScrollTriggerOptions;
}

interface UseGsapAnimationReturn {
    elementRef: React.RefObject<HTMLElement | null>;
    elementsRef: {
        current: (HTMLElement | null)[];
    };
    playAnimation: (customOptions?: Partial<AnimationOptions>) => Promise<any>;
}

/**
 * Optimized GSAP animation hook with lazy loading and proper cleanup
 */
export default function useGsapAnimation(
    options: AnimationOptions,
    deps: DependencyList = []
): UseGsapAnimationReturn {
    const elementRef = useRef<HTMLElement>(null)
    const elementsRef = useRef<(HTMLElement | null)[]>([])
    const animationsRef = useRef<any[]>([])
    const isLoadingRef = useRef(false)

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
            toggleActions: 'play none none none'
        }
    }

    // Merge default options with provided options
    const animationOptions = { ...defaultOptions, ...options }

    // Effect-specific presets
    const getEffectPreset = useCallback((effect: string): { from: Record<string, any>; to: Record<string, any> } => {
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
    }, [animationOptions.from, animationOptions.to])

    // Cleanup function
    const cleanup = useCallback(() => {
        animationsRef.current.forEach(animation => {
            if (animation && typeof animation.kill === 'function') {
                if (animation.scrollTrigger && typeof animation.scrollTrigger.kill === 'function') {
                    animation.scrollTrigger.kill()
                }
                animation.kill()
            }
        })
        animationsRef.current = []
    }, [])

    // Set up the animation with lazy loading
    useEffect(() => {
        if (typeof window === 'undefined' || isLoadingRef.current) return

        const initializeAnimations = async () => {
            isLoadingRef.current = true
            
            try {
                const { gsap } = await loadGSAP()
                
                // Combine effect preset with custom options
                const effectPreset = getEffectPreset(animationOptions.effect || 'fade')
                const finalFrom = { ...effectPreset.from, ...animationOptions.from }
                const finalTo = { ...effectPreset.to, ...animationOptions.to }

                // For single element animation
                if (elementRef.current && elementRef.current instanceof Element) {
                    const animation = gsap.fromTo(
                        elementRef.current,
                        finalFrom,
                        {
                            ...finalTo,
                            duration: animationOptions.duration,
                            ease: animationOptions.ease,
                            scrollTrigger: {
                                trigger: elementRef.current,
                                ...animationOptions.scrollTrigger
                            }
                        }
                    )
                    animationsRef.current.push(animation)
                }

                // For multiple elements animation (with stagger)
                if (elementsRef.current.length > 0) {
                    const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element)

                    if (elements.length > 0) {
                        const triggerElement = elements[0]
                        const animation = gsap.fromTo(
                            elements,
                            finalFrom,
                            {
                                ...finalTo,
                                duration: animationOptions.duration,
                                ease: animationOptions.ease,
                                stagger: animationOptions.stagger,
                                scrollTrigger: {
                                    trigger: triggerElement,
                                    ...animationOptions.scrollTrigger
                                }
                            }
                        )
                        animationsRef.current.push(animation)
                    }
                }
            } catch (error) {
                console.warn('Failed to load GSAP:', error)
            } finally {
                isLoadingRef.current = false
            }
        }

        initializeAnimations()

        return cleanup
    }, deps)

    // Cleanup on unmount
    useEffect(() => {
        return cleanup
    }, [cleanup])

    // Helper function to manually trigger animations
    const playAnimation = useCallback(async (customOptions: Partial<AnimationOptions> = {}): Promise<any> => {
        if (typeof window === 'undefined') return undefined

        try {
            const { gsap } = await loadGSAP()
            const mergedOptions = { ...animationOptions, ...customOptions }
            const effectPreset = getEffectPreset(mergedOptions.effect || 'fade')
            const finalFrom = { ...effectPreset.from, ...customOptions.from }
            const finalTo = { ...effectPreset.to, ...customOptions.to }

            if (elementRef.current && elementRef.current instanceof Element) {
                return gsap.fromTo(
                    elementRef.current,
                    finalFrom,
                    {
                        ...finalTo,
                        duration: mergedOptions.duration,
                        ease: mergedOptions.ease
                    }
                )
            }

            if (elementsRef.current.length > 0) {
                const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element)

                if (elements.length > 0) {
                    return gsap.fromTo(
                        elements,
                        finalFrom,
                        {
                            ...finalTo,
                            duration: mergedOptions.duration,
                            ease: mergedOptions.ease,
                            stagger: mergedOptions.stagger
                        }
                    )
                }
            }

            return undefined
        } catch (error) {
            console.warn('Failed to play animation:', error)
            return undefined
        }
    }, [animationOptions, getEffectPreset])

    return {
        elementRef,
        elementsRef,
        playAnimation
    }
}