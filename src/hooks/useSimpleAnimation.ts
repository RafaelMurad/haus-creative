"use client";

import { useEffect, useRef, useCallback } from 'react';

interface UseSimpleAnimationOptions {
    trigger?: 'load' | 'scroll' | 'hover';
    animationType?: 'fade' | 'slideUp' | 'scale';
    duration?: number; // in seconds
    delay?: number; // in seconds
    easing?: string;
}

interface UseSimpleAnimationReturn {
    ref: React.RefObject<HTMLElement | null>;
    animate: () => void;
}

/**
 * Simple animation hook using CSS transitions
 * Replaces the complex GSAP implementation with simple, performant CSS
 */
export function useSimpleAnimation(
    options: UseSimpleAnimationOptions = {}
): UseSimpleAnimationReturn {
    const {
        trigger = 'scroll',
        animationType = 'fade',
        duration = 0.6,
        delay = 0,
        easing = 'ease-out'
    } = options;

    const elementRef = useRef<HTMLElement>(null);

    const animate = useCallback(() => {
        if (!elementRef.current) return;

        const element = elementRef.current;

        // Apply animation styles
        element.style.transition = `all ${duration}s ${easing}`;
        if (delay > 0) {
            element.style.transitionDelay = `${delay}s`;
        }

        switch (animationType) {
            case 'fade':
                element.style.opacity = '1';
                break;
            case 'slideUp':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'scale':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
        }
    }, [animationType, duration, delay, easing]);

    const reset = useCallback(() => {
        if (!elementRef.current) return;

        const element = elementRef.current;

        switch (animationType) {
            case 'fade':
                element.style.opacity = '0';
                break;
            case 'slideUp':
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                break;
            case 'scale':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.95)';
                break;
        }
    }, [animationType]);

    useEffect(() => {
        if (!elementRef.current) return;

        const element = elementRef.current;

        // Set initial state
        reset();

        if (trigger === 'load') {
            // Animate immediately
            requestAnimationFrame(animate);
        } else if (trigger === 'scroll') {
            // Use Intersection Observer for scroll-triggered animations
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animate();
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -10% 0px'
                }
            );

            observer.observe(element);

            return () => observer.disconnect();
        } else if (trigger === 'hover') {
            const handleMouseEnter = () => animate();
            const handleMouseLeave = () => reset();

            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                element.removeEventListener('mouseenter', handleMouseEnter);
                element.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, [trigger, animate, reset]);

    return {
        ref: elementRef,
        animate
    };
}
