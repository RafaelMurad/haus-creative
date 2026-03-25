import type { MediaSource } from "@/config/site";

/**
 * Project/Campaign Data Configuration
 *
 * Maps gallery assets to client projects for portfolio showcase pages.
 * Each project represents a campaign or client work displayed on individual pages.
 *
 * Gallery-to-project mapping follows Figma ordering:
 *   gallery1  = Marie Claire Arabia
 *   gallery2  = YSL
 *   gallery3  = Wao Cosmo (video)
 *   gallery4  = Vivara
 *   gallery5  = Bucherer Summer (video)
 *   gallery6  = SK
 *   gallery7  = BFJ
 *   gallery8  = Life
 *   gallery10 = Ouronyx (video, intro hero)
 */

export interface ProjectMedia {
  type: "image" | "video";
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
 * All projects/campaigns — ordered by Figma presentation order.
 * Ouronyx first (intro hero), then 8 named projects.
 */
export const projects: ProjectDetail[] = [
  // =========================================================================
  // Ouronyx — gallery10 (intro hero)
  // =========================================================================
  {
    id: "ouronyx",
    slug: "ouronyx",
    client: "Ouronyx",
    title: "Ouronyx",
    subtitle: "Digital Experience",
    description:
      "A premium digital experience showcasing luxury aesthetics through immersive visuals and seamless interactions.",

    heroVideo: {
      desktop: "/assets/gallery10/Gallery10-Ouronyx.mp4",
      mobile: "/assets/gallery10/Gallery10-Ouronyx-Mobile.mp4",
      poster: "/assets/gallery10/Gallery10-Cover.webp",
    },

    year: "2024",
    services: ["Digital Design", "Development", "Art Direction"],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery10/Gallery10-Cover.webp",
        alt: "Ouronyx platform showcase",
      },
    ],

