import { AnimationConfig, AnimationEffectType } from '../types';

type AnimationPresets = {
    [key: string]: Omit<AnimationConfig, 'effect'>;
};

export const animationPresets: AnimationPresets = {
    none: {
        duration: 0,
        ease: 'none'
    },
    fade: {
        duration: 0.8,
        ease: 'power2.inOut',
        crossfade: {
            from: { opacity: 0 },
            to: { opacity: 1 },
            prevOut: { opacity: 0 }
        }
    },
    slide: {
        duration: 0.8,
        ease: 'power2.inOut'
    },
    'slide-up': {
        duration: 0.9,
        ease: 'power3.out',
        from: { opacity: 0, y: 100 },
        to: { opacity: 1, y: 0 }
    },
    'slide-down': {
        duration: 0.9,
        ease: 'power3.out',
        from: { opacity: 0, y: -100 },
        to: { opacity: 1, y: 0 }
    },
    scale: {
        duration: 0.8,
        ease: 'power2.out',
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 }
    }
};

export function getAnimationConfig(effect: string): AnimationConfig {
    const validEffect = (effect in animationPresets) ? effect as AnimationEffectType : 'none';
    const preset = animationPresets[validEffect];
    return {
        effect: validEffect,
        ...preset
    };
}