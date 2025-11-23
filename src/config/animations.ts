/**
 * Animation configuration constants
 * Centralized values for consistent animations across the app
 */

export const ANIMATIONS = {
  /** Sticky scroll text animation config */
  stickyText: {
    slideDuration: 0.6, // seconds
    textHeight: 100, // pixels (approximate h2 height)
    topPadding: 32, // 2rem in pixels (Tailwind: p-8)
    bottomPadding: 32, // 2rem in pixels
    easing: [0.4, 0, 0.2, 1] as const, // cubic-bezier for smooth entrance
  },

  /** Hero section animations */
  hero: {
    fadeIn: {
      duration: 1,
      ease: 'easeOut' as const,
    },
    fadeInWithDelay: {
      duration: 1,
      delay: 0.3,
    },
    fadeInDelayed: {
      duration: 1,
      delay: 0.6,
    },
    pulse: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },

  /** Gallery animations */
  gallery: {
    fadeIn: {
      duration: 0.8,
      ease: 'easeOut' as const,
    },
    staggered: {
      duration: 0.6,
      ease: 'easeOut' as const,
      delays: [0.1, 0.2, 0.3, 0.4] as const,
    },
  },

  /** Navigation animations */
  nav: {
    fadeIn: {
      duration: 0.4,
    },
    staggerDelay: 0.1,
  },

  /** Mobile menu */
  mobileMenu: {
    animationDuration: 5,
  },
} as const;
