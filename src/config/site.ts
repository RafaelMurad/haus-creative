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
    { title: "Linkedin", href: "https://www.linkedin.com/company/studiohauscreative" },
  ],
};

// =============================================================================
// FEATURED PROJECTS - For homepage video sections
// =============================================================================

export const featuredProjects: Project[] = [
  // 1. Ouronyx (intro hero)
  {
    id: "ouronyx",
    title: "Ouronyx",
    subtitle: "Digital Experience",
    href: "/work/ouronyx",
    media: {
      type: "video",
      src: "/assets/ouronyx/web/video.mp4",
      srcMobile: "/assets/ouronyx/mobile/video.mp4",
      poster: "/assets/ouronyx/web/OUR_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 2. Marie Claire
  {
    id: "marie-claire",
    title: "Marie Claire",
    subtitle: "Creative Direction",
    href: "/work/marie-claire",
    media: {
      type: "video",
      src: "/assets/marie-claire/web/video.mp4",
      srcMobile: "/assets/marie-claire/mobile/video.mp4",
      poster: "/assets/marie-claire/web/MC_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 3. YSL
  {
    id: "ysl",
    title: "Yves Saint Laurent",
    subtitle: "Art Direction",
    href: "/work/ysl",
    media: {
      type: "video",
      src: "/assets/ysl/web/video-01.mp4",
      srcMobile: "/assets/ysl/mobile/video-01.mp4",
      poster: "/assets/ysl/web/YSL_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 4. WAO
  {
    id: "wao",
    title: "WAO",
    subtitle: "Visual Design",
    href: "/work/wao",
    media: {
      type: "video",
      src: "/assets/wao/web/video.mp4",
      srcMobile: "/assets/wao/mobile/video.mp4",
      poster: "/assets/wao/web/WAO_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 5. Vivara
  {
    id: "vivara",
    title: "Vivara",
    subtitle: "Art Direction",
    href: "/work/vivara",
    media: {
      type: "video",
      src: "/assets/vivara/web/video.mp4",
      srcMobile: "/assets/vivara/mobile/video.mp4",
      poster: "/assets/vivara/web/VIV_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 6. Bucherer
  {
    id: "bucherer",
    title: "Bucherer",
    subtitle: "Creative Direction",
    href: "/work/bucherer",
    media: {
      type: "video",
      src: "/assets/bucherer/web/video.mp4",
      srcMobile: "/assets/bucherer/mobile/video.mp4",
      poster: "/assets/bucherer/web/BUC_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 7. SK-II
  {
    id: "sk-ii",
    title: "SK-II",
    subtitle: "Brand Development",
    href: "/work/sk-ii",
    media: {
      type: "video",
      src: "/assets/sk-ii/web/video.mp4",
      srcMobile: "/assets/sk-ii/mobile/video.mp4",
      poster: "/assets/sk-ii/web/SKII-WEB-01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 8. BFJ
  {
    id: "bfj",
    title: "BFJ",
    subtitle: "Digital Design",
    href: "/work/bfj",
    media: {
      type: "video",
      src: "/assets/bfj/web/video.mp4",
      srcMobile: "/assets/bfj/mobile/video.mp4",
      poster: "/assets/bfj/web/BUC_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 9. Life
  {
    id: "life",
    title: "Life",
    subtitle: "Creative Strategy",
    href: "/work/life",
    media: {
      type: "video",
      src: "/assets/life/web/video.mp4",
      srcMobile: "/assets/life/mobile/video.mp4",
      poster: "/assets/life/web/LIFE_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 10. Bride
  {
    id: "bride",
    title: "Bride",
    subtitle: "Art Direction",
    href: "/work/bride",
    media: {
      type: "video",
      src: "/assets/bride/web/video.mp4",
      srcMobile: "/assets/bride/mobile/video.mp4",
      poster: "/assets/bride/web/BRD_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  // 11. Harrods
  {
    id: "harrods",
    title: "Harrods",
    subtitle: "Creative Direction",
    href: "/work/harrods",
    media: {
      type: "video",
      src: "/assets/harrods/web/video-01.mp4",
      srcMobile: "/assets/harrods/mobile/video-01.mp4",
      poster: "/assets/harrods/web/HAR_WEB_01.webp",
      autoPlay: true,
      loop: true,
      muted: true,
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
