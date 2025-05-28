# Studio Haus - Configurable Gallery Generator

A powerful, production-ready Next.js application for creating dynamic, animated gallery experiences. Built with TypeScript, Tailwind CSS, and GSAP animations for professional-grade visual presentations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see your gallery in action.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Getting Started](#getting-started)
4. [Gallery Configuration](#gallery-configuration)
5. [Layout Types](#layout-types)
6. [Animation System](#animation-system)
7. [Media Management](#media-management)
8. [Advanced Configuration](#advanced-configuration)
9. [API Reference](#api-reference)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

Studio Haus is a configurable gallery generator that enables you to create stunning visual experiences with minimal setup. The system supports multiple media types, advanced animations, and flexible layouts - perfect for portfolios, product showcases, and creative presentations.

### ✨ Key Features

- **🎨 Multiple Layout Types**: Grid, Carousel, Masonry, and Fullscreen layouts
- **🎬 Advanced Animations**: GSAP-powered smooth transitions and effects
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🎥 Multi-Media Support**: Images, videos, and GIFs with optimized loading
- **⚡ Performance Optimized**: Virtualized rendering for large galleries
- **🔧 Type-Safe**: Full TypeScript support with comprehensive type definitions
- **🎛️ Flexible Configuration**: Static and dynamic configuration options

### 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Animations**: GSAP with ScrollTrigger
- **Performance**: React Window for virtualization
- **Icons**: Lucide React for UI elements

---

## 🏗️ System Architecture

The gallery system is built with a modular architecture that separates concerns and enables easy customization:

### 📁 Core Components

```
src/
├── components/
│   ├── Gallery.tsx           # Main gallery container
│   ├── GalleryLoader.tsx     # Dynamic loading system
│   ├── GalleryRow.tsx        # Individual gallery sections
│   └── MediaItem.tsx         # Media rendering component
├── data/
│   ├── enhancedGalleryData.ts # Static gallery configurations
│   └── galleryData.ts        # Legacy gallery data
├── services/
│   ├── galleryFileService.ts    # File system operations
│   └── galleryMetadataService.ts # Configuration management
├── hooks/
│   └── useGsapAnimation.ts   # Animation hook
├── types/
│   └── index.ts              # TypeScript definitions
└── utils/
    ├── animationConfigs.ts   # Animation presets
    ├── galleryGenerator.ts   # Dynamic generation
    └── assetPath.ts         # Asset management
```

### 🔄 Data Flow

1. **Static Configuration**: Define galleries in `enhancedGalleryData.ts`
2. **Dynamic Loading**: `GalleryLoader` scans `/public/assets/` folders
3. **Configuration Merge**: Static configs override dynamic ones
4. **Rendering**: Components render with animation and layout systems

---

## 🏁 Getting Started

### Method 1: Static Configuration (Recommended for MVP)

Create galleries by adding configurations to `/src/data/enhancedGalleryData.ts`:

```typescript
import { GalleryConfig, AnimationEffects, EaseFunctions } from "../types";

const enhancedGalleryData: GalleryConfig[] = [
  {
    id: "my-portfolio",
    title: "My Creative Portfolio",
    description: "A showcase of my best work",
    layout: "masonry",
    animation: {
      effect: "fade",
      duration: 0.8,
      ease: "power2.inOut",
      stagger: 0.15,
    },
    items: [
      {
        id: "project-1",
        title: "Project Alpha",
        description: "Modern web design",
        type: "image",
        url: "/assets/portfolio/project-1.jpg",
        category: "Web Design",
      },
      {
        id: "project-2",
        title: "Brand Video",
        description: "Corporate branding video",
        type: "video",
        url: "/assets/portfolio/brand-video.mp4",
        thumbUrl: "/assets/portfolio/brand-video-thumb.jpg",
        category: "Video",
      },
    ],
  },
];

export default enhancedGalleryData;
```

### Method 2: Dynamic File-Based Loading

1. **Create Asset Folders**: Add folders to `/public/assets/`

   ```
   public/assets/
   ├── portfolio/
   │   ├── image1.jpg
   │   ├── image2.png
   │   └── video.mp4
   └── gallery2/
       ├── photo1.jpg
       └── animation.gif
   ```

2. **Configure Metadata**: Add configuration in `galleryMetadataService.ts`

   ```typescript
   const galleryMeta: GalleryMeta = {
     portfolio: {
       title: "My Portfolio",
       description: "Creative works showcase",
       layout: "masonry",
       animation: {
         effect: "scale",
         duration: 0.9,
       },
     },
   };
   ```

3. **The system automatically**:
   - Scans folders for media files
   - Detects file types (images, videos, GIFs)
   - Merges with static configurations
   - Generates optimized galleries

---

## 🎨 Gallery Configuration

### Basic Gallery Structure

```typescript
interface GalleryConfig {
  id: string; // Unique identifier
  title: string; // Display title
  description: string; // Gallery description
  layout?: LayoutType; // Layout type (see below)
  animation: AnimationConfig; // Animation settings
  items: MediaItem[]; // Media items
  transitionTime?: number; // Carousel transition time (ms)
  container?: ContainerConfig; // Container styling
  galleryContainer?: GalleryContainerConfig; // Outer container
}
```

### Container Configuration

Control the gallery appearance with container settings:

```typescript
container: {
  width: '80%',              // Container width
  maxWidth: '1200px',        // Maximum width
  height: '70vh',            // Container height
  minHeight: '400px',        // Minimum height
  aspectRatio: '16/9',       // Aspect ratio
  alignment: 'center',       // 'left', 'center', 'right'
  background: '#f8f9fa',     // Background color
  borderRadius: '12px',      // Border radius
  padding: '2rem',           // Internal padding
  margin: '1rem auto'        // External margin
}
```

### Gallery Container Configuration

Control the outer wrapper:

```typescript
galleryContainer: {
  padding: '4rem 2rem',      // Outer padding
  display: 'flex',           // Display type
  alignItems: 'center',      // Vertical alignment
  justifyContent: 'center',  // Horizontal alignment
  minHeight: '100vh',        // Minimum height
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}
```

---

## 📐 Layout Types

The gallery system supports four distinct layout types, each optimized for different use cases:

### 1. 🏗️ Grid Layout (`'grid'`)

**Perfect for**: Product catalogs, uniform image collections, structured presentations

```typescript
{
  layout: 'grid',
  // Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop
  // Clean, uniform spacing with hover effects
}
```

**Features**:

- Responsive columns (1→2→3 based on screen size)
- Equal-height items for visual consistency
- Hover effects and smooth transitions
- Optimized for images with similar aspect ratios

### 2. 🎠 Carousel Layout (`'carousel'`)

**Perfect for**: Hero sections, featured work, storytelling sequences

```typescript
{
  layout: 'carousel',
  transitionTime: 3000,  // Auto-advance every 3 seconds
  animation: {
    effect: 'slide',     // Smooth slide transitions
    duration: 0.8
  }
}
```

**Features**:

- Auto-advancing slideshow
- Smooth crossfade/slide transitions
- Pause on hover interaction
- Preloading for performance
- Fullscreen support

### 3. 🧱 Masonry Layout (`'masonry'`)

**Perfect for**: Pinterest-style galleries, mixed content, artistic portfolios

```typescript
{
  layout: 'masonry',
  // Automatically arranges items based on natural dimensions
  // Perfect for mixed media and varying aspect ratios
}
```

**Features**:

- Dynamic height-based arrangement
- Break-inside-avoid for clean breaks
- Responsive column count
- Optimal space utilization
- Works with mixed media types

### 4. 🖥️ Fullscreen Layout (`'fullscreen'`)

**Perfect for**: Immersive experiences, hero images, dramatic presentations

```typescript
{
  layout: 'fullscreen',
  container: {
    width: '100%',
    height: '100vh'       // Full viewport height
  },
  galleryContainer: {
    padding: '0'          // Edge-to-edge display
  }
}
```

**Features**:

- Edge-to-edge display
- 100% viewport utilization
- Cinematic presentation
- Auto-advancing carousel
- Optimized for high-impact visuals

---

## 🎬 Animation System

The animation system is powered by GSAP and provides smooth, professional-grade transitions.

### Built-in Animation Effects

| Effect         | Description                 | Best For                      |
| -------------- | --------------------------- | ----------------------------- |
| `'fade'`       | Simple opacity transition   | Clean, subtle entrances       |
| `'slide'`      | Horizontal slide transition | Carousel navigation           |
| `'slide-up'`   | Slide from bottom with fade | Content reveals               |
| `'slide-down'` | Slide from top with fade    | Header animations             |
| `'scale'`      | Scale up with fade          | Product showcases             |
| `'none'`       | No animation                | Performance-critical sections |

### Animation Configuration

```typescript
animation: {
  effect: 'fade',           // Animation type
  duration: 0.8,            // Duration in seconds
  ease: 'power2.inOut',     // GSAP easing function
  stagger: 0.15,            // Delay between items (seconds)
  delay: 0,                 // Initial delay (seconds)

  // Custom animation properties
  from: {
    opacity: 0,
    scale: 0.9,
    y: 30                   // Start 30px below
  },
  to: {
    opacity: 1,
    scale: 1,
    y: 0                    // End at natural position
  }
}
```

### Available Easing Functions

```typescript
// Power easings (most common)
"power1.in", "power1.out", "power1.inOut";
"power2.in", "power2.out", "power2.inOut";
"power3.in", "power3.out", "power3.inOut";

// Special easings
("none"); // Linear, no easing
```

### Advanced Animation Example

```typescript
// Custom bounce-in effect
animation: {
  effect: 'scale',
  duration: 1.2,
  ease: 'power2.out',
  stagger: 0.1,
  from: {
    opacity: 0,
    scale: 0.3,
    rotation: -10,
    y: 50
  },
  to: {
    opacity: 1,
    scale: 1,
    rotation: 0,
    y: 0
  }
}
```

---

## 📸 Media Management

The system supports multiple media types with automatic optimization and loading strategies.

### Supported Media Types

#### 🖼️ Images

```typescript
{
  id: 'image-item',
  title: 'Beautiful Landscape',
  description: 'A stunning mountain view',
  type: 'image',
  url: '/assets/gallery/landscape.jpg',
  category: 'Nature',
  size: {
    width: '100%',
    height: 'auto'
  }
}
```

**Supported formats**: JPG, PNG, WebP, AVIF, SVG
**Best practices**:

- Use WebP/AVIF for better compression
- Optimize images to 1920px max width
- Provide alt text via title/description

#### 🎥 Videos

```typescript
{
  id: 'video-item',
  title: 'Product Demo',
  description: 'Interactive product showcase',
  type: 'video',
  url: '/assets/gallery/demo.mp4',
  thumbUrl: '/assets/gallery/demo-thumb.jpg',  // Optional thumbnail
  category: 'Demo'
}
```

**Supported formats**: MP4, WebM, OGV
**Best practices**:

- Use MP4 with H.264 encoding for compatibility
- Provide poster/thumbnail images
- Keep file sizes under 50MB for web

#### 🎞️ GIFs

```typescript
{
  id: 'gif-item',
  title: 'Loading Animation',
  description: 'Smooth loading indicator',
  type: 'gif',
  url: '/assets/gallery/loader.gif',
  category: 'Animation'
}
```

**Best practices**:

- Optimize GIFs for web (reduce colors, frames)
- Consider converting to video for larger animations
- Use for short, looping animations only

### Asset Organization

```
public/assets/
├── gallery1/              # Gallery folder name = gallery ID
│   ├── hero-image.jpg     # Images auto-detected
│   ├── product-video.mp4  # Videos auto-detected
│   └── animation.gif      # GIFs auto-detected
├── portfolio/
│   ├── project1.jpg
│   ├── project2.png
│   └── showcase.mp4
└── shared/               # Shared assets
    ├── logo.svg
    └── background.jpg
```

### Performance Features

- **Lazy Loading**: Images load as they enter viewport
- **Preloading**: Next/previous carousel items preload
- **Virtualization**: Large galleries use React Window
- **Responsive Images**: Automatic srcset generation (planned)
- **Format Detection**: Automatic WebP/AVIF serving (planned)

---

## ⚙️ Advanced Configuration

### Custom Page Implementation

Create a custom page that uses the gallery system:

```typescript
// src/app/portfolio/page.tsx
import Gallery from "../../components/Gallery";
import enhancedGalleryData from "../../data/enhancedGalleryData";

export default function PortfolioPage() {
  // Filter galleries for this page
  const portfolioGalleries = enhancedGalleryData.filter((gallery) =>
    ["portfolio", "featured-work"].includes(gallery.id)
  );

  return (
    <main className="min-h-screen">
      {/* Custom header */}
      <header className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">My Portfolio</h1>
          <p className="text-xl opacity-80">
            A curated selection of my best creative work
          </p>
        </div>
      </header>

      {/* Gallery component */}
      <Gallery galleries={portfolioGalleries} className="portfolio-galleries" />

      {/* Custom footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Studio Haus. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
```

### Environment-Specific Configuration

```typescript
// src/config/gallery.config.ts
const galleryConfig = {
  development: {
    autoAdvance: false, // Disable auto-advance in dev
    showDebugInfo: true, // Show debug information
    preloadRadius: 1, // Preload 1 item ahead/behind
  },
  production: {
    autoAdvance: true, // Enable auto-advance
    showDebugInfo: false, // Hide debug information
    preloadRadius: 3, // Preload 3 items ahead/behind
  },
};

export default galleryConfig[process.env.NODE_ENV || "development"];
```

### Custom Animation Presets

Add your own animation presets:

```typescript
// src/utils/customAnimations.ts
export const customAnimationPresets = {
  "elastic-in": {
    duration: 1.2,
    ease: "elastic.out(1, 0.5)",
    from: { opacity: 0, scale: 0.5, rotation: -15 },
    to: { opacity: 1, scale: 1, rotation: 0 },
  },
  magnetic: {
    duration: 0.8,
    ease: "power2.out",
    from: { opacity: 0, x: -100, skewX: 10 },
    to: { opacity: 1, x: 0, skewX: 0 },
  },
};
```

### TypeScript Integration

Extend types for custom properties:

```typescript
// src/types/custom.ts
import { MediaItem as BaseMediaItem } from "./index";

export interface ExtendedMediaItem extends BaseMediaItem {
  tags?: string[]; // Add custom tags
  featured?: boolean; // Mark as featured
  metadata?: {
    camera?: string; // Camera information
    location?: string; // Photo location
    date?: string; // Creation date
  };
}
```

---

## 📚 API Reference

### Core Interfaces

#### GalleryConfig

```typescript
interface GalleryConfig {
  id: string; // Unique gallery identifier
  title: string; // Display title
  description: string; // Gallery description
  layout?: "grid" | "carousel" | "masonry" | "fullscreen";
  animation: AnimationConfig; // Animation settings
  items: MediaItem[]; // Media items array
  transitionTime?: number; // Carousel auto-advance time (ms)
  container?: ContainerConfig; // Inner container styling
  galleryContainer?: GalleryContainerConfig; // Outer container styling
}
```

#### MediaItem

```typescript
interface MediaItem {
  id: string; // Unique item identifier
  title: string; // Item title
  description: string; // Item description
  type: "image" | "video" | "gif"; // Media type
  url: string; // Media URL
  imageUrl?: string; // Backward compatibility
  thumbUrl?: string; // Video thumbnail URL
  category: string; // Category label
  size?: {
    // Custom sizing
    width?: string | number;
    height?: string | number;
  };
}
```

#### AnimationConfig

```typescript
interface AnimationConfig {
  effect: AnimationEffectType; // Animation effect
  duration: number; // Duration in seconds
  ease: EaseFunctionType; // GSAP easing function
  delay?: number; // Initial delay
  stagger?: number; // Stagger delay between items
  from?: Record<string, any>; // Starting properties
  to?: Record<string, any>; // Ending properties
  crossfade?: {
    // Crossfade-specific settings
    from?: Record<string, any>;
    to?: Record<string, any>;
    prevOut?: Record<string, any>;
  };
}
```

### Component Props

#### Gallery Component

```typescript
interface GalleryProps {
  galleries?: GalleryConfig[]; // Gallery configurations
  className?: string; // Additional CSS classes
}

// Usage
<Gallery galleries={myGalleries} className="custom-gallery-wrapper" />;
```

#### GalleryRow Component

```typescript
interface GalleryRowProps {
  gallery: GalleryConfig; // Single gallery configuration
}

// Usage
<GalleryRow gallery={singleGalleryConfig} />;
```

### Utility Functions

#### Animation Utilities

```typescript
// Get animation configuration by effect name
getAnimationConfig(effect: string): AnimationConfig

// Available in: src/utils/animationConfigs.ts
import { getAnimationConfig } from '../utils/animationConfigs';

const fadeConfig = getAnimationConfig('fade');
```

#### Gallery Generation

```typescript
// Generate gallery from file list
generateGalleryConfig(
  galleryId: string,
  files: string[],
  options?: {
    title?: string;
    description?: string;
    layout?: 'grid' | 'carousel' | 'masonry' | 'fullscreen';
    animation?: Partial<AnimationConfig>;
    transitionTime?: number;
  }
): GalleryConfig

// Usage
import { generateGalleryConfig } from '../utils/galleryGenerator';

const gallery = generateGalleryConfig('my-gallery', fileList, {
  title: 'My Dynamic Gallery',
  layout: 'masonry'
});
```

### Service Classes

#### GalleryFileService

```typescript
class GalleryFileService {
  ensureAssetsDirectory(): Promise<void>;
  getGalleryDirectories(): Promise<string[]>;
  getGalleryFiles(galleryId: string): Promise<string[]>;
}
```

#### GalleryMetadataService

```typescript
class GalleryMetadataService {
  generateGalleryConfig(galleryId: string, files: string[]): GalleryConfig;
}
```

---

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Environment Variables

Create `.env.local` for environment-specific settings:

```bash
# .env.local
NEXT_PUBLIC_GALLERY_BASE_URL=https://your-domain.com
NEXT_PUBLIC_ASSET_PREFIX=/gallery-assets
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure custom domain
vercel --prod
```

#### Netlify

```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
NEXT_PUBLIC_GALLERY_BASE_URL=https://your-site.netlify.app
```

#### Traditional Hosting

```bash
# Build static export (if needed)
npm run build
npm run export

# Upload .next/out/ directory to your hosting provider
```

### Performance Optimization

#### Image Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ["your-image-domain.com"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
};
```

#### Bundle Analysis

```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Add to package.json scripts
"analyze": "ANALYZE=true next build"

# Run analysis
npm run analyze
```

---

## 🔧 Troubleshooting

### Common Issues

#### ❌ "Gallery not found" Error

**Problem**: Gallery ID doesn't match folder name or configuration

**Solution**:

```typescript
// Check that gallery ID matches exactly
const gallery = {
  id: "portfolio", // Must match /public/assets/portfolio/
  // ...
};
```

#### ❌ Images Not Loading

**Problem**: Incorrect asset paths or missing files

**Solution**:

```typescript
// Use absolute paths from public directory
url: "/assets/gallery/image.jpg"; // ✅ Correct
url: "assets/gallery/image.jpg"; // ❌ Incorrect
url: "./assets/gallery/image.jpg"; // ❌ Incorrect
```

#### ❌ Animations Not Working

**Problem**: GSAP not loaded or ScrollTrigger not registered

**Solution**:

```typescript
// Ensure GSAP is properly imported
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
```

#### ❌ Build Failures

**Problem**: TypeScript errors or missing dependencies

**Solution**:

```bash
# Check for TypeScript errors
npm run build

# Install missing dependencies
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

### Debug Mode

Enable debug mode for development:

```typescript
// src/utils/debugHelper.ts
export const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("Gallery structure:", gallery);
}
```

### Performance Issues

#### Large Gallery Optimization

```typescript
// Use virtualization for galleries with 100+ items
const VirtualizedGallery = React.lazy(
  () => import("../components/VirtualizedGallery")
);

// Implement in GalleryRow.tsx for grid/masonry layouts
{
  gallery.items.length > 100 ? (
    <VirtualizedGallery items={gallery.items} />
  ) : (
    <StandardGallery items={gallery.items} />
  );
}
```

#### Memory Management

```typescript
// Cleanup animations on unmount
useEffect(() => {
  return () => {
    animations.forEach((anim) => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    });
  };
}, []);
```

### Browser Support

- **Modern Browsers**: Full support (Chrome 90+, Firefox 88+, Safari 14+)
- **Older Browsers**: Graceful degradation (animations may be simplified)
- **Mobile**: Optimized for touch interactions and performance

### Getting Help

- 📧 **Issues**: Check existing issues or create new ones
- 📖 **Documentation**: Refer to inline code comments
- 🔍 **Debug**: Use browser DevTools and console logs
- 🚀 **Performance**: Use React DevTools Profiler

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Studio Haus Gallery Generator** - Creating beautiful, performant gallery experiences with ease.
