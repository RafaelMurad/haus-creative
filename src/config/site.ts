/**
 * Site Configuration
 *
 * Centralized configuration for site-wide settings.
 * Easy to customize - just update the values here.
 */

export interface NavLink {
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface SocialLink {
  title: string;
  href: string;
  icon?: string;
}

// =============================================================================
// MEDIA TYPES - Support for images, videos, and GIFs
// =============================================================================

export type MediaType = "video" | "image" | "gif";

export interface MediaSource {
  type: MediaType;
  src: string;
  srcMobile?: string;      // Optional mobile-specific source
  poster?: string;         // Poster/thumbnail for videos
  alt?: string;            // Alt text for images/gifs
  autoPlay?: boolean;      // For videos/gifs - default true
  loop?: boolean;          // For videos/gifs - default true
  muted?: boolean;         // For videos - default true
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  media: MediaSource;      // Primary media (can be video, image, or gif)
  // Legacy support - will be converted to media internally
  videoSrc?: string;
  videoSrcMobile?: string;
  posterSrc?: string;
  imageSrc?: string;
}

// Helper to determine media type from file extension
export function getMediaType(src: string): MediaType {
  const ext = src.split(".").pop()?.toLowerCase();
  if (ext === "gif") return "gif";
  if (["mp4", "webm", "ogg", "mov"].includes(ext || "")) return "video";
  return "image";
}

// Helper to create media source from legacy project format
export function createMediaSource(project: Partial<Project>): MediaSource {
  if (project.media) return project.media;

  if (project.videoSrc) {
    return {
      type: "video",
      src: project.videoSrc,
      srcMobile: project.videoSrcMobile,
      poster: project.posterSrc,
      autoPlay: true,
      loop: true,
      muted: true,
    };
  }

  if (project.imageSrc) {
    const type = getMediaType(project.imageSrc);
    return {
      type,
      src: project.imageSrc,
      alt: project.title,
      autoPlay: type === "gif",
      loop: type === "gif",
    };
  }

  // Default fallback
  return {
    type: "image",
    src: "/images/placeholder.jpg",
    alt: project.title || "Project",
  };
}

export interface SiteConfig {
  name: string;
  description: string;
  email: string;
  copyright: string;
  mainMenu: NavLink[];
  footerMenu: NavLink[];
  socialLinks: SocialLink[];
}

// =============================================================================
// SITE CONFIGURATION - Customize these values for your site
// =============================================================================

export const siteConfig: SiteConfig = {
  name: "HAUS",
  description:
    "We are a creative studio specializing in digital experiences, brand identity, and immersive design for forward-thinking brands.",
  email: "contact@studiohauscreative.com",
  copyright: `© ${new Date().getFullYear()} Haus Creative`,

  mainMenu: [
    { title: "Work", href: "/work" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],

  footerMenu: [],

  socialLinks: [
    { title: "Instagram", href: "https://www.instagram.com/vitor.milito" },
    { title: "Linkedin", href: "https://www.linkedin.com/in/vitormilito/" },
  ],
};

// =============================================================================
// FEATURED PROJECTS - For homepage video sections
// =============================================================================

// Order per Rafael 2026-07-15: Homebanner, YSL, Vivara, WAO, Harrods,
// Marie Claire, BFJ, SK-II, Life, Bride, Bucherer Summer, Ouronyx.
export const featuredProjects: Project[] = [
  // 1. Homebanner — intro hero (non-navigable; SK static until Vitor's
  // showreel edit lands, then it becomes the showreel video)
  {
    id: "sk",
    title: "SK",
    subtitle: "Brand Development",
    href: "/work/sk",
    media: {
      type: "image",
      src: "/assets/sk/sk-1.webp",
      srcMobile: "/assets/sk/sk-1-mobile.webp",
      alt: "SK brand showcase",
    },
  },
  // 2. YSL
  {
    id: "ysl",
    title: "Yves Saint Laurent",
    subtitle: "Art Direction",
    href: "/work/ysl",
    media: {
      type: "image",
      src: "/assets/ysl/ysl-1.webp",
      srcMobile: "/assets/ysl/ysl-1-mobile.webp",
      alt: "YSL art direction",
    },
  },
  // 3. Vivara
  {
    id: "vivara",
    title: "Vivara",
    subtitle: "Art Direction",
    href: "/work/vivara",
    media: {
      type: "image",
      src: "/assets/vivara/vivara-1.webp",
      srcMobile: "/assets/vivara/vivara-1-mobile.webp",
      alt: "Vivara jewellery campaign",
    },
  },
  // 4. WAO
  {
    id: "wao-cosmo",
    title: "Wao Cosmo",
    subtitle: "Visual Design",
    href: "/work/wao-cosmo",
    media: {
      type: "image",
      src: "/assets/wao-cosmo/wao-cosmo-1.webp",
      srcMobile: "/assets/wao-cosmo/wao-cosmo-1-mobile.webp",
      alt: "Wao Cosmo visual design",
    },
  },
  // 5. Harrods
  {
    id: "harrods",
    title: "Harrods",
    subtitle: "Dining Hall",
    href: "/work/harrods",
    media: {
      type: "image",
      src: "/assets/harrods/harrods-1.webp",
      srcMobile: "/assets/harrods/harrods-1-mobile.webp",
      alt: "Harrods Dining Hall",
    },
  },
  // 6. Marie Claire
  {
    id: "marie-claire-arabia",
    title: "Marie Claire Arabia",
    subtitle: "Creative Direction",
    href: "/work/marie-claire-arabia",
    media: {
      type: "image",
      src: "/assets/mc-arabia/mc-arabia-home-cover.webp",
      srcMobile: "/assets/mc-arabia/mc-arabia-hero-mobile.webp",
      alt: "Marie Claire Arabia editorial",
    },
  },
  // 7. BFJ
  {
    id: "bfj",
    title: "BFJ",
    subtitle: "Digital Design",
    href: "/work/bfj",
    media: {
      type: "image",
      src: "/assets/bfj/bfj-1.webp",
      srcMobile: "/assets/bfj/bfj-1-mobile.webp",
      alt: "BFJ project showcase",
    },
  },
  // 8. SK-II
  {
    id: "sk",
    title: "SK",
    subtitle: "Brand Development",
    href: "/work/sk",
    media: {
      type: "image",
      src: "/assets/sk/sk-1.webp",
      srcMobile: "/assets/sk/sk-1-mobile.webp",
      alt: "SK brand showcase",
    },
  },
  // 9. Life
  {
    id: "life",
    title: "Life",
    subtitle: "Creative Strategy",
    href: "/work/life",
    media: {
      type: "image",
      src: "/assets/life/life-1.webp",
      srcMobile: "/assets/life/life-1-mobile.webp",
      alt: "Life project showcase",
    },
  },
  // 10. Bride Story — tile backdrop is a text-free frame-0 still of the
  // portrait banner (the standard stills bake the "BRIDE" title, which
  // flashed before the video painted and crops in the tile).
  {
    id: "bride-story",
    title: "Bride Story",
    subtitle: "Art Direction",
    href: "/work/bride-story",
    media: {
      type: "image",
      src: "/assets/bride-story/bride-story-home-cover.webp",
      srcMobile: "/assets/bride-story/bride-story-home-cover.webp",
      alt: "Bride Story art direction",
    },
  },
  // 11. Bucherer Summer
  {
    id: "bucherer-summer",
    title: "Bucherer Summer",
    subtitle: "Creative Direction",
    href: "/work/bucherer-summer",
    media: {
      type: "image",
      src: "/assets/bucherer/bucherer-1.webp",
      srcMobile: "/assets/bucherer/bucherer-1-mobile.webp",
      alt: "Bucherer Summer campaign",
    },
  },
  // 12. Ouronyx
  {
    id: "ouronyx",
    title: "Ouronyx",
    subtitle: "Digital Experience",
    href: "/work/ouronyx",
    media: {
      type: "image",
      src: "/assets/ouronyx/ouronyx-1.webp",
      srcMobile: "/assets/ouronyx/ouronyx-1-mobile.webp",
      alt: "Ouronyx digital experience",
    },
  },
];

// =============================================================================
// CTA LINKS - For homepage call-to-action section
// =============================================================================

export const ctaLinks = [
  {
    title: "View all works",
    href: "/work",
    variant: "default" as const,
  },
  {
    title: "Work with us",
    href: "/contact",
    variant: "highlight" as const,
  },
];
