# Gradient Generator Utility

A type-safe utility for creating consistent animated gradients throughout the application.

## Features

- **Predefined Presets**: Ready-to-use gradient colour schemes
- **Customisable**: Full control over direction, animation, and timing
- **Type-Safe**: Full TypeScript support with JSDoc documentation
- **Animated**: Built-in support for gradient shift animations
- **Flexible**: Works with both inline styles and CSS classes

## Usage

### Using Presets

The simplest way to use gradients is with predefined presets:

```tsx
import { generateAnimatedGradientStyle, gradientPresets } from '@/utils/gradientGenerator';

function MyComponent() {
  const gradientStyle = generateAnimatedGradientStyle({
    colours: gradientPresets.warmTan,
  });

  return <div style={gradientStyle}>Content</div>;
}
```

### Custom Colours

Create gradients with your own colour palette:

```tsx
const gradientStyle = generateAnimatedGradientStyle({
  colours: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
  direction: 90,
  animationDuration: 20,
});
```

### Available Presets

```typescript
gradientPresets.warmTan    // Tan/peach gradient (current mobile menu)
gradientPresets.deepBlue   // Deep blue gradient (INK-inspired)
gradientPresets.navyTeal   // Rich navy/teal gradient
gradientPresets.sunset     // Sunset gradient
gradientPresets.forest     // Forest green gradient
gradientPresets.purple     // Purple haze gradient
gradientPresets.monochrome // Monochrome gradient
```

### Configuration Options

```typescript
interface GradientConfig {
  colours: readonly string[] | string[];  // Array of hex codes (min 2)
  direction?: number;                     // Degrees (default: 135)
  backgroundSize?: string;                // CSS size (default: '400% 400%')
  animationDuration?: number;             // Seconds (default: 15)
  animationTiming?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}
```

### Without Animation

If you need a static gradient:

```tsx
import { generateGradient } from '@/utils/gradientGenerator';

const staticGradient = generateGradient(['#FF6B6B', '#4ECDC4'], 45);
// Returns: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
```

## How to Change Your Client's Gradient

### Option 1: Use a Different Preset

In `MobileMenu.tsx`, change the preset:

```tsx
const gradientStyle = generateAnimatedGradientStyle({
  colours: gradientPresets.deepBlue,  // Change this line
  direction: 135,
  animationDuration: 15,
});
```

### Option 2: Add Custom Colours

In `MobileMenu.tsx`, provide custom colours:

```tsx
const gradientStyle = generateAnimatedGradientStyle({
  colours: ['#yourColour1', '#yourColour2', '#yourColour3', '#yourColour4'],
  direction: 135,
  animationDuration: 15,
});
```

### Option 3: Create a New Preset

Add to `src/utils/gradientGenerator.ts`:

```typescript
export const gradientPresets = {
  // ... existing presets
  clientBrand: ['#colour1', '#colour2', '#colour3', '#colour4'],
} as const;
```

Then use it:

```tsx
colours: gradientPresets.clientBrand
```

## Required CSS

The gradient animation requires the `gradientShift` keyframes in your global CSS. This is already added to `globals.css`:

```css
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
```

## Examples

### Quick Change Example

Client wants to change from warm tan to deep blue:

```tsx
// Before
colours: gradientPresets.warmTan

// After
colours: gradientPresets.deepBlue
```

### Custom Brand Colours

Client provides brand colours: `#E63946`, `#F1FAEE`, `#A8DADC`, `#457B9D`

```tsx
const gradientStyle = generateAnimatedGradientStyle({
  colours: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D'],
  direction: 135,
  animationDuration: 15,
});
```

### Slower, Linear Animation

```tsx
const gradientStyle = generateAnimatedGradientStyle({
  colours: gradientPresets.sunset,
  animationDuration: 30,
  animationTiming: 'linear',
});
```

## Testing

Tests are located in `src/__tests__/utils/gradientGenerator.test.ts`

Run tests:
```bash
npm test gradientGenerator
```
