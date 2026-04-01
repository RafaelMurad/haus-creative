import type { MediaSource } from "@/config/site";
import type { CarouselConfig } from "@/types/carousel";

/**
 * Project/Campaign Data Configuration
 *
 * Maps gallery assets to client projects for portfolio showcase pages.
 * Each project represents a campaign or client work displayed on individual pages.
 *
 * Project order (11 total):
 *   1. Ouronyx       (intro hero)
 *   2. Marie Claire
 *   3. YSL           (Yves Saint Laurent)
 *   4. WAO
 *   5. Vivara
 *   6. Bucherer
 *   7. SK-II
 *   8. BFJ
 *   9. Life
 *  10. Bride
 *  11. Harrods
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

  /**
   * Padding override for inset and colorFrame containers, in px.
   * Format: [mobile, desktop]. Defaults to [24, 55].
   * Has no effect on mask or phone frames.
   */
  padding?: [number, number];
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
  credits?: ProjectCredit[];

  // Gallery media (ordered array)
  media: ProjectMedia[];

  /** Carousel/gallery presentation settings (animation, timing, homepage selection). */
  carousel?: CarouselConfig;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

/**
 * All projects/campaigns — ordered by presentation order.
 * Ouronyx first (intro hero), then 10 named projects.
 */
export const projects: ProjectDetail[] = [
  // =========================================================================
  // 1. Ouronyx (intro hero)
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
      desktop: "/assets/ouronyx/web/video.mp4",
      mobile: "/assets/ouronyx/mobile/video.mp4",
      poster: "/assets/ouronyx/web/OUR_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/ouronyx/web/OUR_WEB_01.png", mobile: "/assets/ouronyx/mobile/OUR_MOB_01.png", alt: "Ouronyx showcase 1" },
      { type: "image", desktop: "/assets/ouronyx/web/OUR_WEB_02.png", mobile: "/assets/ouronyx/mobile/OUR_MOB_02.png", alt: "Ouronyx showcase 2" },
      { type: "image", desktop: "/assets/ouronyx/web/OUR_WEB_03.png", mobile: "/assets/ouronyx/mobile/OUR_MOB_03.png", alt: "Ouronyx showcase 3" },
      { type: "image", desktop: "/assets/ouronyx/web/OUR_WEB_04.png", mobile: "/assets/ouronyx/mobile/OUR_MOB_04.png", alt: "Ouronyx showcase 4" },
      { type: "image", desktop: "/assets/ouronyx/web/OUR_WEB_05.png", mobile: "/assets/ouronyx/mobile/OUR_MOB_05.png", alt: "Ouronyx showcase 5" },
      { type: "image", desktop: "/assets/ouronyx/web/OUR_WEB_06.png", mobile: "/assets/ouronyx/mobile/OUR_MOB_06.png", alt: "Ouronyx showcase 6" },
      { type: "image", desktop: "/assets/ouronyx/web/OUR_WEB_07.png", mobile: "/assets/ouronyx/mobile/OUR_MOB_07.png", alt: "Ouronyx showcase 7" },
      { type: "image", desktop: "/assets/ouronyx/web/OUR_WEB_08.png", mobile: "/assets/ouronyx/mobile/OUR_MOB_08.png", alt: "Ouronyx showcase 8" },
    ],

    metaTitle: "Ouronyx | HAUS Creative",
    metaDescription:
      "Premium digital experience for luxury brand Ouronyx by Studio Haus Creative.",
    ogImage: "/assets/ouronyx/web/OUR_WEB_01.png",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 2000,
    },
  },

  // =========================================================================
  // 2. Marie Claire
  // =========================================================================
  {
    id: "marie-claire",
    slug: "marie-claire",
    client: "Marie Claire",
    title: "Marie Claire",
    subtitle: "September Issue - Back to Work Editorial",
    description:
      "Creative direction for the September Issue Back to Work editorial, combining bold fashion statements with refined art direction.",
    introText:
      "A striking editorial for Marie Claire's September Issue, exploring the return to professional elegance through contemporary fashion photography.",

    heroVideo: {
      desktop: "/assets/marie-claire/web/video.mp4",
      mobile: "/assets/marie-claire/mobile/video.mp4",
      poster: "/assets/marie-claire/web/MC_WEB_01.jpg",
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
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_01.jpg", mobile: "/assets/marie-claire/mobile/MC_MOB_01.png", alt: "Marie Claire editorial 1" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_02.png", mobile: "/assets/marie-claire/mobile/MC_MOB_02.png", alt: "Marie Claire editorial 2" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_03.png", mobile: "/assets/marie-claire/mobile/MC_MOB_03.png", alt: "Marie Claire editorial 3" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_04.png", mobile: "/assets/marie-claire/mobile/MC_MOB_04.png", alt: "Marie Claire editorial 4" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_05.png", mobile: "/assets/marie-claire/mobile/MC_MOB_05.png", alt: "Marie Claire editorial 5" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_06.png", mobile: "/assets/marie-claire/mobile/MC_MOB_06.png", alt: "Marie Claire editorial 6" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_07.png", mobile: "/assets/marie-claire/mobile/MC_MOB_07.png", alt: "Marie Claire editorial 7" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_08.png", mobile: "/assets/marie-claire/mobile/MC_MOB_08.png", alt: "Marie Claire editorial 8" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_09.png", mobile: "/assets/marie-claire/mobile/MC_MOB_09.png", alt: "Marie Claire editorial 9" },
      // Item 10: mobile only — no WEB variant
      { type: "image", desktop: "/assets/marie-claire/mobile/MC_MOB_10.png", alt: "Marie Claire editorial 10" },
      { type: "image", desktop: "/assets/marie-claire/web/MC_WEB_11.png", mobile: "/assets/marie-claire/mobile/MC_MOB_11.png", alt: "Marie Claire editorial 11" },
    ],

    metaTitle: "Marie Claire | HAUS Creative",
    metaDescription:
      "Creative direction for Marie Claire September Issue editorial by Studio Haus Creative.",
    ogImage: "/assets/marie-claire/web/MC_WEB_01.jpg",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 2000,
    },
  },

  // =========================================================================
  // 3. YSL (Yves Saint Laurent)
  // =========================================================================
  {
    id: "ysl",
    slug: "ysl",
    client: "Yves Saint Laurent",
    title: "Yves Saint Laurent",
    subtitle: "Art Direction",
    description:
      "Art direction for Yves Saint Laurent, crafting a visual narrative that honours the maison's heritage while pushing creative boundaries.",

    heroVideo: {
      desktop: "/assets/ysl/web/video-01.mp4",
      mobile: "/assets/ysl/mobile/video-01.mp4",
      poster: "/assets/ysl/web/YSL_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_01.png", mobile: "/assets/ysl/mobile/YSL_MOB_01.png", alt: "YSL campaign 1" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_02.png", mobile: "/assets/ysl/mobile/YSL_MOB_02.png", alt: "YSL campaign 2" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_03.png", mobile: "/assets/ysl/mobile/YSL_MOB_03.png", alt: "YSL campaign 3" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_04.png", mobile: "/assets/ysl/mobile/YSL_MOB_04.png", alt: "YSL campaign 4" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_05.png", mobile: "/assets/ysl/mobile/YSL_MOB_05.png", alt: "YSL campaign 5" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_06.png", mobile: "/assets/ysl/mobile/YSL_MOB_06.png", alt: "YSL campaign 6" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_07.png", mobile: "/assets/ysl/mobile/YSL_MOB_07.png", alt: "YSL campaign 7" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_08.png", mobile: "/assets/ysl/mobile/YSL_MOB_08.png", alt: "YSL campaign 8" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_09.png", mobile: "/assets/ysl/mobile/YSL_MOB_09.png", alt: "YSL campaign 9" },
      // Item 10: web only — no MOB variant
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_10.png", alt: "YSL campaign 10" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_11.png", mobile: "/assets/ysl/mobile/YSL_MOB_11.png", alt: "YSL campaign 11" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_12.png", mobile: "/assets/ysl/mobile/YSL_MOB_12.png", alt: "YSL campaign 12" },
      { type: "image", desktop: "/assets/ysl/web/YSL_WEB_13.png", mobile: "/assets/ysl/mobile/YSL_MOB_13.png", alt: "YSL campaign 13" },
      // Additional videos (video-02 through video-04)
      { type: "video", desktop: "/assets/ysl/web/video-02.mp4", mobile: "/assets/ysl/mobile/video-02.mp4", alt: "YSL video 2" },
      { type: "video", desktop: "/assets/ysl/web/video-03.mp4", mobile: "/assets/ysl/mobile/video-03.mp4", alt: "YSL video 3" },
      { type: "video", desktop: "/assets/ysl/web/video-04.mp4", mobile: "/assets/ysl/mobile/video-04.mp4", alt: "YSL video 4" },
    ],

    metaTitle: "YSL | HAUS Creative",
    metaDescription:
      "Art direction for Yves Saint Laurent by Studio Haus Creative.",
    ogImage: "/assets/ysl/web/YSL_WEB_01.png",

    carousel: {
      animation: "none",
      autoAdvanceTime: 800,
    },
  },

  // =========================================================================
  // 4. WAO
  // =========================================================================
  {
    id: "wao",
    slug: "wao",
    client: "WAO",
    title: "WAO",
    subtitle: "Visual Design",
    description:
      "Comprehensive visual identity and brand design for WAO, creating a distinctive visual language across all touchpoints.",

    heroVideo: {
      desktop: "/assets/wao/web/video.mp4",
      mobile: "/assets/wao/mobile/video.mp4",
      poster: "/assets/wao/web/WAO_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_01.png", mobile: "/assets/wao/mobile/WAO_MOB_01.png", alt: "WAO showcase 1" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_02.png", mobile: "/assets/wao/mobile/WAO_MOB_02.png", alt: "WAO showcase 2" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_03.png", mobile: "/assets/wao/mobile/WAO_MOB_03.png", alt: "WAO showcase 3" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_04.png", mobile: "/assets/wao/mobile/WAO_MOB_04.png", alt: "WAO showcase 4" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_05.png", mobile: "/assets/wao/mobile/WAO_MOB_05.png", alt: "WAO showcase 5" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_06.png", mobile: "/assets/wao/mobile/WAO_MOB_06.png", alt: "WAO showcase 6" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_07.png", mobile: "/assets/wao/mobile/WAO_MOB_07.png", alt: "WAO showcase 7" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_08.png", mobile: "/assets/wao/mobile/WAO_MOB_08.png", alt: "WAO showcase 8" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_09.png", mobile: "/assets/wao/mobile/WAO_MOB_09.png", alt: "WAO showcase 9" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_10.png", mobile: "/assets/wao/mobile/WAO_MOB_10.png", alt: "WAO showcase 10" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_11.png", mobile: "/assets/wao/mobile/WAO_MOB_11.png", alt: "WAO showcase 11" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_12.png", mobile: "/assets/wao/mobile/WAO_MOB_12.png", alt: "WAO showcase 12" },
      // Item 13: web only — no MOB variant
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_13.png", alt: "WAO showcase 13" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_14.png", mobile: "/assets/wao/mobile/WAO_MOB_14.png", alt: "WAO showcase 14" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_15.png", mobile: "/assets/wao/mobile/WAO_MOB_15.png", alt: "WAO showcase 15" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_16.png", mobile: "/assets/wao/mobile/WAO_MOB_16.png", alt: "WAO showcase 16" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_17.png", mobile: "/assets/wao/mobile/WAO_MOB_17.png", alt: "WAO showcase 17" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_18.png", mobile: "/assets/wao/mobile/WAO_MOB_18.png", alt: "WAO showcase 18" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_19.png", mobile: "/assets/wao/mobile/WAO_MOB_19.png", alt: "WAO showcase 19" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_20.png", mobile: "/assets/wao/mobile/WAO_MOB_20.png", alt: "WAO showcase 20" },
      { type: "image", desktop: "/assets/wao/web/WAO_WEB_21.png", mobile: "/assets/wao/mobile/WAO_MOB_21.png", alt: "WAO showcase 21" },
      // Item 22: mobile only — no WEB variant
      { type: "image", desktop: "/assets/wao/mobile/WAO_MOB_22.png", alt: "WAO showcase 22" },
    ],

    metaTitle: "WAO | HAUS Creative",
    metaDescription:
      "Visual identity and brand design for WAO by Studio Haus Creative.",
    ogImage: "/assets/wao/web/WAO_WEB_01.png",

    carousel: {
      animation: "none",
    },
  },

  // =========================================================================
  // 5. Vivara
  // =========================================================================
  {
    id: "vivara",
    slug: "vivara",
    client: "Vivara",
    title: "Vivara",
    subtitle: "Art Direction",
    description:
      "Art direction for Vivara jewellery, creating elevated visual campaigns that capture the brand's refined elegance.",

    heroVideo: {
      desktop: "/assets/vivara/web/video.mp4",
      mobile: "/assets/vivara/mobile/video.mp4",
      poster: "/assets/vivara/web/VIV_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_01.png", mobile: "/assets/vivara/mobile/VIV_MOB_01.png", alt: "Vivara campaign 1" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_02.png", mobile: "/assets/vivara/mobile/VIV_MOB_02.png", alt: "Vivara campaign 2" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_03.png", mobile: "/assets/vivara/mobile/VIV_MOB_03.png", alt: "Vivara campaign 3" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_04.png", mobile: "/assets/vivara/mobile/VIV_MOB_04.png", alt: "Vivara campaign 4" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_05.png", mobile: "/assets/vivara/mobile/VIV_MOB_05.png", alt: "Vivara campaign 5" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_06.png", mobile: "/assets/vivara/mobile/VIV_MOB_06.png", alt: "Vivara campaign 6" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_07.png", mobile: "/assets/vivara/mobile/VIV_MOB_07.png", alt: "Vivara campaign 7" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_08.png", mobile: "/assets/vivara/mobile/VIV_MOB_08.png", alt: "Vivara campaign 8" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_09.png", mobile: "/assets/vivara/mobile/VIV_MOB_09.png", alt: "Vivara campaign 9" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_10.png", mobile: "/assets/vivara/mobile/VIV_MOB_10.png", alt: "Vivara campaign 10" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_11.png", mobile: "/assets/vivara/mobile/VIV_MOB_11.png", alt: "Vivara campaign 11" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_12.png", mobile: "/assets/vivara/mobile/VIV_MOB_12.png", alt: "Vivara campaign 12" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_13.png", mobile: "/assets/vivara/mobile/VIV_MOB_13.png", alt: "Vivara campaign 13" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_14.png", mobile: "/assets/vivara/mobile/VIV_MOB_14.png", alt: "Vivara campaign 14" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_15.png", mobile: "/assets/vivara/mobile/VIV_MOB_15.png", alt: "Vivara campaign 15" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_16.png", mobile: "/assets/vivara/mobile/VIV_MOB_16.png", alt: "Vivara campaign 16" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_17.png", mobile: "/assets/vivara/mobile/VIV_MOB_17.png", alt: "Vivara campaign 17" },
      { type: "image", desktop: "/assets/vivara/web/VIV_WEB_18.png", mobile: "/assets/vivara/mobile/VIV_MOB_18.png", alt: "Vivara campaign 18" },
    ],

    metaTitle: "Vivara | HAUS Creative",
    metaDescription:
      "Art direction for Vivara jewellery campaigns by Studio Haus Creative.",
    ogImage: "/assets/vivara/web/VIV_WEB_01.png",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 1000,
    },
  },

  // =========================================================================
  // 6. Bucherer
  // =========================================================================
  {
    id: "bucherer",
    slug: "bucherer",
    client: "Bucherer",
    title: "Bucherer",
    subtitle: "Creative Direction",
    description:
      "Creative direction for Bucherer, bringing dynamic motion design and animation to the luxury watch and jewellery brand.",

    heroVideo: {
      desktop: "/assets/bucherer/web/video.mp4",
      mobile: "/assets/bucherer/mobile/video.mp4",
      poster: "/assets/bucherer/web/BUC_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_01.png", mobile: "/assets/bucherer/mobile/BUC_MOB_01.png", alt: "Bucherer campaign 1" },
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_02.png", mobile: "/assets/bucherer/mobile/BUC_MOB_02.png", alt: "Bucherer campaign 2" },
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_03.png", mobile: "/assets/bucherer/mobile/BUC_MOB_03.png", alt: "Bucherer campaign 3" },
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_04.png", mobile: "/assets/bucherer/mobile/BUC_MOB_04.png", alt: "Bucherer campaign 4" },
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_05.png", mobile: "/assets/bucherer/mobile/BUC_MOB_05.png", alt: "Bucherer campaign 5" },
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_06.png", mobile: "/assets/bucherer/mobile/BUC_MOB_06.png", alt: "Bucherer campaign 6" },
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_07.png", mobile: "/assets/bucherer/mobile/BUC_MOB_07.png", alt: "Bucherer campaign 7" },
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_08.png", mobile: "/assets/bucherer/mobile/BUC_MOB_08.png", alt: "Bucherer campaign 8" },
      { type: "image", desktop: "/assets/bucherer/web/BUC_WEB_09.png", mobile: "/assets/bucherer/mobile/BUC_MOB_09.png", alt: "Bucherer campaign 9" },
    ],

    metaTitle: "Bucherer | HAUS Creative",
    metaDescription:
      "Creative direction for Bucherer by Studio Haus Creative.",
    ogImage: "/assets/bucherer/web/BUC_WEB_01.png",

    carousel: {
      animation: "none",
    },
  },

  // =========================================================================
  // 7. SK-II
  // =========================================================================
  {
    id: "sk-ii",
    slug: "sk-ii",
    client: "SK-II",
    title: "SK-II",
    subtitle: "Brand Development",
    description:
      "Brand development and visual identity for SK-II, establishing a cohesive design language across all brand touchpoints.",

    heroVideo: {
      desktop: "/assets/sk-ii/web/video.mp4",
      mobile: "/assets/sk-ii/mobile/video.mp4",
      poster: "/assets/sk-ii/web/SKII-WEB-01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-01.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-01.png", alt: "SK-II showcase 1" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-02.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-02.png", alt: "SK-II showcase 2" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-03.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-03.png", alt: "SK-II showcase 3" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-04.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-04.png", alt: "SK-II showcase 4" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-05.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-05.png", alt: "SK-II showcase 5" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-06.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-06.png", alt: "SK-II showcase 6" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-07.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-07.png", alt: "SK-II showcase 7" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-08.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-08.png", alt: "SK-II showcase 8" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-09.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-09.png", alt: "SK-II showcase 9" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-10.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-10.png", alt: "SK-II showcase 10" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-11.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-11.png", alt: "SK-II showcase 11" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-12.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-12.png", alt: "SK-II showcase 12" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-13.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-13.png", alt: "SK-II showcase 13" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-14.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-14.png", alt: "SK-II showcase 14" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-15.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-15.png", alt: "SK-II showcase 15" },
      { type: "image", desktop: "/assets/sk-ii/web/SKII-WEB-16.png", mobile: "/assets/sk-ii/mobile/SKII-MOB-16.png", alt: "SK-II showcase 16" },
    ],

    metaTitle: "SK-II | HAUS Creative",
    metaDescription:
      "Brand development and visual identity for SK-II by Studio Haus Creative.",
    ogImage: "/assets/sk-ii/web/SKII-WEB-01.png",

    carousel: {
      animation: "slide",
      autoAdvanceTime: 2500,
    },
  },

  // =========================================================================
  // 8. BFJ
  // =========================================================================
  {
    id: "bfj",
    slug: "bfj",
    client: "BFJ",
    title: "BFJ",
    subtitle: "Digital Design",
    description:
      "Digital design and creative direction for BFJ, delivering impactful visual experiences across digital platforms.",

    heroVideo: {
      desktop: "/assets/bfj/web/video.mp4",
      mobile: "/assets/bfj/mobile/video.mp4",
      poster: "/assets/bfj/web/BUC_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_01.png", mobile: "/assets/bfj/mobile/BUC_MOB_01.png", alt: "BFJ project 1" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_02.png", mobile: "/assets/bfj/mobile/BUC_MOB_02.png", alt: "BFJ project 2" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_03.png", mobile: "/assets/bfj/mobile/BUC_MOB_03.png", alt: "BFJ project 3" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_04.png", mobile: "/assets/bfj/mobile/BUC_MOB_04.png", alt: "BFJ project 4" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_05.png", mobile: "/assets/bfj/mobile/BUC_MOB_05.png", alt: "BFJ project 5" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_06.png", mobile: "/assets/bfj/mobile/BUC_MOB_06.png", alt: "BFJ project 6" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_07.png", mobile: "/assets/bfj/mobile/BUC_MOB_07.png", alt: "BFJ project 7" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_08.png", mobile: "/assets/bfj/mobile/BUC_MOB_08.png", alt: "BFJ project 8" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_09.png", mobile: "/assets/bfj/mobile/BUC_MOB_09.png", alt: "BFJ project 9" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_10.png", mobile: "/assets/bfj/mobile/BUC_MOB_10.png", alt: "BFJ project 10" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_11.png", mobile: "/assets/bfj/mobile/BUC_MOB_11.png", alt: "BFJ project 11" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_12.png", mobile: "/assets/bfj/mobile/BUC_MOB_12.png", alt: "BFJ project 12" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_13.png", mobile: "/assets/bfj/mobile/BUC_MOB_13.png", alt: "BFJ project 13" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_14.png", mobile: "/assets/bfj/mobile/BUC_MOB_14.png", alt: "BFJ project 14" },
      { type: "image", desktop: "/assets/bfj/web/BUC_WEB_15.png", mobile: "/assets/bfj/mobile/BUC_MOB_15.png", alt: "BFJ project 15" },
      // Item 16: mobile only — no WEB variant
      { type: "image", desktop: "/assets/bfj/mobile/BUC_MOB_16.png", alt: "BFJ project 16" },
    ],

    metaTitle: "BFJ | HAUS Creative",
    metaDescription:
      "Digital design and creative direction for BFJ by Studio Haus Creative.",
    ogImage: "/assets/bfj/web/BUC_WEB_01.png",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 2000,
    },
  },

  // =========================================================================
  // 9. Life
  // =========================================================================
  {
    id: "life",
    slug: "life",
    client: "Life",
    title: "Life",
    subtitle: "Creative Strategy",
    description:
      "Creative strategy and visual direction for Life, developing a compelling brand narrative through considered design.",

    heroVideo: {
      desktop: "/assets/life/web/video.mp4",
      mobile: "/assets/life/mobile/video.mp4",
      poster: "/assets/life/web/LIFE_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_01.png", mobile: "/assets/life/mobile/LIFE_MOB_01.png", alt: "Life project 1" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_02.png", mobile: "/assets/life/mobile/LIFE_MOB_02.png", alt: "Life project 2" },
      // Item 03: mobile only — no WEB variant
      { type: "image", desktop: "/assets/life/mobile/LIFE_MOB_03.png", alt: "Life project 3" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_04.png", mobile: "/assets/life/mobile/LIFE_MOB_04.png", alt: "Life project 4" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_05.png", mobile: "/assets/life/mobile/LIFE_MOB_05.png", alt: "Life project 5" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_06.png", mobile: "/assets/life/mobile/LIFE_MOB_06.png", alt: "Life project 6" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_07.png", mobile: "/assets/life/mobile/LIFE_MOB_07.png", alt: "Life project 7" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_08.png", mobile: "/assets/life/mobile/LIFE_MOB_08.png", alt: "Life project 8" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_09.png", mobile: "/assets/life/mobile/LIFE_MOB_09.png", alt: "Life project 9" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_10.png", mobile: "/assets/life/mobile/LIFE_MOB_10.png", alt: "Life project 10" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_11.png", mobile: "/assets/life/mobile/LIFE_MOB_11.png", alt: "Life project 11" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_12.png", mobile: "/assets/life/mobile/LIFE_MOB_12.png", alt: "Life project 12" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_13.png", mobile: "/assets/life/mobile/LIFE_MOB_13.png", alt: "Life project 13" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_14.png", mobile: "/assets/life/mobile/LIFE_MOB_14.png", alt: "Life project 14" },
      { type: "image", desktop: "/assets/life/web/LIFE_WEB_15.png", mobile: "/assets/life/mobile/LIFE_MOB_15.png", alt: "Life project 15" },
    ],

    metaTitle: "Life | HAUS Creative",
    metaDescription:
      "Creative strategy and visual direction for Life by Studio Haus Creative.",
    ogImage: "/assets/life/web/LIFE_WEB_01.png",

    carousel: {
      animation: "fade",
      autoAdvanceTime: 3000,
    },
  },

  // =========================================================================
  // 10. Bride
  // =========================================================================
  {
    id: "bride",
    slug: "bride",
    client: "Bride",
    title: "Bride",
    subtitle: "Art Direction",
    description:
      "Art direction and visual storytelling for Bride, capturing the elegance and emotion of bridal fashion through refined creative direction.",

    heroVideo: {
      desktop: "/assets/bride/web/video.mp4",
      mobile: "/assets/bride/mobile/video.mp4",
      poster: "/assets/bride/web/BRD_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_01.png", mobile: "/assets/bride/mobile/BRD_MOB_01.png", alt: "Bride showcase 1" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_02.png", mobile: "/assets/bride/mobile/BRD_MOB_02.png", alt: "Bride showcase 2" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_03.png", mobile: "/assets/bride/mobile/BRD_MOB_03.png", alt: "Bride showcase 3" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_04.png", mobile: "/assets/bride/mobile/BRD_MOB_04.png", alt: "Bride showcase 4" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_05.png", mobile: "/assets/bride/mobile/BRD_MOB_05.png", alt: "Bride showcase 5" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_06.png", mobile: "/assets/bride/mobile/BRD_MOB_06.png", alt: "Bride showcase 6" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_07.png", mobile: "/assets/bride/mobile/BRD_MOB_07.png", alt: "Bride showcase 7" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_08.png", mobile: "/assets/bride/mobile/BRD_MOB_08.png", alt: "Bride showcase 8" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_09.png", mobile: "/assets/bride/mobile/BRD_MOB_09.png", alt: "Bride showcase 9" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_10.png", mobile: "/assets/bride/mobile/BRD_MOB_10.png", alt: "Bride showcase 10" },
      { type: "image", desktop: "/assets/bride/web/BRD_WEB_11.png", mobile: "/assets/bride/mobile/BRD_MOB_11.png", alt: "Bride showcase 11" },
    ],

    metaTitle: "Bride | HAUS Creative",
    metaDescription:
      "Art direction and visual storytelling for Bride by Studio Haus Creative.",
    ogImage: "/assets/bride/web/BRD_WEB_01.png",

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
    subtitle: "Creative Direction",
    description:
      "Creative direction for Harrods, delivering elevated visual campaigns for the iconic luxury department store.",

    heroVideo: {
      desktop: "/assets/harrods/web/video-01.mp4",
      mobile: "/assets/harrods/mobile/video-01.mp4",
      poster: "/assets/harrods/web/HAR_WEB_01.png",
    },

    year: "2024",

    media: [
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_01.png", mobile: "/assets/harrods/mobile/HAR_MOB_01.png", alt: "Harrods campaign 1" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_02.png", mobile: "/assets/harrods/mobile/HAR_MOB_02.png", alt: "Harrods campaign 2" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_03.png", mobile: "/assets/harrods/mobile/HAR_MOB_03.png", alt: "Harrods campaign 3" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_04.png", mobile: "/assets/harrods/mobile/HAR_MOB_04.png", alt: "Harrods campaign 4" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_05.png", mobile: "/assets/harrods/mobile/HAR_MOB_05.png", alt: "Harrods campaign 5" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_06.png", mobile: "/assets/harrods/mobile/HAR_MOB_06.png", alt: "Harrods campaign 6" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_07.png", mobile: "/assets/harrods/mobile/HAR_MOB_07.png", alt: "Harrods campaign 7" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_08.png", mobile: "/assets/harrods/mobile/HAR_MOB_08.png", alt: "Harrods campaign 8" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_09.png", mobile: "/assets/harrods/mobile/HAR_MOB_09.png", alt: "Harrods campaign 9" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_10.png", mobile: "/assets/harrods/mobile/HAR_MOB_10.png", alt: "Harrods campaign 10" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_11.png", mobile: "/assets/harrods/mobile/HAR_MOB_11.png", alt: "Harrods campaign 11" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_12.png", mobile: "/assets/harrods/mobile/HAR_MOB_12.png", alt: "Harrods campaign 12" },
      // Item 12-1: web only — extra variant, no mobile counterpart
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_12-1.png", alt: "Harrods campaign 12 variant" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_13.png", mobile: "/assets/harrods/mobile/HAR_MOB_13.png", alt: "Harrods campaign 13" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_14.png", mobile: "/assets/harrods/mobile/HAR_MOB_14.png", alt: "Harrods campaign 14" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_15.png", mobile: "/assets/harrods/mobile/HAR_MOB_15.png", alt: "Harrods campaign 15" },
      { type: "image", desktop: "/assets/harrods/web/HAR_WEB_16.png", mobile: "/assets/harrods/mobile/HAR_MOB_16.png", alt: "Harrods campaign 16" },
      // Additional videos (video-02 through video-08)
      { type: "video", desktop: "/assets/harrods/web/video-02.mp4", mobile: "/assets/harrods/mobile/video-02.mp4", alt: "Harrods video 2" },
      { type: "video", desktop: "/assets/harrods/web/video-03.mp4", mobile: "/assets/harrods/mobile/video-03.mp4", alt: "Harrods video 3" },
      { type: "video", desktop: "/assets/harrods/web/video-04.mp4", mobile: "/assets/harrods/mobile/video-04.mp4", alt: "Harrods video 4" },
      { type: "video", desktop: "/assets/harrods/web/video-05.mp4", mobile: "/assets/harrods/mobile/video-05.mp4", alt: "Harrods video 5" },
      { type: "video", desktop: "/assets/harrods/web/video-06.mp4", mobile: "/assets/harrods/mobile/video-06.mp4", alt: "Harrods video 6" },
      { type: "video", desktop: "/assets/harrods/web/video-07.mp4", mobile: "/assets/harrods/mobile/video-07.mp4", alt: "Harrods video 7" },
      { type: "video", desktop: "/assets/harrods/web/video-08.mp4", mobile: "/assets/harrods/mobile/video-08.mp4", alt: "Harrods video 8" },
    ],

    metaTitle: "Harrods | HAUS Creative",
    metaDescription:
      "Creative direction for Harrods by Studio Haus Creative.",
    ogImage: "/assets/harrods/web/HAR_WEB_01.png",

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
