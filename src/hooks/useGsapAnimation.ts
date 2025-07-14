'use client'


import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register plugins once
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
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
    deps: any[] = []
): UseGsapAnimationReturn {
    const elementRef = useRef<HTMLElement>(null);
    const elementsRef = useRef<(HTMLElement | null)[]>([]);

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
            toggleActions: 'play none none none',
        },
    };

    // Merge default options with provided options
    const animationOptions = { ...defaultOptions, ...options };

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
    const effectPreset = getEffectPreset(animationOptions.effect || 'fade');
    const finalFrom = { ...effectPreset.from, ...animationOptions.from };
    const finalTo = { ...effectPreset.to, ...animationOptions.to };

    // useGSAP for single element
    useGSAP(() => {
        if (elementRef.current) {
            gsap.fromTo(
                elementRef.current,
                finalFrom,
                {
                    ...finalTo,
                    duration: animationOptions.duration,
                    ease: animationOptions.ease,
                    scrollTrigger: {
                        trigger: elementRef.current,
                        ...animationOptions.scrollTrigger,
                    },
                }
            );
        }
    }, { dependencies: deps, scope: elementRef });

    // useGSAP for multiple elements (stagger)
    useGSAP(() => {
        if (elementsRef.current.length > 0) {
            const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element);
            if (elements.length === 0) return;
            const triggerElement = elements[0];
            gsap.fromTo(
                elements,
                finalFrom,
                {
                    ...finalTo,
                    duration: animationOptions.duration,
                    ease: animationOptions.ease,
                    stagger: animationOptions.stagger,
                    scrollTrigger: {
                        trigger: triggerElement,
                        ...animationOptions.scrollTrigger,
                    },
                }
            );
        }
    }, { dependencies: deps, scope: elementsRef });

    // Helper function to manually trigger animations (contextSafe can be added here if needed)
    const playAnimation = (customOptions: Partial<AnimationOptions> = {}): gsap.core.Tween | undefined => {
        if (typeof window === 'undefined') return undefined;
        const mergedOptions = { ...animationOptions, ...customOptions };
        if (elementRef.current) {
            if (elementRef.current instanceof Element) {
                return gsap.fromTo(
                    elementRef.current,
                    { ...finalFrom, ...customOptions.from },
                    {
                        ...finalTo,
                        ...customOptions.to,
                        duration: mergedOptions.duration,
                        ease: mergedOptions.ease,
                    }
                );
            }
            return undefined;
        }
        if (elementsRef.current.length > 0) {
            const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element);
            if (elements.length === 0) return undefined;
            return gsap.fromTo(
                elements,
                { ...finalFrom, ...customOptions.from },
                {
                    ...finalTo,
                    ...customOptions.to,
                    duration: mergedOptions.duration,
                    ease: mergedOptions.ease,
                    stagger: mergedOptions.stagger,
                }
            );
        }
        return undefined;
    };

    return {
        elementRef,
        elementsRef,
        playAnimation,
    };
}