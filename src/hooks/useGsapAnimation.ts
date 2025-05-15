'use client'

import { useEffect, useRef, DependencyList } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

// Define GSAP-specific types to match their API
type DOMTarget = gsap.DOMTarget;

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

interface AnimationOptions {
    effect?: string;
    duration?: number;
    ease?: string;
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
    playAnimation: (customOptions?: Partial<AnimationOptions>) => gsap.core.Tween | undefined;
}

/**
 * Custom hook for handling GSAP animations with ScrollTrigger
 * 
 * @param options - Animation options
 * @param deps - Dependencies for useEffect
 * @returns - References and animation controller
 */
export default function useGsapAnimation(
    options: AnimationOptions,
    deps: DependencyList = []
): UseGsapAnimationReturn {
    const elementRef = useRef<HTMLElement>(null)
    const elementsRef = useRef<(HTMLElement | null)[]>([])

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

    // Set up the animation
    useEffect(() => {
        if (typeof window === 'undefined') return

        // For single element animation
        if (elementRef.current) {
            // Add check to ensure element is a valid DOM element with getBoundingClientRect
            if (!(elementRef.current instanceof Element)) {
                return undefined;
            }

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

            return () => {
                animation.kill()
                if (animation.scrollTrigger) {
                    animation.scrollTrigger.kill()
                }
            }
        }

        // For multiple elements animation (with stagger)
        if (elementsRef.current.length > 0) {
            // Filter out non-DOM elements before animation
            const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element)

            if (elements.length === 0) return undefined

            // Fix for the parentNode error - cast the element or use as trigger
            const triggerElement = elements[0];
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

            return () => {
                animation.kill()
                if (animation.scrollTrigger) {
                    animation.scrollTrigger.kill()
                }
            }
        }

        return undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    // Helper function to manually trigger animations
    const playAnimation = (customOptions: Partial<AnimationOptions> = {}): gsap.core.Tween | undefined => {
        if (typeof window === 'undefined') return undefined

        const mergedOptions = { ...animationOptions, ...customOptions }

        if (elementRef.current) {
            // Add check to ensure element is a valid DOM element with getBoundingClientRect
            if (elementRef.current instanceof Element) {
                return gsap.fromTo(
                    elementRef.current,
                    { ...finalFrom, ...customOptions.from },
                    {
                        ...finalTo,
                        ...customOptions.to,
                        duration: mergedOptions.duration,
                        ease: mergedOptions.ease
                    }
                )
            }
            return undefined
        }

        if (elementsRef.current.length > 0) {
            // Filter out non-DOM elements before animation
            const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element)

            if (elements.length === 0) return undefined

            return gsap.fromTo(
                elements,
                { ...finalFrom, ...customOptions.from },
                {
                    ...finalTo,
                    ...customOptions.to,
                    duration: mergedOptions.duration,
                    ease: mergedOptions.ease,
                    stagger: mergedOptions.stagger
                }
            )
        }

        return undefined
    }

    return {
        elementRef,
        elementsRef,
        playAnimation
    }
}