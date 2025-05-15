# Haus Creative NextJS Repository Manual

This manual explains how the Haus Creative NextJS repository works, with a specific focus on how to add and configure galleries.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Gallery System Structure](#gallery-system-structure)
3. [Adding Galleries](#adding-galleries)
4. [Gallery Configuration Options](#gallery-configuration-options)
5. [Animation Effects](#animation-effects)
6. [Media Types](#media-types)
7. [Adding New Pages](#adding-new-pages)

---

## Project Overview

Haus Creative is a NextJS application built with TypeScript, TailwindCSS, and GSAP animations. The project uses Next.js App Router and is structured to showcase visual media in various dynamic gallery formats.

The main technologies used are:
- **Next.js** (React framework)
- **TypeScript** (Type safety)
- **TailwindCSS** (Styling)
- **GSAP** with ScrollTrigger (Animations)

---

## Gallery System Structure

The gallery system consists of three main parts:

1. **Data Files** - Located in `/src/data/` directory:
   - `galleryData.ts` - Basic gallery data
   - `enhancedGalleryData.ts` - Extended gallery data with support for multiple media types and animation configurations

2. **Components** - Located in `/src/components/` directory:
   - `Gallery.tsx` - Main gallery container component
   - `GalleryRow.tsx` - Individual gallery row/section component
   - `MediaItem.tsx` - Handles different media types (images, videos, GIFs)

3. **Hooks** - Located in `/src/hooks/` directory:
   - `useGsapAnimation.ts` - Custom hook for GSAP animations with ScrollTrigger

---

## Adding Galleries

To add new galleries, you need to edit the `enhancedGalleryData.ts` file. This is the preferred way as it supports all features including different media types and advanced animations.

Here's how to add a new gallery:

1. Open `/src/data/enhancedGalleryData.ts`
2. Add a new gallery object to the array by following this template:

```typescript
{
    id: 'unique-gallery-id',
    title: 'Gallery Title',
    description: 'Gallery Description',
    layout: 'grid', // Choose from: 'grid', 'carousel', 'masonry', 'fullscreen'
    animation: {
        effect: 'fade', // Animation effect (see Animation Effects section)
        duration: 0.8,
        ease: 'power2.inOut',
        stagger: 0.15, // Delay between animating items
        from: {
            opacity: 0,
            scale: 0.97
        },
        to: {
            opacity: 1,
            scale: 1
        }
    },
    items: [
        // Add your media items here (see example below)
        {
            id: 'item-1',
            title: 'Item Title',
            description: 'Item Description',
            type: 'image', // 'image', 'video', or 'gif'
            url: 'https://example.com/image.jpg',
            category: 'Category'
        },
        // Add more items as needed
    ]
}
```

3. Add this gallery to the `enhancedGalleryData` array and save the file.

---

## Gallery Configuration Options

### Layout Options

The gallery system supports four layout types:

1. **`grid`**: Traditional grid layout with responsive columns
   - Best for collections of images with similar dimensions
   - Arranges items in a clean, uniform grid

2. **`carousel`**: Interactive slideshow with navigation controls
   - Great for showcasing featured work
   - Includes automatic sliding with pause on hover
   - Provides navigation arrows and indicator dots

3. **`masonry`**: Pinterest-style layout with varied heights
   - Perfect for mixed content with different dimensions
   - Automatically arranges items optimally based on their height

4. **`fullscreen`**: Edge-to-edge display that takes up the entire viewport
   - Ideal for immersive, high-impact visuals
   - Best with high-resolution images or videos

### Item Properties

Each gallery item supports the following properties:

- `id` (string): Unique identifier
- `title` (string): Item title
- `description` (string): Item description
- `type` (string): Media type - 'image', 'video', or 'gif'
- `url` (string): URL to the media
- `thumbUrl` (string, optional): Thumbnail URL (for videos)
- `category` (string): Category label
- `size` (object, optional): Custom size settings
  - `width` (string|number, optional)
  - `height` (string|number, optional)

---

## Animation Effects

The gallery system supports various animation effects through GSAP. You can specify these in the `effect` property of the animation configuration.

### Built-in Animation Effects:

1. **`fade`**: Simple fade-in animation
2. **`slide-up`**: Elements slide upward while fading in
3. **`slide-down`**: Elements slide downward while fading in
4. **`slide-left`**: Elements slide from right to left
5. **`slide-right`**: Elements slide from left to right
6. **`scale`**: Elements scale up while fading in
7. **`clip-reveal`**: Elements reveal with a clipping animation
8. **`blur-in`**: Elements fade in with a blur effect (requires additional CSS)
9. **`flip-in`**: Elements flip into view (requires additional CSS)
10. **`stagger-in`**: Elements appear one after another with a staggered delay
11. **`zoom-in`**: Elements zoom in from a smaller scale
12. **`bounce-in`**: Elements bounce in with a spring effect
13. **`perspective-in`**: Elements animate in with a perspective effect

### Custom Animations:

You can also create custom animations by specifying the `from` and `to` properties in the animation configuration:

```typescript
animation: {
    effect: 'custom',
    duration: 1.0,
    ease: 'power2.inOut',
    stagger: 0.2,
    from: {
        opacity: 0,
        y: 100,
        rotation: -5
    },
    to: {
        opacity: 1,
        y: 0,
        rotation: 0
    }
}
```

### Animation Timing

- `duration`: Animation duration in seconds
- `ease`: GSAP easing function (e.g., 'power2.out', 'back.inOut')
- `stagger`: Delay between items in seconds
- `delay`: Initial delay before animation starts

---

## Media Types

The gallery system supports three media types:

1. **Images**:
```typescript
{
    id: 'image-item-1',
    title: 'Image Title',
    description: 'Image Description',
    type: 'image',
    url: 'https://example.com/image.jpg',
    category: 'Category'
}
```

2. **Videos**:
```typescript
{
    id: 'video-item-1',
    title: 'Video Title',
    description: 'Video Description',
    type: 'video',
    url: 'https://example.com/video.mp4',
    thumbUrl: 'https://example.com/video-thumbnail.jpg', // Optional thumbnail
    category: 'Video'
}
```

3. **GIFs**:
```typescript
{
    id: 'gif-item-1',
    title: 'GIF Title',
    description: 'GIF Description',
    type: 'gif',
    url: 'https://example.com/animation.gif',
    category: 'Animation'
}
```

### Important Note on Video URLs

For videos, ensure you're using HTTPS URLs with valid SSL certificates to avoid browser security warnings. Here's an example of a reliable video URL source:

```
https://assets.mixkit.co/videos/preview/mixkit-product-moving-through-a-production-line-11069-large.mp4
```

---

## Adding New Pages

To add a new page that uses galleries:

1. Create a new page file in the `/src/app/` directory, for example `/src/app/portfolio/page.tsx`
2. Import the Gallery component:

```typescript
import Gallery from '../../components/Gallery';
import enhancedGalleryData from '../../data/enhancedGalleryData';

export default function PortfolioPage() {
  // You can filter galleries by ID or create a separate data file
  const portfolioGalleries = enhancedGalleryData.filter(gallery => 
    ['fashion-gallery', 'video-showcase'].includes(gallery.id)
  );
  
  return (
    <main>
      <h1>Portfolio</h1>
      <Gallery galleries={portfolioGalleries} />
    </main>
  );
}
```

3. Optionally, you can create a separate data file for each page if you have many different galleries.

---

## Development Tips

1. **Gallery Performance**:
   - Optimize image sizes for web (use WebP or AVIF formats if possible)
   - Consider lazy loading for galleries with many items
   - Use appropriate video formats and compress them for web use

2. **Animation Timing**:
   - Keep animations subtle and brief for professional use
   - Heavy animations can affect performance on lower-end devices
   - Test on mobile to ensure good performance

3. **Responsive Design**:
   - The gallery layouts are already responsive using TailwindCSS
   - Test on various screen sizes to ensure proper display
   - Adjust the column counts in `getLayoutClass()` if needed