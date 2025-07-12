'use client'

import { useMemo } from 'react'
import { GalleryConfig, AnimationEffects } from '../types'
import useGSAPLazy from './useGSAPLazy'

interface UseConditionalAnimationReturn {
  shouldAnimate: boolean;
  isAnimationReady: boolean;
  isLoadingAnimation: boolean;
  animationError: string | null;
  gsapInstance: any;
  createAnimation: any;
  killAnimations: () => void;
}

/**
 * Hook that conditionally loads GSAP based on gallery animation requirements
 * Avoids loading GSAP for galleries that don't need animations
 */
export default function useConditionalAnimation(
  gallery: GalleryConfig
): UseConditionalAnimationReturn {
  
  // Determine if this gallery needs animations
  const shouldAnimate = useMemo(() => {
    if (!gallery.animation) return false;
    
    const { effect, duration } = gallery.animation;
    
    // Skip GSAP for galleries with no animation or very simple effects
    if (!effect || !duration || duration === 0) return false;
    
    // Check if effect is essentially 'none' (even though types don't overlap)
    const effectStr = String(effect);
    if (effectStr === 'none') return false;
    
    // For carousel/fullscreen layouts, only animate if explicitly configured
    if (gallery.layout === 'carousel' || gallery.layout === 'fullscreen') {
      return Boolean(effect && effectStr !== 'none' && duration && duration > 0);
    }
    
    return true;
  }, [gallery.animation, gallery.layout]);

  // Only load GSAP if animations are needed
  const {
    isLoaded: isAnimationReady,
    isLoading: isLoadingAnimation,
    error: animationError,
    gsapInstance,
    createAnimation,
    killAnimations
  } = useGSAPLazy(shouldAnimate);

  return {
    shouldAnimate,
    isAnimationReady,
    isLoadingAnimation,
    animationError,
    gsapInstance,
    createAnimation,
    killAnimations
  };
}
