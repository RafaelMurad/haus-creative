# Haus Creative - Agency Website

A premium, production-ready creative agency website built with Next.js 14. Featuring the closer.ltd-inspired design with immersive video experiences and smooth animations.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Features

- **Immersive Hero** - Full-screen video hero with play controls
- **Video Collection** - Showcase projects with auto-playing video previews
- **Responsive Layout** - Mobile-first design with smooth transitions
- **Multi-media Support** - Images, videos, and GIFs
- **Dynamic Pages** - /work, /contact, /about pages
- **Accessible** - WCAG compliant navigation and skip links

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: Custom font loading

## Project Structure

```
src/
├── app/                  # Pages
│   ├── page.tsx         # Homepage
│   ├── work/            # Work/portfolio page
│   ├── contact/         # Contact page
│   └── about/           # About page
├── components/
│   ├── home/            # Homepage components
│   │   ├── VideoHero    # Immersive video hero
│   │   ├── VideoSection # Video collection grid
│   │   └── CTALinks     # Call-to-action links
│   ├── layout/          # Layout components
│   │   ├── Header       # Navigation header
│   │   ├── Footer       # Site footer
│   │   └── MobileMenu   # Mobile navigation
│   └── ui/              # UI primitives
│       ├── Logo         # Site logo
│       └── MediaRenderer# Video/image/gif renderer
└── config/
    └── site.ts          # Site configuration
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

## Related Branches

This is the **stable production website**. Other branches contain:

| Branch | Purpose |
|--------|---------|
| `cms-studio` | CMS builder application (separate repo) |
| `cms-playground` | CMS integration testing |
| `learning-lab` | Web development learning guides |
| `freelance-framework` | Project bootstrap framework |

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production
npm run lint     # ESLint
npm test         # Run tests
```

## License

MIT
