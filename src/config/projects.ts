import type { MediaSource } from "@/config/site";
import type { CarouselConfig } from "@/types/carousel";

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
 *   gallery9  = Ouronyx (video, intro hero)
 *   gallery10 = Bride Story
 *   gallery11 = Harrods
 */

/**
 * Gallery layout frame types — controls how each media item is rendered.
 *
 * - `mask`       Edge-to-edge image, no background (default)
 * - `inset`      Image padded inside a coloured background container
 * - `phone`      Phone device mockup with rounded-corner CSS frame on blue bg
 * - `colorFrame` Solid colour background behind the image
 */
export type GalleryFrame = "mask" | "inset" | "phone" | "colorFrame";

export interface ProjectMedia {
  type: "image" | "video";
  desktop: string;
  mobile?: string;
  alt: string;

  /** Poster image for video items — shown before playback starts. */
  poster?: string;

  /** Layout span: 'full' = full width, 'half' = 50% (paired). Defaults to 'half'. */
  span?: "full" | "half";

  /** Frame presentation style. Defaults to 'mask'. */
  frame?: GalleryFrame;

  /** Background colour for inset/colorFrame/phone containers (e.g. '#1500FF'). */
  bgColor?: string;

  /** CSS object-position override for images (e.g. 'top', 'center bottom'). Defaults to 'center'. */
  objectPosition?: string;

  /**
   * Extra whitespace above this item's row.
   * - `true` — 150 desktop / 60 mobile.
   * - `number` — desktop px; mobile scales to ~40%.
   * - `{ mobile, desktop }` — explicit per-breakpoint values.
   * Overrides the project's `fullRowSpacing` for this row only.
   */
  spaceBefore?: boolean | number | { mobile: number; desktop: number };
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
    /** CSS object-position for cropping (e.g. 'top', 'center 20%'). Defaults to 'center'. */
    objectPosition?: string;
    /** CSS object-fit override (e.g. 'contain' to show full video without cropping). Defaults to 'cover'. */
    objectFit?: "cover" | "contain";
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
  credits?: ProjectCredit[];

  // Gallery media (ordered array)
  media: ProjectMedia[];

  /**
   * Padding (px) applied to both sides of each full-width gallery row.
   *
   * - `number` — desktop px; mobile scales to ~40% (legacy default behavior).
   * - `{ mobile, desktop }` — explicit per-breakpoint values, for projects where
   *   desktop images bake whitespace in but mobile images don't (e.g. YSL, where
   *   desktop is flush 0 but mobile needs ~60).
   *
   * Defaults to 150 (desktop) / 60 (mobile), matching MC Arabia.
   */
  fullRowSpacing?: number | { mobile: number; desktop: number };

