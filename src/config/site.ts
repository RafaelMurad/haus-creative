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
    { title: "Instagram", href: "https://www.instagram.com/studiohauscreative" },
    { title: "LinkedIn", href: "https://www.linkedin.com/company/studiohauscreative" },
  ],
};

// =============================================================================
// FEATURED PROJECTS - For homepage video sections
// =============================================================================

export const featuredProjects: Project[] = [
  // Hero — Ouronyx (intro hero, not shown in work listing grid)
  {
    id: "ouronyx",
    title: "Ouronyx",
    subtitle: "Digital Experience",
    href: "/work/ouronyx",
    media: {
      type: "video",
      src: "/assets/gallery10/Gallery10-Ouronyx.mp4",
      srcMobile: "/assets/gallery10/Gallery10-Ouronyx-Mobile.mp4",
      poster: "/assets/gallery10/Gallery10-Cover.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 1. Marie Claire Arabia
  {
    id: "marie-claire-arabia",
    title: "Marie Claire Arabia",
    subtitle: "Creative Direction",
    href: "/work/marie-claire-arabia",
    media: {
      type: "image",
      src: "/assets/gallery1/Gallery1-1.webp",
      alt: "Marie Claire Arabia editorial",
    },
  },
  // 2. YSL
  {
    id: "ysl",
    title: "YSL",
    subtitle: "Art Direction",
    href: "/work/ysl",
    media: {
      type: "image",
      src: "/assets/gallery2/Gallery2-1.webp",
      alt: "YSL campaign",
    },
  },
  // 3. Wao Cosmo
  {
    id: "wao-cosmo",
    title: "Wao Cosmo",
    subtitle: "Visual Design",
    href: "/work/wao-cosmo",
    media: {
      type: "video",
      src: "/assets/gallery3/Gallery3-Video.mp4",
      poster: "/assets/gallery3/Gallery3-Cover.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 4. Vivara
  {
    id: "vivara",
    title: "Vivara",
    subtitle: "Art Direction",
    href: "/work/vivara",
    media: {
      type: "image",
      src: "/assets/gallery4/Gallery4-1.webp",
      alt: "Vivara jewellery campaign",
    },
  },
  // 5. Bucherer Summer
  {
    id: "bucherer-summer",
    title: "Bucherer Summer",
    subtitle: "Creative Direction",
    href: "/work/bucherer-summer",
    media: {
      type: "video",
      src: "/assets/gallery5/Gallery5-Video.mp4",
      poster: "/assets/gallery5/Gallery5-Cover.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 6. SK
  {
    id: "sk",
    title: "SK",
    subtitle: "Brand Development",
    href: "/work/sk",
    media: {
      type: "image",
      src: "/assets/gallery6/Gallery6-1.webp",
      alt: "SK brand showcase",
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
      src: "/assets/gallery7/Gallery7-1.webp",
      alt: "BFJ project showcase",
    },
  },
  // 8. Life
  {
    id: "life",
    title: "Life",
    subtitle: "Creative Strategy",
    href: "/work/life",
    media: {
      type: "image",
      src: "/assets/gallery8/Gallery8-1.webp",
      alt: "Life project showcase",
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