    metaTitle: "Ouronyx | HAUS Creative",
    metaDescription:
      "Premium digital experience for luxury brand Ouronyx by Studio Haus Creative.",
    ogImage: "/assets/gallery10/Gallery10-Cover.webp",
  },

  // =========================================================================
  // 1. Marie Claire Arabia — gallery1
  // =========================================================================
  {
    id: "marie-claire-arabia",
    slug: "marie-claire-arabia",
    client: "Marie Claire Arabia",
    title: "Marie Claire Arabia",
    subtitle: "September Issue - Back to Work Editorial",
    description:
      "Creative direction for the September Issue Back to Work editorial, combining bold fashion statements with refined art direction.",
    introText:
      "A striking editorial for Marie Claire Arabia's September Issue, exploring the return to professional elegance through contemporary fashion photography.",

    heroImage: {
      desktop: "/assets/gallery1/Gallery1-1.webp",
      alt: "Marie Claire Arabia September Issue editorial",
    },

    year: "2024",
    services: ["Creative Direction", "Art Direction", "Editorial Design"],
    credits: [
      { role: "Art Direction", name: "Studio Haus Creative" },
      { role: "Photographer", name: "Ekin Can Bayrakdar" },
    ],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-2.webp",
        alt: "Marie Claire Arabia editorial look 1",
      },
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-3.webp",
        alt: "Marie Claire Arabia editorial look 2",
      },
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-4.webp",
        alt: "Marie Claire Arabia editorial look 3",
      },
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-5.webp",
        alt: "Marie Claire Arabia editorial look 4",
      },
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-6.jpg",
        alt: "Marie Claire Arabia editorial look 5",
      },
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-7.webp",
        alt: "Marie Claire Arabia editorial look 6",
      },
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-8.webp",
        alt: "Marie Claire Arabia editorial look 7",
      },
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-9.webp",
        alt: "Marie Claire Arabia editorial look 8",
      },
      {
        type: "image",
        desktop: "/assets/gallery1/Gallery1-10.webp",
        alt: "Marie Claire Arabia editorial look 9",
      },
    ],

    metaTitle: "Marie Claire Arabia | HAUS Creative",
    metaDescription:
      "Creative direction for Marie Claire Arabia September Issue - Back to Work Editorial by Studio Haus Creative.",
    ogImage: "/assets/gallery1/Gallery1-1.webp",
  },

  // =========================================================================
  // 2. YSL — gallery2
  // =========================================================================
  {
    id: "ysl",
    slug: "ysl",
    client: "YSL",
    title: "YSL",
    subtitle: "Art Direction",
    description:
      "Art direction for Yves Saint Laurent, crafting a visual narrative that honours the maison's heritage while pushing creative boundaries.",

    heroImage: {
      desktop: "/assets/gallery2/Gallery2-1.webp",
      alt: "YSL campaign art direction",
    },

    year: "2024",
    services: ["Art Direction", "Creative Direction", "Visual Design"],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-2.webp",
        alt: "YSL campaign image 1",
      },
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-3.webp",
        alt: "YSL campaign image 2",
      },
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-4.webp",
        alt: "YSL campaign image 3",
      },
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-5.webp",
        alt: "YSL campaign image 4",
      },
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-6.webp",
        alt: "YSL campaign image 5",
      },
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-7.webp",
        alt: "YSL campaign image 6",
      },
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-8.webp",
        alt: "YSL campaign image 7",
      },
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-9.webp",
        alt: "YSL campaign image 8",
      },
      {
        type: "image",
        desktop: "/assets/gallery2/Gallery2-10.webp",
        alt: "YSL campaign image 9",
      },
    ],

    metaTitle: "YSL | HAUS Creative",
    metaDescription:
      "Art direction for Yves Saint Laurent by Studio Haus Creative.",
    ogImage: "/assets/gallery2/Gallery2-1.webp",
  },

  // =========================================================================
  // 3. Wao Cosmo — gallery3 (video)
  // =========================================================================
  {
    id: "wao-cosmo",
    slug: "wao-cosmo",
    client: "Wao Cosmo",
    title: "Wao Cosmo",
    subtitle: "Visual Design",
    description:
      "Comprehensive visual identity and brand design for Wao Cosmo, creating a distinctive visual language across all touchpoints.",

    heroVideo: {
      desktop: "/assets/gallery3/Gallery3-Video.mp4",
      poster: "/assets/gallery3/Gallery3-Cover.webp",
    },

    year: "2024",
    services: ["Brand Strategy", "Visual Identity", "Art Direction"],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery3/Gallery3-Cover.webp",
        alt: "Wao Cosmo brand identity showcase",
      },
    ],

    metaTitle: "Wao Cosmo | HAUS Creative",
    metaDescription:
      "Visual identity and brand design for Wao Cosmo by Studio Haus Creative.",
    ogImage: "/assets/gallery3/Gallery3-Cover.webp",
  },

  // =========================================================================
  // 4. Vivara — gallery4
  // =========================================================================
  {
    id: "vivara",
    slug: "vivara",
    client: "Vivara",
    title: "Vivara",
    subtitle: "Art Direction",
    description:
      "Art direction for Vivara jewellery, creating elevated visual campaigns that capture the brand's refined elegance.",

    heroImage: {
      desktop: "/assets/gallery4/Gallery4-1.webp",
      alt: "Vivara jewellery campaign",
    },

    year: "2024",
    services: ["Art Direction", "Creative Direction", "Photography Direction"],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery4/Gallery4-2.webp",
        alt: "Vivara campaign image 1",
      },
      {
        type: "image",
        desktop: "/assets/gallery4/Gallery4-3.webp",
        alt: "Vivara campaign image 2",
      },
      {
        type: "image",
        desktop: "/assets/gallery4/Gallery4-4.webp",
        alt: "Vivara campaign image 3",
      },
      {
        type: "image",
        desktop: "/assets/gallery4/Gallery4-5.webp",
        alt: "Vivara campaign image 4",
      },
      {
        type: "image",
        desktop: "/assets/gallery4/Gallery4-6.webp",
        alt: "Vivara campaign image 5",
      },
      {
        type: "image",
        desktop: "/assets/gallery4/Gallery4-7.webp",
        alt: "Vivara campaign image 6",
      },
      {
        type: "image",
        desktop: "/assets/gallery4/Gallery4-8.webp",
        alt: "Vivara campaign image 7",
      },
    ],

    metaTitle: "Vivara | HAUS Creative",
    metaDescription:
      "Art direction for Vivara jewellery campaigns by Studio Haus Creative.",
    ogImage: "/assets/gallery4/Gallery4-1.webp",
  },

  // =========================================================================
  // 5. Bucherer Summer — gallery5 (video)
  // =========================================================================
  {
    id: "bucherer-summer",
    slug: "bucherer-summer",
    client: "Bucherer",
    title: "Bucherer Summer",
    subtitle: "Creative Direction",
    description:
      "Creative direction for Bucherer's summer campaign, bringing dynamic motion design and animation to the luxury watch and jewellery brand.",

    heroVideo: {
      desktop: "/assets/gallery5/Gallery5-Video.mp4",
      poster: "/assets/gallery5/Gallery5-Cover.webp",
    },

    year: "2024",
    services: ["Creative Direction", "Motion Design", "Animation"],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery5/Gallery5-Cover.webp",
        alt: "Bucherer Summer campaign showcase",
      },
    ],

    metaTitle: "Bucherer Summer | HAUS Creative",
    metaDescription:
      "Creative direction for Bucherer Summer campaign by Studio Haus Creative.",
    ogImage: "/assets/gallery5/Gallery5-Cover.webp",
  },

  // =========================================================================
  // 6. SK — gallery6
  // =========================================================================
  {
    id: "sk",
    slug: "sk",
    client: "SK",
    title: "SK",
    subtitle: "Brand Development",
    description:
      "Brand development and visual identity for SK, establishing a cohesive design language across all brand touchpoints.",

    heroImage: {
      desktop: "/assets/gallery6/Gallery6-1.webp",
      alt: "SK brand development",
    },

    year: "2024",
    services: ["Brand Development", "Visual Identity", "Design"],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery6/Gallery6-2.webp",
        alt: "SK brand image 1",
      },
      {
        type: "image",
        desktop: "/assets/gallery6/Gallery6-3.webp",
        alt: "SK brand image 2",
      },
      {
        type: "image",
        desktop: "/assets/gallery6/Gallery6-4.webp",
        alt: "SK brand image 3",
      },
    ],

    metaTitle: "SK | HAUS Creative",
    metaDescription:
      "Brand development and visual identity for SK by Studio Haus Creative.",
    ogImage: "/assets/gallery6/Gallery6-1.webp",
  },

  // =========================================================================
  // 7. BFJ — gallery7
  // =========================================================================
  {
    id: "bfj",
    slug: "bfj",
    client: "BFJ",
    title: "BFJ",
    subtitle: "Digital Design",
    description:
      "Digital design and creative direction for BFJ, delivering impactful visual experiences across digital platforms.",

    heroImage: {
      desktop: "/assets/gallery7/Gallery7-1.webp",
      alt: "BFJ digital design project",
    },

    year: "2024",
    services: ["Digital Design", "Creative Direction", "Art Direction"],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery7/Gallery7-2.webp",
        alt: "BFJ project image 1",
      },
      {
        type: "image",
        desktop: "/assets/gallery7/Gallery7-3.webp",
        alt: "BFJ project image 2",
      },
      {
        type: "image",
        desktop: "/assets/gallery7/Gallery7-4.webp",
        alt: "BFJ project image 3",
      },
      {
        type: "image",
        desktop: "/assets/gallery7/Gallery7-5.webp",
        alt: "BFJ project image 4",
      },
      {
        type: "image",
        desktop: "/assets/gallery7/Gallery7-6.webp",
        alt: "BFJ project image 5",
      },
      {
        type: "image",
        desktop: "/assets/gallery7/Gallery7-7.webp",
        alt: "BFJ project image 6",
      },
      {
        type: "image",
        desktop: "/assets/gallery7/Gallery7-8.webp",
        alt: "BFJ project image 7",
      },
      {
        type: "image",
        desktop: "/assets/gallery7/Gallery7-9.webp",
        alt: "BFJ project image 8",
      },
    ],

    metaTitle: "BFJ | HAUS Creative",
    metaDescription:
      "Digital design and creative direction for BFJ by Studio Haus Creative.",
    ogImage: "/assets/gallery7/Gallery7-1.webp",
  },

  // =========================================================================
  // 8. Life — gallery8
  // =========================================================================
  {
    id: "life",
    slug: "life",
    client: "Life",
    title: "Life",
    subtitle: "Creative Strategy",
    description:
      "Creative strategy and visual direction for Life, developing a compelling brand narrative through considered design.",

    heroImage: {
      desktop: "/assets/gallery8/Gallery8-1.webp",
      alt: "Life creative strategy project",
    },

    year: "2024",
    services: ["Creative Strategy", "Visual Direction", "Design"],

    media: [
      {
        type: "image",
        desktop: "/assets/gallery8/Gallery8-1.webp",
        alt: "Life project showcase",
      },
    ],

    metaTitle: "Life | HAUS Creative",
    metaDescription:
      "Creative strategy and visual direction for Life by Studio Haus Creative.",
    ogImage: "/assets/gallery8/Gallery8-1.webp",
  },
];

/**
 * Get project by slug
 */
export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Get all project slugs for static generation
 */
export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}