  /** Carousel/gallery presentation settings (animation, timing, homepage selection). */
  carousel?: CarouselConfig;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

/**
 * All projects/campaigns — ordered by Figma canvas position.
 */
export const projects: ProjectDetail[] = [
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

    // heroVideo available but disabled until landscape version is provided:
    // heroVideo: {
    //   desktop: "/assets/mc-arabia/mc-arabia-hero-video.mp4",
    //   mobile: "/assets/mc-arabia/mc-arabia-hero-video-mobile.mp4",
    //   poster: "/assets/mc-arabia/mc-arabia-hero.webp",
    // },

    heroImage: {
      desktop: "/assets/mc-arabia/mc-arabia-hero.webp",
      mobile: "/assets/mc-arabia/mc-arabia-hero-mobile.webp",
      alt: "Marie Claire Arabia September Issue editorial",
    },

    clientLogo: "/assets/mc-arabia/mc-arabia-logo.webp",

    year: "2024",
    credits: [
      { role: "Art Direction", name: "Vitor Milito (Studio Haus)" },
      { role: "Photographer", name: "Ekin Can Bayrakdar" },
      { role: "Stylist", name: "Rachel Davis" },
      { role: "Make Up", name: "Kenny Leung" },
      { role: "Hair Stylist", name: "Christopher Gatt" },
      { role: "Casting Director", name: "Lewis Water" },
      { role: "Model", name: "Aishwarya Gupta" },
      { role: "Post Production", name: "Retush" },
    ],

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-2.webp",
        mobile: "/assets/mc-arabia/mc-arabia-2-mobile.webp",
        alt: "mc-arabia gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-3.webp",
        mobile: "/assets/mc-arabia/mc-arabia-3-mobile.webp",
        alt: "mc-arabia gallery image 2",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-4.webp",
        mobile: "/assets/mc-arabia/mc-arabia-4-mobile.webp",
        alt: "mc-arabia gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-5.webp",
        mobile: "/assets/mc-arabia/mc-arabia-5-mobile.webp",
        alt: "mc-arabia gallery image 4",
      },
      // Row 3: full width
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-6.webp",
        mobile: "/assets/mc-arabia/mc-arabia-6-mobile.webp",
        alt: "mc-arabia gallery image 5",
        span: "full",
      },
      // Row 4: half pair
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-7.webp",
        mobile: "/assets/mc-arabia/mc-arabia-7-mobile.webp",
        alt: "mc-arabia gallery image 6",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-8.webp",
        mobile: "/assets/mc-arabia/mc-arabia-8-mobile.webp",
        alt: "mc-arabia gallery image 7",
      },
      // Row 5: half pair
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-9.webp",
        mobile: "/assets/mc-arabia/mc-arabia-9-mobile.webp",
        alt: "mc-arabia gallery image 8",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-10.webp",
        mobile: "/assets/mc-arabia/mc-arabia-10-mobile.webp",
        alt: "mc-arabia gallery image 9",
      },
      // Row 6: full width
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-11.webp",
        mobile: "/assets/mc-arabia/mc-arabia-11-mobile.webp",
        alt: "mc-arabia gallery image 10",
        span: "full",
        objectPosition: "top",
      },
    ],

    metaTitle: "Marie Claire Arabia | HAUS Creative",
    metaDescription:
      "Creative direction for Marie Claire Arabia September Issue - Back to Work Editorial by Studio Haus Creative.",
    ogImage: "/assets/mc-arabia/mc-arabia-hero.webp",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 2000,
    },
  },

  // =========================================================================
  // 2. YSL — gallery2
  // =========================================================================
  {
    id: "ysl",
    slug: "ysl",
    client: "YSL",
    title: "Yves Saint Laurent",
    // Desktop EXPORT images bake in their own whitespace (so 0); mobile
    // images are edge-to-edge 440px crops and need explicit row gaps that
    // match Figma's mobile layout spacing between full-width rows.
    fullRowSpacing: { mobile: 60, desktop: 0 },
    subtitle: "Art Direction",
    description:
      "Art direction for Yves Saint Laurent, crafting a visual narrative that honours the maison's heritage while pushing creative boundaries.",

    heroImage: {
      desktop: "/assets/ysl/ysl-1.webp",
      mobile: "/assets/ysl/ysl-1-mobile.webp",
      alt: "YSL campaign art direction",
    },

    year: "2024",

    media: [
      // Row 1: full-width image
      {
        type: "image",
        desktop: "/assets/ysl/ysl-2.webp",
        mobile: "/assets/ysl/ysl-2-mobile.webp",
        alt: "YSL campaign full 1",
        span: "full",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/ysl/ysl-3.webp",
        mobile: "/assets/ysl/ysl-3-mobile.webp",
        alt: "YSL campaign image 1",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-4.webp",
        mobile: "/assets/ysl/ysl-4-mobile.webp",
        alt: "YSL campaign image 2",
      },
      // Row 3: full-width image
      {
        type: "image",
        desktop: "/assets/ysl/ysl-5.webp",
        mobile: "/assets/ysl/ysl-5-mobile.webp",
        alt: "YSL campaign full 2",
        span: "full",
      },
      // Row 4: half pair
      {
        type: "image",
        desktop: "/assets/ysl/ysl-6.webp",
        mobile: "/assets/ysl/ysl-6-mobile.webp",
        alt: "YSL campaign image 3",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-7.webp",
        mobile: "/assets/ysl/ysl-7-mobile.webp",
        alt: "YSL campaign image 4",
      },
      // Row 5: full-width image
      {
        type: "image",
        desktop: "/assets/ysl/ysl-8.webp",
        mobile: "/assets/ysl/ysl-8-mobile.webp",
        alt: "YSL campaign full 3",
        span: "full",
      },
      // Row 6: half pair
      {
        type: "image",
        desktop: "/assets/ysl/ysl-9.webp",
        mobile: "/assets/ysl/ysl-9-mobile.webp",
        alt: "YSL campaign image 5",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-10.webp",
        alt: "YSL campaign image 6",
      },
      // Row 7: full-width image — flush (no auto row padding) per-item override.
      // `spaceBefore: 0` overrides `fullRowSpacing` for this row only.
      {
        type: "image",
        desktop: "/assets/ysl/ysl-11.webp",
        mobile: "/assets/ysl/ysl-11-mobile.webp",
        alt: "YSL campaign full 4",
        span: "full",
        spaceBefore: 0,
      },
      // Row 8: half pair
      {
        type: "image",
        desktop: "/assets/ysl/ysl-12.webp",
        mobile: "/assets/ysl/ysl-12-mobile.webp",
        alt: "YSL campaign image 7",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-13.webp",
        mobile: "/assets/ysl/ysl-13-mobile.webp",
        alt: "YSL campaign image 8",
      },
    ],

    metaTitle: "YSL | HAUS Creative",
    metaDescription:
      "Art direction for Yves Saint Laurent by Studio Haus Creative.",
    ogImage: "/assets/ysl/ysl-1.webp",

    carousel: {
      animation: "none",
      autoAdvanceTime: 800,
    },
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
      desktop: "/assets/wao-cosmo/wao-cosmo-video.mp4",
      poster: "/assets/wao-cosmo/wao-cosmo-cover.webp",
    },

    heroImage: {
      desktop: "/assets/wao-cosmo/wao-cosmo-1.webp",
      mobile: "/assets/wao-cosmo/wao-cosmo-1-mobile.webp",
      alt: "wao-cosmo hero",
    },

    year: "2024",

    credits: [
      { role: "Art Direction", name: "Vitor Milito (Studio Haus)" },
      { role: "Photographer", name: "Ekin Can Bayrakdar" },
      { role: "Stylist", name: "Rachel Davis" },
      { role: "Make Up", name: "Kenny Leung" },
      { role: "Hair Stylist", name: "Christopher Gatt" },
      { role: "Casting Director", name: "Lewis Water" },
      { role: "Model", name: "Aishwarya Gupta" },
      { role: "Post Production", name: "Retush" },
    ],

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-2.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-2-mobile.webp",
        alt: "wao-cosmo gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-3.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-3-mobile.webp",
        alt: "wao-cosmo gallery image 2",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-4.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-5-mobile.webp",
        alt: "wao-cosmo gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-5.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-4-mobile.webp",
        alt: "wao-cosmo gallery image 4",
      },
      // Row 3: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-6.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-8-mobile.webp",
        alt: "wao-cosmo gallery image 5",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-7.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-9-mobile.webp",
        alt: "wao-cosmo gallery image 6",
      },
      // Row 4: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-8.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-13-mobile.webp",
        alt: "wao-cosmo gallery image 7",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-9.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-12-mobile.webp",
        alt: "wao-cosmo gallery image 8",
      },
      // Row 5: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-10.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-14-mobile.webp",
        alt: "wao-cosmo gallery image 9",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-11.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-15-mobile.webp",
        alt: "wao-cosmo gallery image 10",
      },
      // Row 6: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-12.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-16-mobile.webp",
        alt: "wao-cosmo gallery image 11",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-13.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-17-mobile.webp",
        alt: "wao-cosmo gallery image 12",
      },
      // Row 7: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-14.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-19-mobile.webp",
        alt: "wao-cosmo gallery image 13",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-15.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-18-mobile.webp",
        alt: "wao-cosmo gallery image 14",
      },
      // Row 8: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-16.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-21-mobile.webp",
        alt: "wao-cosmo gallery image 15",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-17.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-20-mobile.webp",
        alt: "wao-cosmo gallery image 16",
      },
      // Row 9: half pair
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-18.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-23-mobile.webp",
        alt: "wao-cosmo gallery image 17",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-19.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-22-mobile.webp",
        alt: "wao-cosmo gallery image 18",
      },
    ],

    metaTitle: "Wao Cosmo | HAUS Creative",
    metaDescription:
      "Visual identity and brand design for Wao Cosmo by Studio Haus Creative.",
    ogImage: "/assets/wao-cosmo/wao-cosmo-1.webp",

    carousel: {
      animation: "none",
      // No autoAdvanceTime — video loops continuously
    },
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

    // Figma gaps: 156px between full-width and pair rows; consecutive pairs are flush.
    fullRowSpacing: 156,

    heroImage: {
      desktop: "/assets/vivara/vivara-1.webp",
      mobile: "/assets/vivara/vivara-1-mobile.webp",
      alt: "vivara hero",
    },

    year: "2024",

    media: [
      // Row 1: half pair — VIV_WEB_02 + VIV_WEB_03
      {
        type: "image",
        desktop: "/assets/vivara/vivara-2.webp",
        mobile: "/assets/vivara/vivara-2-mobile.webp",
        alt: "vivara gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-3.webp",
        mobile: "/assets/vivara/vivara-3-mobile.webp",
        alt: "vivara gallery image 2",
      },
      // Row 2: full width — VIV_WEB_04
      {
        type: "image",
        desktop: "/assets/vivara/vivara-4.webp",
        mobile: "/assets/vivara/vivara-4-mobile.webp",
        alt: "vivara gallery image 3",
        span: "full",
      },
      // Row 3: half pair — VIV_WEB_05 + VIV_WEB_06
      {
        type: "image",
        desktop: "/assets/vivara/vivara-5.webp",
        mobile: "/assets/vivara/vivara-5-mobile.webp",
        alt: "vivara gallery image 4",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-6.webp",
        mobile: "/assets/vivara/vivara-6-mobile.webp",
        alt: "vivara gallery image 5",
      },
      // Row 4: half pair — VIV_WEB_07 + VIV_WEB_08
      // Note: vivara-7/8 desktop↔mobile refs are intentionally cross-named;
      // dimensions confirm the content matches (vivara-7 desktop 1074×1922 =
      // vivara-8-mobile 1074×1922).
      {
        type: "image",
        desktop: "/assets/vivara/vivara-7.webp",
        mobile: "/assets/vivara/vivara-8-mobile.webp",
        alt: "vivara gallery image 6",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-8.webp",
        mobile: "/assets/vivara/vivara-7-mobile.webp",
        alt: "vivara gallery image 7",
      },
      // Row 5: full width — VIV_WEB_09
      {
        type: "image",
        desktop: "/assets/vivara/vivara-9.webp",
        mobile: "/assets/vivara/vivara-9-mobile.webp",
        alt: "vivara gallery image 8",
        span: "full",
      },
      // Row 6: half pair — VIV_WEB_10 + VIV_WEB_11
      {
        type: "image",
        desktop: "/assets/vivara/vivara-10.webp",
        mobile: "/assets/vivara/vivara-10-mobile.webp",
        alt: "vivara gallery image 9",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-11.webp",
        mobile: "/assets/vivara/vivara-11-mobile.webp",
        alt: "vivara gallery image 10",
      },
      // Row 7: half pair — VIV_WEB_12 + VIV_WEB_13
      {
        type: "image",
        desktop: "/assets/vivara/vivara-12.webp",
        mobile: "/assets/vivara/vivara-12-mobile.webp",
        alt: "vivara gallery image 11",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-13.webp",
        mobile: "/assets/vivara/vivara-13-mobile.webp",
        alt: "vivara gallery image 12",
      },
      // Row 8: full width — VIV_WEB_14
      {
        type: "image",
        desktop: "/assets/vivara/vivara-14.webp",
        mobile: "/assets/vivara/vivara-14-mobile.webp",
        alt: "vivara gallery image 13",
        span: "full",
      },
      // Row 9: half pair — VIV_WEB_15 + VIV_WEB_16
      {
        type: "image",
        desktop: "/assets/vivara/vivara-15.webp",
        mobile: "/assets/vivara/vivara-15-mobile.webp",
        alt: "vivara gallery image 14",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-16.webp",
        mobile: "/assets/vivara/vivara-16-mobile.webp",
        alt: "vivara gallery image 15",
      },
      // Row 10: half pair — VIV_WEB_17 + VIV_WEB_18
      {
        type: "image",
        desktop: "/assets/vivara/vivara-17.webp",
        mobile: "/assets/vivara/vivara-17-mobile.webp",
        alt: "vivara gallery image 16",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-18.webp",
        // vivara-18-mobile.webp not in EXPORT — desktop serves as fallback
        alt: "vivara gallery image 17",
      },
    ],

    metaTitle: "Vivara | HAUS Creative",
    metaDescription:
      "Art direction for Vivara jewellery campaigns by Studio Haus Creative.",
    ogImage: "/assets/vivara/vivara-1.webp",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 1000,
    },
  },

  // =========================================================================
  // 5. Life — gallery5
  // =========================================================================
  {
    id: "life",
    slug: "life",
    client: "Life",
    title: "Life",
    subtitle: "Creative Strategy",
    description:
      "Creative strategy and visual direction for Life, developing a compelling brand narrative through considered design.",

    // Figma gaps: 150px between full-width and pair rows; consecutive pairs are flush.
    fullRowSpacing: 150,

    heroImage: {
      desktop: "/assets/life/life-1.webp",
      mobile: "/assets/life/life-1-mobile.webp",
      alt: "life hero",
    },

    year: "2024",

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/life/life-2.webp",
        mobile: "/assets/life/life-3-mobile.webp",
        alt: "life gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/life/life-3.webp",
        mobile: "/assets/life/life-2-mobile.webp",
        alt: "life gallery image 2",
      },
      // Row 2: half pair (flush)
      {
        type: "image",
        desktop: "/assets/life/life-4.webp",
        mobile: "/assets/life/life-4-mobile.webp",
        alt: "life gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/life/life-5.webp",
        mobile: "/assets/life/life-5-mobile.webp",
        alt: "life gallery image 4",
      },
      // Row 3: full width (1919×1079 landscape)
      {
        type: "image",
        desktop: "/assets/life/life-6.webp",
        mobile: "/assets/life/life-6-mobile.webp",
        alt: "life gallery image 5",
        span: "full",
      },
      // Row 4: half pair — both portrait
      {
        type: "image",
        desktop: "/assets/life/life-7.webp",
        mobile: "/assets/life/life-8-mobile.webp",
        alt: "life gallery image 6",
      },
      {
        type: "image",
        desktop: "/assets/life/life-10.webp",
        mobile: "/assets/life/life-10-mobile.webp",
        alt: "life gallery image 7",
      },
      // Row 5: half pair (flush) — both portrait
      {
        type: "image",
        desktop: "/assets/life/life-11.webp",
        mobile: "/assets/life/life-11-mobile.webp",
        alt: "life gallery image 8",
      },
      {
        type: "image",
        desktop: "/assets/life/life-12.webp",
        mobile: "/assets/life/life-13-mobile.webp",
        alt: "life gallery image 9",
      },
      // Row 6: full width (1919×1079 landscape)
      {
        type: "image",
        desktop: "/assets/life/life-8.webp",
        mobile: "/assets/life/life-7-mobile.webp",
        alt: "life gallery image 10",
        span: "full",
      },
      // Row 7: full width (1919×1079 landscape)
      {
        type: "image",
        desktop: "/assets/life/life-9.webp",
        mobile: "/assets/life/life-9-mobile.webp",
        alt: "life gallery image 11",
        span: "full",
      },
      // Row 8: half pair
      {
        type: "image",
        desktop: "/assets/life/life-13.webp",
        mobile: "/assets/life/life-12-mobile.webp",
        alt: "life gallery image 12",
      },
      {
        type: "image",
        desktop: "/assets/life/life-14.webp",
        mobile: "/assets/life/life-15-mobile.webp",
        alt: "life gallery image 13",
      },
      // Row 9: lone portrait — no pair partner in EXPORT; renders as full-width
      {
        type: "image",
        desktop: "/assets/life/life-15.webp",
        mobile: "/assets/life/life-14-mobile.webp",
        alt: "life gallery image 14",
        span: "full",
      },
    ],

    metaTitle: "Life | HAUS Creative",
    metaDescription:
      "Creative strategy and visual direction for Life by Studio Haus Creative.",
    ogImage: "/assets/life/life-1.webp",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 3000,
    },
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
      desktop: "/assets/sk/sk-1.webp",
      mobile: "/assets/sk/sk-1-mobile.webp",
      alt: "sk hero",
    },

    year: "2024",

    credits: [
      { role: "Art Direction", name: "Vitor Milito (Studio Haus)" },
      { role: "Photographer", name: "Ekin Can Bayrakdar" },
      { role: "Stylist", name: "Rachel Davis" },
      { role: "Make Up", name: "Kenny Leung" },
      { role: "Hair Stylist", name: "Christopher Gatt" },
      { role: "Casting Director", name: "Lewis Water" },
      { role: "Model", name: "Aishwarya Gupta" },
      { role: "Post Production", name: "Retush" },
    ],

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/sk/sk-2.webp",
        mobile: "/assets/sk/sk-2-mobile.webp",
        alt: "sk gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-3.webp",
        mobile: "/assets/sk/sk-3-mobile.webp",
        alt: "sk gallery image 2",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/sk/sk-4.webp",
        mobile: "/assets/sk/sk-5-mobile.webp",
        alt: "sk gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-5.webp",
        mobile: "/assets/sk/sk-4-mobile.webp",
        alt: "sk gallery image 4",
      },
      // Row 3: half pair
      {
        type: "image",
        desktop: "/assets/sk/sk-6.webp",
        mobile: "/assets/sk/sk-6-mobile.webp",
        alt: "sk gallery image 5",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-7.webp",
        mobile: "/assets/sk/sk-7-mobile.webp",
        alt: "sk gallery image 6",
      },
      // Row 4: full width
      {
        type: "image",
        desktop: "/assets/sk/sk-8.webp",
        mobile: "/assets/sk/sk-8-mobile.webp",
        alt: "sk gallery image 7",
        span: "full",
      },
      // Row 5: half pair
      {
        type: "image",
        desktop: "/assets/sk/sk-9.webp",
        mobile: "/assets/sk/sk-9-mobile.webp",
        alt: "sk gallery image 8",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-10.webp",
        mobile: "/assets/sk/sk-10-mobile.webp",
        alt: "sk gallery image 9",
      },
      // Row 6: half pair
      {
        type: "image",
        desktop: "/assets/sk/sk-11.webp",
        mobile: "/assets/sk/sk-12-mobile.webp",
        alt: "sk gallery image 10",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-12.webp",
        mobile: "/assets/sk/sk-11-mobile.webp",
        alt: "sk gallery image 11",
      },
      // Row 7: full width
      {
        type: "image",
        desktop: "/assets/sk/sk-13.webp",
        mobile: "/assets/sk/sk-13-mobile.webp",
        alt: "sk gallery image 12",
        span: "full",
      },
      // Row 8: half pair
      {
        type: "image",
        desktop: "/assets/sk/sk-14.webp",
        mobile: "/assets/sk/sk-14-mobile.webp",
        alt: "sk gallery image 13",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-15.webp",
        mobile: "/assets/sk/sk-16-mobile.webp",
        alt: "sk gallery image 14",
      },
      // Row 9: full width
      {
        type: "image",
        desktop: "/assets/sk/sk-16.webp",
        mobile: "/assets/sk/sk-15-mobile.webp",
        alt: "sk gallery image 15",
        span: "full",
      },
    ],

    metaTitle: "SK | HAUS Creative",
    metaDescription:
      "Brand development and visual identity for SK by Studio Haus Creative.",
    ogImage: "/assets/sk/sk-1.webp",

    carousel: {
      animation: "slide",
      autoAdvanceTime: 2500,
    },
  },

  // =========================================================================
  // 7. Bucherer Summer — gallery7
  // =========================================================================
  {
    id: "bucherer-summer",
    slug: "bucherer-summer",
    client: "Bucherer",
    title: "Bucherer Summer",
    subtitle: "Creative Direction",
    description:
      "Creative direction for Bucherer's summer campaign, bringing dynamic motion design and animation to the luxury watch and jewellery brand.",

    heroImage: {
      desktop: "/assets/bucherer/bucherer-1-mobile.webp",
      mobile: "/assets/bucherer/bucherer-1-mobile.webp",
      alt: "bucherer hero",
    },

    year: "2024",

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-2.webp",
        mobile: "/assets/bucherer/bucherer-2-mobile.webp",
        alt: "bucherer gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-3.webp",
        mobile: "/assets/bucherer/bucherer-3-mobile.webp",
        alt: "bucherer gallery image 2",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-4.webp",
        mobile: "/assets/bucherer/bucherer-4-mobile.webp",
        alt: "bucherer gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-5.webp",
        mobile: "/assets/bucherer/bucherer-5-mobile.webp",
        alt: "bucherer gallery image 4",
      },
      // Row 3: half pair
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-6.webp",
        mobile: "/assets/bucherer/bucherer-6-mobile.webp",
        alt: "bucherer gallery image 5",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-7.webp",
        mobile: "/assets/bucherer/bucherer-7-mobile.webp",
        alt: "bucherer gallery image 6",
      },
      // Row 4: half pair
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-8.webp",
        mobile: "/assets/bucherer/bucherer-8-mobile.webp",
        alt: "bucherer gallery image 7",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-9-mobile.webp",
        mobile: "/assets/bucherer/bucherer-9-mobile.webp",
        alt: "bucherer gallery image 8",
      },
    ],

    credits: [
      { role: "Art Direction", name: "Vitor Milito (Studio Haus)" },
      { role: "Photographer", name: "Ekin Can Bayrakdar" },
      { role: "Stylist", name: "Rachel Davis" },
      { role: "Make Up", name: "Kenny Leung" },
      { role: "Hair Stylist", name: "Christopher Gatt" },
      { role: "Casting Director", name: "Lewis Water" },
      { role: "Model", name: "Aishwarya Gupta" },
      { role: "Post Production", name: "Retush" },
    ],

    metaTitle: "Bucherer Summer | HAUS Creative",
    metaDescription:
      "Creative direction for Bucherer Summer campaign by Studio Haus Creative.",
    ogImage: "/assets/bucherer/bucherer-1.webp",

    carousel: {
      animation: "none",
    },
  },

  // =========================================================================
  // 8. BFJ — gallery8
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
      desktop: "/assets/bfj/bfj-1.webp",
      alt: "bfj hero",
    },

    year: "2024",

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/bfj/bfj-2.webp",
        mobile: "/assets/bfj/bfj-2-mobile.webp",
        alt: "bfj gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-3.webp",
        mobile: "/assets/bfj/bfj-3-mobile.webp",
        alt: "bfj gallery image 2",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/bfj/bfj-4.webp",
        mobile: "/assets/bfj/bfj-4-mobile.webp",
        alt: "bfj gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-5.webp",
        mobile: "/assets/bfj/bfj-5-mobile.webp",
        alt: "bfj gallery image 4",
      },
      // Row 3: full width
      {
        type: "image",
        desktop: "/assets/bfj/bfj-6.webp",
        mobile: "/assets/bfj/bfj-6-mobile.webp",
        alt: "bfj gallery image 5",
        span: "full",
      },
      // Row 4: full width
      {
        type: "image",
        desktop: "/assets/bfj/bfj-7.webp",
        mobile: "/assets/bfj/bfj-7-mobile.webp",
        alt: "bfj gallery image 6",
        span: "full",
      },
      // Row 5: half pair
      {
        type: "image",
        desktop: "/assets/bfj/bfj-8.webp",
        alt: "bfj gallery image 7",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-9.webp",
        mobile: "/assets/bfj/bfj-8-mobile.webp",
        alt: "bfj gallery image 8",
      },
      // Row 6: half pair
      {
        type: "image",
        desktop: "/assets/bfj/bfj-10.webp",
        mobile: "/assets/bfj/bfj-10-mobile.webp",
        alt: "bfj gallery image 9",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-11.webp",
        mobile: "/assets/bfj/bfj-9-mobile.webp",
        alt: "bfj gallery image 10",
      },
      // Row 7: half pair
      {
        type: "image",
        desktop: "/assets/bfj/bfj-12.webp",
        alt: "bfj gallery image 11",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-13.webp",
        mobile: "/assets/bfj/bfj-10-mobile.webp",
        alt: "bfj gallery image 12",
      },
      // Row 8: half pair
      {
        type: "image",
        desktop: "/assets/bfj/bfj-14.webp",
        mobile: "/assets/bfj/bfj-11-mobile.webp",
        alt: "bfj gallery image 13",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-15.webp",
        mobile: "/assets/bfj/bfj-11-mobile.webp",
        alt: "bfj gallery image 14",
      },
    ],

    metaTitle: "BFJ | HAUS Creative",
    metaDescription:
      "Digital design and creative direction for BFJ by Studio Haus Creative.",
    ogImage: "/assets/bfj/bfj-1.webp",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 2000,
    },
  },

  // =========================================================================
  // 9. Ouronyx — gallery9 (intro hero)
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
      desktop: "/assets/ouronyx/ouronyx-video.mp4",
      mobile: "/assets/ouronyx/ouronyx-video-mobile.mp4",
      poster: "/assets/ouronyx/ouronyx-cover.webp",
    },

    heroImage: {
      desktop: "/assets/ouronyx/ouronyx-1.webp",
      mobile: "/assets/ouronyx/ouronyx-1-mobile.webp",
      alt: "ouronyx hero",
    },

    year: "2024",

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-2.webp",
        mobile: "/assets/ouronyx/ouronyx-2-mobile.webp",
        alt: "ouronyx gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-3.webp",
        mobile: "/assets/ouronyx/ouronyx-3-mobile.webp",
        alt: "ouronyx gallery image 2",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-4.webp",
        mobile: "/assets/ouronyx/ouronyx-5-mobile.webp",
        alt: "ouronyx gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-5.webp",
        mobile: "/assets/ouronyx/ouronyx-4-mobile.webp",
        alt: "ouronyx gallery image 4",
      },
      // Row 3: half pair
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-6.webp",
        mobile: "/assets/ouronyx/ouronyx-6-mobile.webp",
        alt: "ouronyx gallery image 5",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-7.webp",
        mobile: "/assets/ouronyx/ouronyx-7-mobile.webp",
        alt: "ouronyx gallery image 6",
      },
      // Row 4: full width
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-8.webp",
        mobile: "/assets/ouronyx/ouronyx-8-mobile.webp",
        alt: "ouronyx gallery image 7",
        span: "full",
      },
    ],

    metaTitle: "Ouronyx | HAUS Creative",
    metaDescription:
      "Premium digital experience for luxury brand Ouronyx by Studio Haus Creative.",
    ogImage: "/assets/ouronyx/ouronyx-1.webp",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 2000,
    },
  },

  // =========================================================================
  // 10. Bride Story — gallery10
  // =========================================================================
  {
    id: "bride-story",
    slug: "bride-story",
    client: "Bride Story",
    title: "Bride Story",
    subtitle: "Art Direction",
    description:
      "Art direction and visual storytelling for Bride Story, capturing the elegance and emotion of bridal fashion through refined creative direction.",

    heroImage: {
      desktop: "/assets/bride-story/bride-story-1.webp",
      mobile: "/assets/bride-story/bride-story-1-mobile.webp",
      alt: "bride-story hero",
    },

    year: "2024",

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-2.webp",
        mobile: "/assets/bride-story/bride-story-2-mobile.webp",
        alt: "bride-story gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-3.webp",
        mobile: "/assets/bride-story/bride-story-3-mobile.webp",
        alt: "bride-story gallery image 2",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-4.webp",
        mobile: "/assets/bride-story/bride-story-4-mobile.webp",
        alt: "bride-story gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-5.webp",
        mobile: "/assets/bride-story/bride-story-5-mobile.webp",
        alt: "bride-story gallery image 4",
      },
      // Row 3: full width
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-6.webp",
        alt: "bride-story gallery image 5",
        span: "full",
      },
      // Row 4: half pair
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-7.webp",
        mobile: "/assets/bride-story/bride-story-7-mobile.webp",
        alt: "bride-story gallery image 6",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-8.webp",
        mobile: "/assets/bride-story/bride-story-6-mobile.webp",
        alt: "bride-story gallery image 7",
      },
      // Row 5: half pair
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-9.webp",
        mobile: "/assets/bride-story/bride-story-8-mobile.webp",
        alt: "bride-story gallery image 8",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-10.webp",
        mobile: "/assets/bride-story/bride-story-7-mobile.webp",
        alt: "bride-story gallery image 9",
      },
      // Row 6: full width
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-11.webp",
        alt: "bride-story gallery image 10",
        span: "full",
      },
    ],

    metaTitle: "Bride Story | HAUS Creative",
    metaDescription:
      "Art direction and visual storytelling for Bride Story by Studio Haus Creative.",
    ogImage: "/assets/bride-story/bride-story-1.webp",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 2000,
    },
  },

  // =========================================================================
  // 11. Harrods
  // =========================================================================
  {
    id: "harrods",
    slug: "harrods",
    client: "Harrods",
    title: "Harrods",
    subtitle: "Dining Hall",
    description:
      "Creative direction for the Harrods Dining Hall experience.",

    heroImage: {
      desktop: "/assets/harrods/harrods-1.webp",
      mobile: "/assets/harrods/harrods-1-mobile.webp",
      alt: "harrods hero",
    },

    year: "2024",

    media: [
      // Row 1: half pair
      {
        type: "image",
        desktop: "/assets/harrods/harrods-2.webp",
        mobile: "/assets/harrods/harrods-2-mobile.webp",
        alt: "harrods gallery image 1",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-3.webp",
        mobile: "/assets/harrods/harrods-3-mobile.webp",
        alt: "harrods gallery image 2",
      },
      // Row 2: half pair
      {
        type: "image",
        desktop: "/assets/harrods/harrods-4.webp",
        mobile: "/assets/harrods/harrods-4-mobile.webp",
        alt: "harrods gallery image 3",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-5.webp",
        mobile: "/assets/harrods/harrods-5-mobile.webp",
        alt: "harrods gallery image 4",
      },
      // Row 3: full width
      {
        type: "image",
        desktop: "/assets/harrods/harrods-6.webp",
        alt: "harrods gallery image 5",
        span: "full",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-7.webp",
        mobile: "/assets/harrods/harrods-5-mobile.webp",
        alt: "harrods gallery image 6",
      },
      // Row 5: half pair
      {
        type: "image",
        desktop: "/assets/harrods/harrods-8.webp",
        alt: "harrods gallery image 7",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-9.webp",
        alt: "harrods gallery image 8",
      },
      // Row 6: full width
      {
        type: "image",
        desktop: "/assets/harrods/harrods-10.webp",
        mobile: "/assets/harrods/harrods-6-mobile.webp",
        alt: "harrods gallery image 9",
        span: "full",
      },
      // Row 7: half pair
      {
        type: "image",
        desktop: "/assets/harrods/harrods-11.webp",
        alt: "harrods gallery image 10",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-12.webp",
        mobile: "/assets/harrods/harrods-7-mobile.webp",
        alt: "harrods gallery image 11",
      },
      // Row 8: half pair
      {
        type: "image",
        desktop: "/assets/harrods/harrods-13.webp",
        mobile: "/assets/harrods/harrods-8-mobile.webp",
        alt: "harrods gallery image 12",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-14.webp",
        alt: "harrods gallery image 13",
      },
      // Row 9: half pair
      {
        type: "image",
        desktop: "/assets/harrods/harrods-15.webp",
        alt: "harrods gallery image 14",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-16.webp",
        alt: "harrods gallery image 15",
      },
    ],

    metaTitle: "Harrods | HAUS Creative",
    metaDescription:
      "Creative direction for the Harrods Dining Hall experience by Studio Haus Creative.",
    ogImage: "/assets/harrods/harrods-1.webp",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 2000,
    },
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
