# HAUS Creative - Agency Website

A high-performance creative agency website built with Next.js 14. Features smooth scroll animations, immersive galleries, and optimized media delivery.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Features

- **Scroll-Animated Galleries** - GPU-accelerated sticky scroll effects with Framer Motion
- **Intro Hero** - Full-viewport immersive first impression
- **Work Gallery Items** - Individual project showcases with smooth scroll-triggered animations
- **Auto-Hide Header** - Smart navigation that hides on scroll down, shows on scroll up
- **Responsive Layout** - Mobile-first design with adaptive menu
- **Multi-Media Support** - Optimized images, videos, and GIFs with Next.js Image
- **Dynamic Routes** - Automated project pages with fallback generation
- **Performance Optimized** - Video poster preload, GPU transforms, zero re-renders
- **Accessible** - WCAG compliant with error boundaries

## Tech Stack

- **Framework**: Next.js 14.1.0 (App Router)
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 12.23.24
- **Testing**: Jest + React Testing Library

## Performance

- ✅ 90% scroll performance improvement (12 listeners → 1 shared)
- ✅ GPU-accelerated animations (zero React re-renders)
- ✅ 152 kB homepage bundle
- ✅ LCP optimized with priority loading
- ✅ 12 static routes pre-generated

## Project Structure

```
src/
├── app/                     # Pages
│   ├── page.tsx            # Homepage with IntroHero + WorkGalleryItem
│   ├── work/               # Work showcase
│   │   ├── page.tsx        # Work grid
│   │   └── [slug]/         # Dynamic project pages
│   ├── contact/            # Contact page
│   └── about/              # About page
├── components/
│   ├── home/               # Homepage components
│   │   ├── IntroHero.tsx   # Full-viewport intro
│   │   ├── WorkGalleryItem.tsx # Scroll-animated gallery
│   │   ├── VideoHero.tsx   # Video hero section
│   │   └── CTALinks.tsx    # Call-to-action links
│   ├── layout/             # Layout components
│   │   ├── Header.tsx      # Auto-hide navigation
│   │   ├── Footer.tsx      # Site footer
│   │   └── MobileMenu.tsx  # Animated mobile menu
│   ├── ui/                 # UI primitives
│   │   ├── Logo.tsx        # SVG logo
│   │   ├── MediaRenderer.tsx # Optimized media component
│   │   └── MenuIcon.tsx    # Hamburger icon
│   ├── ErrorBoundary.tsx   # Error handling
│   └── Providers.tsx       # Client-side providers
├── config/
│   ├── site.ts             # Site configuration
│   ├── projects.ts         # Project data + fallback system
│   └── animations.ts       # Animation timing constants
├── hooks/
│   ├── useStickyScrollAnimation.ts  # GPU-accelerated scroll
│   ├── useScrollDirection.ts        # Header auto-hide logic
│   ├── useBodyScrollLock.ts         # Menu scroll prevention
│   └── useIntersectionObserver.ts   # Viewport detection
└── utils/
    ├── animationConfigs.ts  # CSS animation configurations
    ├── gradientGenerator.ts # Animated gradient utility
    ├── assetPath.ts         # Asset path helpers
    └── debugHelper.ts       # Development debugging tools
```

## Configuration

Edit `src/config/site.ts` to customize:

```typescript
export const siteConfig = {
  name: "HAUS",
  description: "Creative studio for digital experiences",
  email: "hello@haus-creative.com",
  mainMenu: [...],
  socialLinks: [...],
};

export const featuredProjects = [...];
```

Edit `src/config/animations.ts` for animation timing:

```typescript
export const ANIMATIONS = {
  hero: { fadeIn: { duration: 1, ease: 'easeOut' } },
  gallery: { fadeIn: { duration: 0.8, ease: 'easeOut' } },
  stickyText: { slideDuration: 0.6, textHeight: 100 },
  nav: { fadeIn: { duration: 0.4 } },
  mobileMenu: { animationDuration: 5 },
} as const;
```

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Build for Production
```bash
npm run build
npm start
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run type-check   # TypeScript validation
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Key Features Explained

### Scroll-Animated Galleries
Uses Framer Motion's `useScroll` and `useTransform` for GPU-accelerated animations:
- Single shared scroll listener (not per-component)
- Zero React re-renders (MotionValues bypass React state)
- Three-state animation: slide in → sticky middle → lock at bottom

### Auto-Hide Header
Smart navigation that:
- Hides when scrolling down past 100px
- Shows when scrolling up
- Always visible at page top or when menu is open
- Smooth 300ms transitions

### Dynamic Project Routes
Automatic fallback system in `src/config/projects.ts`:
- Featured projects define homepage galleries
- Missing `/work/[slug]` pages auto-generated from featured data
- Prevents 404s for internal links

## License

MIT
