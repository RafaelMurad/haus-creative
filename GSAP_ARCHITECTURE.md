# GSAP Architecture - Official React Integration

This document outlines the improved GSAP architecture that uses the official `@gsap/react` package and follows GSAP's recommended React best practices.

## Overview

The new architecture provides:
- **Official GSAP React integration** using `@gsap/react` and `useGSAP` hook
- **Automatic cleanup** using `gsap.context()` 
- **SSR-safe** animations with proper hydration
- **React 18 Strict Mode** compatibility
- **Memory leak prevention** with automatic animation reversion
- **Type-safe** animations with TypeScript
- **Performance optimizations** with proper scoping

## Official GSAP React Package

### Installation
```bash
npm install @gsap/react
```

### Registration
```tsx
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register the hook and plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)
```

## Architecture Components

### 1. Direct useGSAP Usage

The simplest and most recommended approach is to use the `useGSAP` hook directly in your components:

```tsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function MyComponent() {
  const container = useRef<HTMLDivElement>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // All GSAP animations here are automatically cleaned up
    gsap.to(elementRef.current, { x: 100, duration: 1 })
  }, { scope: container })

  return (
    <div ref={container}>
      <div ref={elementRef}>Animate me</div>
    </div>
  )
}
```

### 2. Custom Animation Hooks

For reusable animation patterns, we've created custom hooks that wrap the official `useGSAP`:

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

#### `GSAPExample` (`src/components/GSAPExample.tsx`)

A simple example demonstrating direct `useGSAP` usage:

```tsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function GSAPExample() {
  const container = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to(boxRef.current, {
      x: 200,
      rotation: 360,
      duration: 2,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true
    })
  }, { scope: container })

  return (
    <div ref={container}>
      <div ref={boxRef}>Animated Box</div>
    </div>
  )
}
```

#### `AnimatedSection` (`src/components/AnimatedSection.tsx`)

A reusable component using the custom animation hook:

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

## Key Benefits of Official Integration

### 1. Automatic Cleanup
```tsx
useGSAP(() => {
  // All animations created here are automatically reverted on unmount
  gsap.to('.element', { x: 100 })
  gsap.timeline().to('.element2', { y: 50 })
}, [])
```

### 2. Scoping
```tsx
const container = useRef()

useGSAP(() => {
  // Selector text is scoped to container descendants
  gsap.to('.box', { x: 100 }) // Only affects .box inside container
}, { scope: container })
```

### 3. Context-Safe Interactions
```tsx
const { contextSafe } = useGSAP({ scope: container })

const handleClick = contextSafe(() => {
  // This animation will be cleaned up properly
  gsap.to('.clicked', { scale: 1.2 })
})

return <button onClick={handleClick}>Click me</button>
```

### 4. Dependency Management
```tsx
const [endX, setEndX] = useState(100)

useGSAP(() => {
  gsap.to('.element', { x: endX })
}, { dependencies: [endX] }) // Re-runs when endX changes
```

## Migration from Custom Architecture

### Before (Custom Context)
```tsx
// ❌ Custom context approach
import { useGSAP } from '../contexts/GSAPContext'

const { gsap, isReady } = useGSAP()

useEffect(() => {
  if (!isReady) return
  gsap.to(element, { x: 100 })
}, [isReady, gsap])
```

### After (Official useGSAP)
```tsx
// ✅ Official GSAP React approach
import { useGSAP } from '@gsap/react'

useGSAP(() => {
  gsap.to(element, { x: 100 })
}, [])
```

## Best Practices

### 1. Always Use useGSAP for Animations
```tsx
// ✅ Correct
useGSAP(() => {
  gsap.to('.element', { x: 100 })
})

// ❌ Avoid direct useEffect with GSAP
useEffect(() => {
  gsap.to('.element', { x: 100 })
}, [])
```

### 2. Use Scoping for Selector Text
```tsx
const container = useRef()

useGSAP(() => {
  gsap.to('.box', { x: 100 }) // Scoped to container
}, { scope: container })
```

### 3. Handle Interactive Animations
```tsx
const { contextSafe } = useGSAP({ scope: container })

const handleClick = contextSafe(() => {
  gsap.to('.element', { scale: 1.2 })
})
```

### 4. Proper Dependency Arrays
```tsx
const [value, setValue] = useState(0)

useGSAP(() => {
  gsap.to('.element', { x: value })
}, { dependencies: [value] })
```

### 5. SSR Safety
```tsx
// ✅ The useGSAP hook is automatically SSR-safe
useGSAP(() => {
  // This only runs on the client
  gsap.to('.element', { x: 100 })
})
```

## Common Patterns

### 1. Scroll-Triggered Animations
```tsx
useGSAP(() => {
  gsap.fromTo('.element', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: '.element',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      }
    }
  )
})
```

### 2. Timeline Animations
```tsx
useGSAP(() => {
  const tl = gsap.timeline()
  tl.to('.element1', { opacity: 0, duration: 0.5 })
    .to('.element2', { y: 50, duration: 0.5 }, '-=0.3')
})
```

### 3. Conditional Animations
```tsx
const [shouldAnimate, setShouldAnimate] = useState(false)

useGSAP(() => {
  if (shouldAnimate) {
    gsap.to('.element', { x: 100 })
  }
}, { dependencies: [shouldAnimate] })
```

## Troubleshooting

### Common Issues

1. **Animations not working**
   - Ensure `useGSAP` is imported from `@gsap/react`
   - Check that the hook is registered: `gsap.registerPlugin(useGSAP)`
   - Verify element refs are properly set

2. **Memory leaks**
   - All animations in `useGSAP` are automatically cleaned up
   - Use `contextSafe` for interactive animations
   - Don't create animations outside of `useGSAP`

3. **SSR issues**
   - The `useGSAP` hook is automatically SSR-safe
   - No need for manual window checks

### Debug Mode

Enable debug mode for development:

```tsx
// In your app initialization
if (process.env.NODE_ENV === 'development') {
  gsap.config({ nullTargetWarn: false })
}
```

## Performance Tips

1. **Use scoping** to limit selector text scope
2. **Batch animations** using timelines
3. **Use `transform` and `opacity`** for better performance
4. **Limit concurrent animations** to prevent frame drops
5. **Use `ScrollTrigger.refresh()`** when content changes dynamically

## TypeScript Support

All hooks and components are fully typed and work seamlessly with TypeScript:

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

This architecture provides the most robust, future-proof, and idiomatic React+GSAP integration using the official GSAP React package.