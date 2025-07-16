# GSAP Architecture - React Best Practices

This document outlines the improved GSAP architecture that follows React best practices and resolves the previous implementation issues.

## Overview

The new architecture provides:
- **Centralized GSAP management** through React Context
- **Proper cleanup** and memory leak prevention
- **Type-safe** animations with TypeScript
- **Server-side rendering** compatibility
- **Modular hooks** for different animation types
- **Performance optimizations** with proper dependency management

## Architecture Components

### 1. GSAP Context (`src/contexts/GSAPContext.tsx`)

The central provider that manages GSAP instances and ensures proper initialization.

```tsx
import { GSAPProvider, useGSAP } from '../contexts/GSAPContext'

// Wrap your app
<GSAPProvider>
  <YourApp />
</GSAPProvider>

// Use in components
const { gsap, isReady } = useGSAP()
```

**Key Features:**
- Single GSAP instance shared across the app
- Proper plugin registration (ScrollTrigger)
- Server-side rendering safety
- Ready state management

### 2. Animation Hooks

#### `useGSAPAnimation` (`src/hooks/useGSAPAnimation.ts`)

For basic GSAP animations with ScrollTrigger support.

```tsx
import useGSAPAnimation from '../hooks/useGSAPAnimation'

const { elementRef, playAnimation, killAnimation, isAnimating } = useGSAPAnimation(
  {
    effect: 'fade',
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  },
  [dependencies]
)
```

**Supported Effects:**
- `fade` - Simple opacity transition
- `slide-up` - Slide from bottom
- `slide-down` - Slide from top
- `slide-left` - Slide from right
- `slide-right` - Slide from left
- `scale` - Scale with opacity
- `clip-reveal` - Clip path reveal

#### `useGSAPTimeline` (`src/hooks/useGSAPTimeline.ts`)

For complex timeline-based animations.

```tsx
import useGSAPTimeline from '../hooks/useGSAPTimeline'

const { 
  timeline, 
  createTimeline, 
  addToTimeline, 
  play, 
  pause, 
  kill 
} = useGSAPTimeline(
  {
    paused: true,
    onComplete: () => console.log('Animation complete')
  },
  [dependencies]
)
```

#### `useScrollTrigger` (`src/hooks/useScrollTrigger.ts`)

For ScrollTrigger-specific animations.

```tsx
import useScrollTrigger from '../hooks/useScrollTrigger'

const { 
  triggerRef, 
  createScrollTrigger, 
  kill, 
  refresh 
} = useScrollTrigger(
  {
    start: 'top center',
    end: 'bottom center',
    toggleActions: 'play none none reverse',
    onEnter: () => console.log('Entered viewport'),
    onLeave: () => console.log('Left viewport')
  },
  [dependencies]
)
```

### 3. Example Components

#### `AnimatedSection` (`src/components/AnimatedSection.tsx`)

A reusable component that demonstrates the new architecture.

```tsx
import AnimatedSection from '../components/AnimatedSection'

<AnimatedSection 
  effect="slide-up" 
  duration={1.2} 
  delay={0.2}
  className="my-section"
>
  <h2>Animated Content</h2>
  <p>This content will animate on scroll</p>
</AnimatedSection>
```

## Migration Guide

### Before (Old Architecture)

```tsx
// ❌ Direct GSAP imports
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ❌ Manual plugin registration
gsap.registerPlugin(ScrollTrigger)

// ❌ Direct GSAP usage in components
useEffect(() => {
  gsap.to(element, { opacity: 1 })
}, [])
```

### After (New Architecture)

```tsx
// ✅ Use GSAP context
import { useGSAP } from '../contexts/GSAPContext'

// ✅ Use specialized hooks
import useGSAPAnimation from '../hooks/useGSAPAnimation'

// ✅ Proper React patterns
const { elementRef } = useGSAPAnimation({
  effect: 'fade',
  duration: 0.8
})
```

## Best Practices

### 1. Always Use the Context

```tsx
// ✅ Correct
const { gsap, isReady } = useGSAP()

// ❌ Avoid direct imports
import { gsap } from 'gsap'
```

### 2. Proper Cleanup

```tsx
// ✅ Automatic cleanup with hooks
const { killAnimation } = useGSAPAnimation(options)

// ✅ Manual cleanup when needed
useEffect(() => {
  return () => {
    killAnimation()
  }
}, [killAnimation])
```

### 3. Dependency Management

```tsx
// ✅ Proper dependencies
const { elementRef } = useGSAPAnimation(
  { effect: 'fade', duration: 0.8 },
  [effect, duration] // Include all animation options
)
```

### 4. Server-Side Rendering Safety

```tsx
// ✅ Safe SSR
const { isReady } = useGSAP()

if (!isReady) return <div>Loading...</div>

// ✅ Check for window
if (typeof window === 'undefined') return
```

### 5. Performance Optimization

```tsx
// ✅ Use useCallback for animation functions
const playAnimation = useCallback(() => {
  // Animation logic
}, [dependencies])

// ✅ Use useRef for DOM elements
const elementRef = useRef<HTMLElement>(null)
```

## Common Patterns

### 1. Scroll-Triggered Animations

```tsx
const { elementRef } = useGSAPAnimation({
  effect: 'slide-up',
  scrollTrigger: {
    start: 'top bottom-=100',
    toggleActions: 'play none none reverse'
  }
})
```

### 2. Timeline Animations

```tsx
const { createTimeline, addToTimeline } = useGSAPTimeline()

const timeline = createTimeline()
timeline
  .addToTimeline(element1, { opacity: 0, duration: 0.5 })
  .addToTimeline(element2, { y: 50, duration: 0.5 }, '-=0.3')
```

### 3. Conditional Animations

```tsx
const { elementRef, playAnimation } = useGSAPAnimation(options)

useEffect(() => {
  if (shouldAnimate) {
    playAnimation()
  }
}, [shouldAnimate, playAnimation])
```

## Troubleshooting

### Common Issues

1. **Animations not working**
   - Ensure `isReady` is true from GSAP context
   - Check that element refs are properly set
   - Verify ScrollTrigger is registered

2. **Memory leaks**
   - Always use the provided cleanup functions
   - Don't create animations outside of hooks
   - Use proper dependency arrays

3. **SSR issues**
   - Check for `typeof window !== 'undefined'`
   - Use `isReady` state from context
   - Avoid direct GSAP imports

### Debug Mode

Enable debug mode for development:

```tsx
// In GSAPContext.tsx
if (process.env.NODE_ENV === 'development') {
  gsap.config({ nullTargetWarn: false })
}
```

## Performance Tips

1. **Use `willChange` CSS property** for elements that will animate
2. **Batch animations** using timelines instead of individual tweens
3. **Use `transform` and `opacity`** for better performance
4. **Limit concurrent animations** to prevent frame drops
5. **Use `ScrollTrigger.refresh()`** when content changes dynamically

## TypeScript Support

All hooks and components are fully typed:

```tsx
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
```

This architecture provides a solid foundation for GSAP animations in React while following best practices and maintaining excellent performance.