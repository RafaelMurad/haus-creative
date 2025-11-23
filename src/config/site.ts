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
  email: "hello@haus-creative.com",
  copyright: `© ${new Date().getFullYear()} Haus Creative`,

  mainMenu: [
    { title: "Work", href: "/work" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],

  footerMenu: [
    { title: "Careers", href: "/contact#careers" },
  ],

  socialLinks: [
    { title: "Instagram", href: "https://www.instagram.com/haus.creative" },
    { title: "LinkedIn", href: "https://www.linkedin.com/company/haus-creative" },
  ],
};

// =============================================================================
// FEATURED PROJECTS - For homepage video sections
// =============================================================================

export const featuredProjects: Project[] = [
  {
    id: "ouronyx",
    title: "Ouronyx",
    subtitle: "Digital Experience",
    href: "/work/ouronyx",
    media: {
      type: "video",
      src: "/assets/gallery10/Gallery10-Ouronyx.mp4",
      srcMobile: "/assets/gallery10/Gallery10-Ouronyx-Mobile.mp4",
      poster: "/assets/gallery10/Gallery10-Cover.png",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  {
    id: "gallery-1",
    title: "Gallery One",
    subtitle: "Creative Direction",
    href: "/work/gallery-1",
    media: {
      type: "image",
      src: "/assets/gallery1/Gallery1-1.png",
      alt: "Gallery One showcase",
    },
  },
  {
    id: "gallery-2",
    title: "Gallery Two",
    subtitle: "Visual Identity",
    href: "/work/gallery-2",
    media: {
      type: "image",
      src: "/assets/gallery2/Gallery2-1.png",
      alt: "Gallery Two showcase",
    },
  },
  {
    id: "gallery-3",
    title: "Brand Identity",
    subtitle: "Visual Design",
    href: "/work/brand-identity",
    media: {
      type: "video",
      src: "/assets/gallery3/Gallery3-Video.mp4",
      poster: "/assets/gallery3/Gallery3-Cover.png",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  {
    id: "gallery-4",
    title: "Gallery Four",
    subtitle: "Art Direction",
    href: "/work/gallery-4",
    media: {
      type: "image",
      src: "/assets/gallery4/Gallery4-1.png",
      alt: "Gallery Four showcase",
    },
  },
  {
    id: "gallery-5",
    title: "Motion Design",
    subtitle: "Animation",
    href: "/work/motion-design",
    media: {
      type: "video",
      src: "/assets/gallery5/Gallery5-Video.mp4",
      poster: "/assets/gallery5/Gallery5-Cover.png",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  {
    id: "gallery-6",
    title: "Gallery Six",
    subtitle: "Brand Development",
    href: "/work/gallery-6",
    media: {
      type: "image",
      src: "/assets/gallery6/Gallery6-1.png",
      alt: "Gallery Six showcase",
    },
  },
  {
    id: "gallery-7",
    title: "Gallery Seven",
    subtitle: "Digital Design",
    href: "/work/gallery-7",
    media: {
      type: "image",
      src: "/assets/gallery7/Gallery7-1.png",
      alt: "Gallery Seven showcase",
    },
  },
  {
    id: "gallery-8",
    title: "Gallery Eight",
    subtitle: "Creative Strategy",
    href: "/work/gallery-8",
    media: {
      type: "image",
      src: "/assets/gallery8/Gallery8-1.png",
      alt: "Gallery Eight showcase",
    },
  },
  {
    id: "gallery-9",
    title: "Gallery Nine",
    subtitle: "Motion Graphics",
    href: "/work/gallery-9",
    media: {
      type: "video",
      src: "/assets/gallery9/Gallery9-Video.mp4",
      poster: "/assets/gallery9/Gallery9-Cover.png",
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
  {
    id: "gallery-11",
    title: "Gallery Eleven",
    subtitle: "Brand Experience",
    href: "/work/gallery-11",
    media: {
      type: "image",
      src: "/assets/gallery11/Gallery11-1.png",
      alt: "Gallery Eleven showcase",
    },
  },
  {
    id: "gallery-12",
    title: "Gallery Twelve",
    subtitle: "Visual Communication",
    href: "/work/gallery-12",
    media: {
      type: "image",
      src: "/assets/gallery12/Gallery12-1.png",
      alt: "Gallery Twelve showcase",
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
