'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimationEffectType, EaseFunctionType } from '../types'

interface GSAPInstance {
  gsap: any;
  ScrollTrigger: any;
}

interface AnimationOptions {
  effect?: AnimationEffectType;
  duration?: number;
  ease?: EaseFunctionType;
  delay?: number;
  stagger?: number;
  from?: Record<string, any>;
  to?: Record<string, any>;
  scrollTrigger?: Record<string, any>;
}

interface UseGSAPLazyReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  gsapInstance: GSAPInstance | null;
  createAnimation: (
    element: HTMLElement | HTMLElement[],
    fromProps: Record<string, any>,
    toProps: Record<string, any>
  ) => Promise<any>;
  killAnimations: () => void;
}

/**
 * Custom hook for lazy loading GSAP and managing animations
 * Only loads GSAP when animations are actually needed
 */
export default function useGSAPLazy(shouldLoad: boolean = true): UseGSAPLazyReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gsapInstance, setGsapInstance] = useState<GSAPInstance | null>(null);
  const animationsRef = useRef<any[]>([]);

  // Load GSAP dynamically
  useEffect(() => {
    if (!shouldLoad || isLoaded || isLoading) return;

    const loadGSAP = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamic imports for GSAP
        const [gsapModule, scrollTriggerModule] = await Promise.all([
          import('gsap'),
          import('gsap/dist/ScrollTrigger')
        ]);

        const gsap = gsapModule.gsap || gsapModule.default;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;

        // Register ScrollTrigger plugin
        if (typeof window !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);
        }

        const instance: GSAPInstance = {
          gsap,
          ScrollTrigger
        };

        setGsapInstance(instance);
        setIsLoaded(true);

        console.log('GSAP loaded successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load GSAP';
        setError(errorMessage);
        console.error('Error loading GSAP:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGSAP();
  }, [shouldLoad, isLoaded, isLoading]);

  // Create animation with loaded GSAP instance
  const createAnimation = useCallback(async (
    element: HTMLElement | HTMLElement[],
    fromProps: Record<string, any>,
    toProps: Record<string, any>
  ) => {
    if (!gsapInstance) {
      throw new Error('GSAP not loaded yet');
    }

    const animation = gsapInstance.gsap.fromTo(element, fromProps, toProps);
    animationsRef.current.push(animation);
    return animation;
  }, [gsapInstance]);

  // Kill all animations
  const killAnimations = useCallback(() => {
    animationsRef.current.forEach(animation => {
      if (animation && typeof animation.kill === 'function') {
        animation.kill();
      }
    });
    animationsRef.current = [];

    // Also kill ScrollTrigger instances
    if (gsapInstance?.ScrollTrigger) {
      gsapInstance.ScrollTrigger.killAll();
    }
  }, [gsapInstance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      killAnimations();
    };
  }, [killAnimations]);

  return {
    isLoaded,
    isLoading,
    error,
    gsapInstance,
    createAnimation,
    killAnimations
  };
}
