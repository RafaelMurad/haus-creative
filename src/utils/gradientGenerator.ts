/**
 * Gradient generation utilities for creating consistent animated gradients
 * across the application.
 */

export interface GradientConfig {
  /** Array of colour hex codes (minimum 2, recommended 4) */
  colours: readonly string[] | string[];
  /** Gradient direction in degrees (default: 135) */
  direction?: number;
  /** Background size for animation (default: '400% 400%') */
  backgroundSize?: string;
  /** Animation duration in seconds (default: 15) */
  animationDuration?: number;
  /** Animation timing function (default: 'ease') */
  animationTiming?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Generates a CSS linear gradient string from an array of colours
 *
 * @param colours - Array of hex colour codes
 * @param direction - Gradient direction in degrees (default: 135)
 * @returns CSS linear-gradient string
 *
 * @example
 * ```ts
 * const gradient = generateGradient(['#D4A574', '#E8B88A'], 90);
 * // Returns: 'linear-gradient(90deg, #D4A574, #E8B88A)'
 * ```
 */
export function generateGradient(
  colours: readonly string[] | string[],
  direction: number = 135
): string {
  if (colours.length < 2) {
    throw new Error('Gradient requires at least 2 colours');
  }

  return `linear-gradient(${direction}deg, ${colours.join(', ')})`;
}

/**
 * Generates a complete animated gradient style object for inline styles
 *
 * @param config - Gradient configuration object
 * @returns React CSSProperties object with gradient and animation
 *
 * @example
 * ```tsx
 * <div style={generateAnimatedGradientStyle({
 *   colours: ['#D4A574', '#E8B88A', '#C89968', '#B88A5E']
 * })} />
 * ```
 */
export function generateAnimatedGradientStyle(
  config: GradientConfig
): React.CSSProperties {
  const {
    colours,
    direction = 135,
    backgroundSize = '400% 400%',
    animationDuration = 15,
    animationTiming = 'ease',
  } = config;

  return {
    background: generateGradient(colours, direction),
    backgroundSize,
    animation: `gradientShift ${animationDuration}s ${animationTiming} infinite`,
  };
}

/**
 * Predefined gradient colour schemes
 */
export const gradientPresets = {
  /** Warm tan/peach gradient (current mobile menu) */
  warmTan: ['#D4A574', '#E8B88A', '#C89968', '#B88A5E'],

  /** Deep blue gradient (INK-inspired) */
  deepBlue: ['#1a3a52', '#2a5578', '#1e4d6b', '#15314a'],

  /** Rich navy/teal gradient */
  navyTeal: ['#0f2540', '#1e4976', '#2c5f8d', '#1a3d5c'],

  /** Sunset gradient */
  sunset: ['#ff6b6b', '#ee5a6f', '#c44569', '#8b2e54'],

  /** Forest green gradient */
  forest: ['#2d5016', '#3e6b1f', '#4a7c28', '#568d31'],

  /** Purple haze gradient */
  purple: ['#6a0dad', '#8b5cf6', '#a78bfa', '#c4b5fd'],

  /** Monochrome gradient */
  monochrome: ['#1a1a1a', '#2d2d2d', '#404040', '#525252'],
} as const;

/**
 * Generates CSS for the gradientShift keyframes animation
 * This should be added to your global CSS file
 *
 * @returns CSS keyframes string
 */
export function getGradientKeyframes(): string {
  return `
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`.trim();
}
