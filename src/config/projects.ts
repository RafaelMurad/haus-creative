import type { Project as FeaturedProject } from "@/config/site";
import { featuredProjects } from "@/config/site";

/**
 * Project/Campaign Data Configuration
 * 
 * Maps gallery assets to client projects for portfolio showcase pages.
 * Each project represents a campaign or client work displayed on individual pages.
 */

export interface ProjectMedia {
  type: 'image' | 'video';
  desktop: string;
  mobile?: string;
  alt: string;
  caption?: string;
}

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface ProjectDetail {
  // Identity
  id: string;
  slug: string;
  client: string;
  title: string;
  subtitle?: string;
  
  // Content
  description: string;
  introText?: string;
  
  // Hero Media
  heroVideo?: {
    desktop: string;
    mobile?: string;
    poster?: string;
  };
  heroImage?: {
    desktop: string;
    mobile?: string;
    alt: string;
  };

  // Client logo overlay on hero
  clientLogo?: string;
  
  // Metadata
  year?: string;
  services?: string[];
  credits?: ProjectCredit[];
  
  // Gallery media (ordered array)
  media: ProjectMedia[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

/**
 * All projects/campaigns
 * TODO: Populate with real client names and content as assets are updated
 */
export const projects: ProjectDetail[] = [
  {
    id: 'ouronyx',
    slug: 'ouronyx',
    client: 'Ouronyx',
    title: 'Ouronyx Digital Experience',
    subtitle: 'Luxury E-commerce Platform',
    description: 'A premium digital experience showcasing fine jewelry through immersive visuals and seamless interactions.',
    
    heroVideo: {
      desktop: '/assets/gallery10/Gallery10-Ouronyx.mp4',
      mobile: '/assets/gallery10/Gallery10-Ouronyx-Mobile.mp4',
      poster: '/assets/gallery10/Gallery10-Cover.png',
    },
    
    year: '2024',
    services: ['Digital Design', 'Development', 'Art Direction'],
    
    media: [
      {
        type: 'image',
        desktop: '/assets/gallery10/Gallery10-Cover.png',
        alt: 'Ouronyx platform showcase',
      },
    ],
    
    metaTitle: 'Ouronyx | HAUS Creative',
    metaDescription: 'Premium digital experience for luxury jewelry brand Ouronyx.',
    ogImage: '/assets/gallery10/Gallery10-Cover.png',
  },
  
  // Gallery 3 - Brand Identity
  {
    id: 'brand-identity',
    slug: 'brand-identity',
    client: 'Brand Identity Project',
    title: 'Visual Identity & Brand Design',
    subtitle: 'Brand Design',
    description: 'Comprehensive brand identity system creating a distinctive visual language across all touchpoints.',
    
    heroVideo: {
      desktop: '/assets/gallery3/Gallery3-Video.mp4',
      poster: '/assets/gallery3/Gallery3-Cover.png',
    },
    
    year: '2024',
    services: ['Brand Strategy', 'Visual Identity', 'Art Direction'],
    
    media: [
      {
        type: 'image',
        desktop: '/assets/gallery3/Gallery3-Cover.png',
        alt: 'Brand identity showcase',
      },
    ],
    
    metaTitle: 'Brand Identity | HAUS Creative',
    metaDescription: 'Comprehensive brand identity and visual design system.',
    ogImage: '/assets/gallery3/Gallery3-Cover.png',
  },
  
  // Gallery 5 - Motion Design
  {
    id: 'motion-design',
    slug: 'motion-design',
    client: 'Motion Design Project',
    title: 'Motion & Animation',
    subtitle: 'Creative Animation',
    description: 'Dynamic motion design bringing brand stories to life through fluid animations and kinetic typography.',
    
    heroVideo: {
      desktop: '/assets/gallery5/Gallery5-Video.mp4',
      poster: '/assets/gallery5/Gallery5-Cover.png',
    },
    
    year: '2024',
    services: ['Motion Design', 'Animation', 'Creative Direction'],
    
    media: [
      {
        type: 'image',
        desktop: '/assets/gallery5/Gallery5-Cover.png',
        alt: 'Motion design showcase',
      },
    ],
    
    metaTitle: 'Motion Design | HAUS Creative',
    metaDescription: 'Creative motion design and animation work.',
    ogImage: '/assets/gallery5/Gallery5-Cover.png',
  },
];

function slugFromHref(href: string): string | null {
  if (!href) return null;
  const trimmed = href.replace(/^\/+/, "");
  if (!trimmed.startsWith("work/")) return null;
  return trimmed.replace(/^work\//, "");
}

function createProjectDetailFromFeatured(featured: FeaturedProject): ProjectDetail {
  const slug = slugFromHref(featured.href);
  if (!slug) {
    throw new Error(`Invalid work href for featured project: ${featured.href}`);
  }

  const mediaAlt = featured.media.alt || `${featured.title} showcase`;
  const description = `${featured.title} experience highlighting ${featured.subtitle || "our creative capabilities"}.`;

  const baseDetail: ProjectDetail = {
    id: slug,
    slug,
    client: featured.title,
    title: featured.title,
    subtitle: featured.subtitle,
    description,
    year: new Date().getFullYear().toString(),
    services: ["Creative Direction", "Design", "Experience"],
    media: [
      {
        type: featured.media.type === "video" ? "video" : "image",
        desktop: featured.media.src,
        mobile: featured.media.srcMobile,
        alt: mediaAlt,
      },
    ],
    metaTitle: `${featured.title} | HAUS Creative`,
    metaDescription: description,
    ogImage: featured.media.poster || featured.media.src,
  };

  if (featured.media.type === "video") {
    baseDetail.heroVideo = {
      desktop: featured.media.src,
      mobile: featured.media.srcMobile,
      poster: featured.media.poster,
    };
  } else {
    baseDetail.heroImage = {
      desktop: featured.media.src,
      mobile: featured.media.srcMobile,
      alt: mediaAlt,
    };
  }

  return baseDetail;
}

const derivedFeaturedProjects: Record<string, ProjectDetail> = featuredProjects.reduce(
  (acc, featured) => {
    const slug = slugFromHref(featured.href);
    if (!slug) return acc;
    if (acc[slug] || projects.some((project) => project.slug === slug)) {
      return acc;
    }
    acc[slug] = createProjectDetailFromFeatured(featured);
    return acc;
  },
  {} as Record<string, ProjectDetail>
);

/**
 * Get project by slug
 */
export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  const existing = projects.find((project) => project.slug === slug);
  if (existing) return existing;
  return derivedFeaturedProjects[slug];
}

/**
 * Get all project slugs for static generation
 */
export function getAllProjectSlugs(): string[] {
  const baseSlugs = projects.map((project) => project.slug);
  const derivedSlugs = Object.keys(derivedFeaturedProjects);
  return Array.from(new Set([...baseSlugs, ...derivedSlugs]));
}
