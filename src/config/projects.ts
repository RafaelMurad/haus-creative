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
   * - `true` — 38 desktop / 15 mobile.
   * - `number` — desktop px; mobile scales to ~40%.
   * - `{ mobile, desktop }` — explicit per-breakpoint values.
   * Overrides the project's `fullRowSpacing` for this row only.
   */
  spaceBefore?: boolean | number | { mobile: number; desktop: number };
  /**
   * Extra whitespace below this slot. Same shape as `spaceBefore`.
   * For pair rows: applied to the row container when set on the right item,
   * applied as mobile-only per-slot padding when set on the left item.
   * For full rows: applied to the row container.
   */
  spaceAfter?: boolean | number | { mobile: number; desktop: number };
  /** When true, this slot renders only on mobile (hidden on desktop via CSS). */
  mobileOnly?: boolean;
  /** When true, this slot renders only on desktop (hidden on mobile via CSS). */
  desktopOnly?: boolean;
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
  /** Campaign tagline shown in the intro block, uppercase (e.g. "SEPTEMBER ISSUE - BACK TO WORK EDITORIAL") */
  editorialSubtitle?: string;
  /** Agency name shown in the intro block under the campaign tagline */
  agency?: string;

  // Hero Media
  heroVideo?: {
    /** Omit for mobile-only hero video — desktop then falls back to heroImage. */
    desktop?: string;
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
    /** CSS object-fit override. Defaults to 'cover'. Use 'contain' to show full image without cropping. */
    objectFit?: "cover" | "contain";
    /** CSS object-position for cropping (e.g. 'top', 'center 20%'). Defaults to 'center'. */
    objectPosition?: string;
    /**
     * Mobile rendering strategy. Default behaviour fills the viewport (`h-dvh` + `object-cover`),
     * accepting a slight side-crop. Use `"natural"` to render the mobile asset at its natural
     * aspect ratio (no crop, hero height < viewport). Use when the mobile asset has critical
     * content near the edges that cropping would clip (e.g. Ouronyx 440×607 with edge text).
     */
    mobileFit?: "cover" | "natural";
  };

  // Client logo overlay on hero
  clientLogo?: string;

  /**
   * Header/logo/burger-menu colour while this project's hero is in view.
   * Defaults to "dark" (black). Use "light" (white) for projects with a dark
   * hero (e.g. Vivara, Life). The header reverts to black once scrolled past
   * the hero onto the white content. Read by the global Header via usePathname.
   */
  headerTheme?: "light" | "dark";

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
   * Defaults to 38 (desktop) / 15 (mobile), matching MC Arabia.
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
    editorialSubtitle: "September Issue - Back to Work Editorial",
    agency: "ITP Media",

    // Per Figma, the hero video is mobile-only (tag on the mobile frame);
    // desktop keeps the static editorial image below.
    heroVideo: {
      mobile: "/assets/mc-arabia/mc-arabia-hero-video-mobile.mp4",
      poster: "/assets/mc-arabia/mc-arabia-hero-mobile.webp",
    },

    heroImage: {
      desktop: "/assets/mc-arabia/mc-arabia-hero.webp",
      mobile: "/assets/mc-arabia/mc-arabia-hero-mobile.webp",
      alt: "Marie Claire Arabia September Issue editorial",
      objectFit: "contain",
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
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-2.webp",
        mobile: "/assets/mc-arabia/mc-arabia-2-mobile.webp",
        alt: "mc-arabia image 1",
        spaceAfter: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-3.webp",
        mobile: "/assets/mc-arabia/mc-arabia-3-mobile.webp",
        alt: "mc-arabia image 2",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-4.webp",
        mobile: "/assets/mc-arabia/mc-arabia-4-mobile.webp",
        alt: "mc-arabia image 3",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-5.webp",
        mobile: "/assets/mc-arabia/mc-arabia-5-mobile.webp",
        alt: "mc-arabia image 4",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-6.webp",
        mobile: "/assets/mc-arabia/mc-arabia-6-mobile.webp",
        alt: "mc-arabia image 5",
        span: "full",
        spaceBefore: 150,
        spaceAfter: 150,
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-7.webp",
        mobile: "/assets/mc-arabia/mc-arabia-7-mobile.webp",
        alt: "mc-arabia image 6",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-8.webp",
        mobile: "/assets/mc-arabia/mc-arabia-8-mobile.webp",
        alt: "mc-arabia image 7",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-9.webp",
        mobile: "/assets/mc-arabia/mc-arabia-9-mobile.webp",
        alt: "mc-arabia image 8",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-10.webp",
        mobile: "/assets/mc-arabia/mc-arabia-10-mobile.webp",
        alt: "mc-arabia image 9",
      },
      {
        type: "image",
        desktop: "/assets/mc-arabia/mc-arabia-11.webp",
        mobile: "/assets/mc-arabia/mc-arabia-11-mobile.webp",
        alt: "mc-arabia image 10",
        span: "full",
        spaceBefore: 150,
        spaceAfter: 150,
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
    subtitle: "Art Direction",
    description:
      "Art direction for Yves Saint Laurent, crafting a visual narrative that honours the maison's heritage while pushing creative boundaries.",

    // Both Figma frames tag the hero as video, but the delivered
    // YSL-HomeBanner-Mobile.mp4 is a byte-for-byte duplicate of gallery
    // clip 3 (md5 534aebbc…) — re-export requested (docs/CLIENT-ASKS.md).
    // Until it lands, mobile explicitly plays the desktop banner (the logo
    // is centered, so it crops safely in the 440/864 box). Without the
    // explicit mobile entry the renderer would fall back to the static
    // heroImage.mobile instead (the SK behaviour).
    heroVideo: {
      desktop: "/assets/ysl/ysl-hero-video.mp4",
      mobile: "/assets/ysl/ysl-hero-video.mp4",
      poster: "/assets/ysl/ysl-hero-cover.webp",
    },

    heroImage: {
      desktop: "/assets/ysl/ysl-1.webp",
      mobile: "/assets/ysl/ysl-1-mobile.webp",
      alt: "YSL editorial hero",
      objectFit: "contain",
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
      {
        type: "image",
        desktop: "/assets/ysl/ysl-2.webp",
        mobile: "/assets/ysl/ysl-2-mobile.webp",
        alt: "ysl image 1",
        span: "full",
        // 75 desktop / 55 mobile below — the video slot underneath is
        // edge-to-edge; 55 is the standard mobile gap used on per-slot
        // overrides across projects.
        spaceAfter: { mobile: 55, desktop: 75 },
      },
      {
        // Video1 — woman with lipstick (same clip both breakpoints; the
        // delivered MOBILE/01.mp4 is byte-identical to YSL-Video1.mp4).
        type: "video",
        desktop: "/assets/ysl/ysl-video-3.mp4",
        poster: "/assets/ysl/ysl-3.webp",
        alt: "ysl video 2",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-4.webp",
        mobile: "/assets/ysl/ysl-4-mobile.webp",
        alt: "ysl image 3",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-5.webp",
        mobile: "/assets/ysl/ysl-5-mobile.webp",
        alt: "ysl image 4",
        span: "full",
        // The neighbouring video slots are edge-to-edge clips (no baked-in
        // whitespace like the desktop image EXPORTs), so this row needs
        // explicit desktop air — 75px per review. Mobile stays flush.
        spaceBefore: { mobile: 0, desktop: 75 },
        spaceAfter: { mobile: 0, desktop: 75 },
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-6.webp",
        mobile: "/assets/ysl/ysl-6-mobile.webp",
        alt: "ysl image 5",
      },
      {
        // Video2 — BABYCAT spray (same clip both breakpoints)
        type: "video",
        desktop: "/assets/ysl/ysl-video-7.mp4",
        poster: "/assets/ysl/ysl-7.webp",
        alt: "ysl video 6",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-8.webp",
        mobile: "/assets/ysl/ysl-8-mobile.webp",
        alt: "ysl image 7",
        span: "full",
        // 75 desktop / 55 mobile air both sides — video slots above (ysl-7)
        // and below (ysl-9) are edge-to-edge.
        spaceBefore: { mobile: 55, desktop: 75 },
        spaceAfter: { mobile: 55, desktop: 75 },
      },
      {
        // Video3 — man in black with LIBRE (same clip both breakpoints)
        type: "video",
        desktop: "/assets/ysl/ysl-video-9.mp4",
        poster: "/assets/ysl/ysl-9.webp",
        alt: "ysl video 8",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-10.webp",
        mobile: "/assets/ysl/ysl-10-mobile.webp",
        alt: "ysl image 9",
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-11.webp",
        mobile: "/assets/ysl/ysl-11-mobile.webp",
        alt: "ysl image 10",
        span: "full",
        // 75px desktop air — video slots in the pairs above (ysl-9) and
        // below (ysl-13). Mobile stays flush per review.
        spaceBefore: { mobile: 0, desktop: 75 },
        spaceAfter: { mobile: 0, desktop: 75 },
      },
      {
        type: "image",
        desktop: "/assets/ysl/ysl-12.webp",
        mobile: "/assets/ysl/ysl-12-mobile.webp",
        alt: "ysl image 11",
      },
      {
        // Video4 — Eid retail display; mobile is a genuinely different edit
        // (18.8s event cut vs 22.3s display cut), so both files ship.
        type: "video",
        desktop: "/assets/ysl/ysl-video-13.mp4",
        mobile: "/assets/ysl/ysl-video-13-mobile.mp4",
        poster: "/assets/ysl/ysl-13.webp",
        alt: "ysl video 12",
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
    headerTheme: "light",
    description:
      "Comprehensive visual identity and brand design for Wao Cosmo, creating a distinctive visual language across all touchpoints.",

    heroImage: {
      desktop: "/assets/wao-cosmo/wao-cosmo-1.webp",
      mobile: "/assets/wao-cosmo/wao-cosmo-1-mobile.webp",
      alt: "wao-cosmo hero",
      objectFit: "contain",
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
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-2.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-2-mobile.webp",
        alt: "wao-cosmo image 1",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-3.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-3-mobile.webp",
        alt: "wao-cosmo image 2",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-4.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-4-mobile.webp",
        alt: "wao-cosmo image 3",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-5.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-5-mobile.webp",
        alt: "wao-cosmo image 4",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-6.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-6-mobile.webp",
        alt: "wao-cosmo image 5",
        span: "full",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-7.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-7-mobile.webp",
        alt: "wao-cosmo image 6",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-8.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-8-mobile.webp",
        alt: "wao-cosmo image 7",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-9.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-9-mobile.webp",
        alt: "wao-cosmo image 8",
        span: "full",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-10.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-10-mobile.webp",
        alt: "wao-cosmo image 9",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-11.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-11-mobile.webp",
        alt: "wao-cosmo image 10",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-12.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-12-mobile.webp",
        alt: "wao-cosmo image 11",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-13.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-13-mobile.webp",
        alt: "wao-cosmo image 12",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-14.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-14-mobile.webp",
        alt: "wao-cosmo image 13",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-15.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-15-mobile.webp",
        alt: "wao-cosmo image 14",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-16.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-16-mobile.webp",
        alt: "wao-cosmo image 15",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-17.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-17-mobile.webp",
        alt: "wao-cosmo image 16",
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-18.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-18-mobile.webp",
        alt: "wao-cosmo image 17",
        spaceBefore: true,
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-19.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-19-mobile.webp",
        alt: "wao-cosmo image 18",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-20.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-20-mobile.webp",
        alt: "wao-cosmo image 19",
        spaceBefore: { mobile: 55, desktop: 55 },
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-21.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-21-mobile.webp",
        alt: "wao-cosmo image 20",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-21.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-22-mobile.webp",
        alt: "wao-cosmo image 21 (mobile)",
        mobileOnly: true,
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/wao-cosmo/wao-cosmo-20.webp",
        mobile: "/assets/wao-cosmo/wao-cosmo-23-mobile.webp",
        alt: "wao-cosmo image 22 (mobile)",
        mobileOnly: true,
        spaceBefore: { mobile: 55, desktop: 0 },
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
    headerTheme: "light",
    description:
      "Art direction for Vivara jewellery, creating elevated visual campaigns that capture the brand's refined elegance.",

    heroVideo: {
      desktop: "/assets/vivara/vivara-hero-video.mp4",
      mobile: "/assets/vivara/vivara-hero-video-mobile.mp4",
      poster: "/assets/vivara/vivara-hero-cover.webp",
    },

    heroImage: {
      desktop: "/assets/vivara/vivara-1.webp",
      mobile: "/assets/vivara/vivara-1-mobile.webp",
      alt: "vivara hero",
      objectFit: "contain",
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
      {
        type: "image",
        desktop: "/assets/vivara/vivara-2.webp",
        mobile: "/assets/vivara/vivara-2-mobile.webp",
        alt: "vivara image 1",
        spaceAfter: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-3.webp",
        mobile: "/assets/vivara/vivara-3-mobile.webp",
        alt: "vivara image 2",
        spaceAfter: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-4.webp",
        mobile: "/assets/vivara/vivara-4-mobile.webp",
        alt: "vivara image 3",
        span: "full",
        spaceBefore: { mobile: 0, desktop: 150 },
        spaceAfter: { mobile: 0, desktop: 150 },
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-5.webp",
        mobile: "/assets/vivara/vivara-5-mobile.webp",
        alt: "vivara image 4",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-6.webp",
        mobile: "/assets/vivara/vivara-6-mobile.webp",
        alt: "vivara image 5",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-7.webp",
        mobile: "/assets/vivara/vivara-7-mobile.webp",
        alt: "vivara image 6",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-8.webp",
        mobile: "/assets/vivara/vivara-8-mobile.webp",
        alt: "vivara image 7",
        spaceAfter: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-9.webp",
        mobile: "/assets/vivara/vivara-9-mobile.webp",
        alt: "vivara image 8",
        span: "full",
        spaceBefore: { mobile: 0, desktop: 150 },
        spaceAfter: { mobile: 0, desktop: 150 },
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-10.webp",
        mobile: "/assets/vivara/vivara-10-mobile.webp",
        alt: "vivara image 9",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-11.webp",
        mobile: "/assets/vivara/vivara-11-mobile.webp",
        alt: "vivara image 10",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-12.webp",
        mobile: "/assets/vivara/vivara-12-mobile.webp",
        alt: "vivara image 11",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-13.webp",
        mobile: "/assets/vivara/vivara-13-mobile.webp",
        alt: "vivara image 12",
        spaceAfter: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-14.webp",
        mobile: "/assets/vivara/vivara-14-mobile.webp",
        alt: "vivara image 13",
        span: "full",
        spaceBefore: { mobile: 0, desktop: 150 },
        spaceAfter: { mobile: 0, desktop: 150 },
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-15.webp",
        mobile: "/assets/vivara/vivara-15-mobile.webp",
        alt: "vivara image 14",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-16.webp",
        mobile: "/assets/vivara/vivara-16-mobile.webp",
        alt: "vivara image 15",
        spaceAfter: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-17.webp",
        mobile: "/assets/vivara/vivara-17-mobile.webp",
        alt: "vivara image 16",
      },
      {
        type: "image",
        desktop: "/assets/vivara/vivara-18.webp",
        mobile: "/assets/vivara/vivara-18-mobile.webp",
        alt: "vivara image 17",
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
    headerTheme: "light",
    description:
      "Creative strategy and visual direction for Life, developing a compelling brand narrative through considered design.",

    heroVideo: {
      desktop: "/assets/life/life-hero-video.mp4",
      mobile: "/assets/life/life-hero-video-mobile.mp4",
      poster: "/assets/life/life-hero-cover.webp",
    },

    heroImage: {
      desktop: "/assets/life/life-1.webp",
      mobile: "/assets/life/life-1-mobile.webp",
      alt: "life hero",
      objectFit: "contain",
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

    fullRowSpacing: 150,

    media: [
      {
        type: "image",
        desktop: "/assets/life/life-2.webp",
        mobile: "/assets/life/life-2-mobile.webp",
        alt: "life image 1",
      },
      {
        type: "image",
        desktop: "/assets/life/life-3.webp",
        mobile: "/assets/life/life-3-mobile.webp",
        alt: "life image 2",
      },
      {
        type: "image",
        desktop: "/assets/life/life-4.webp",
        mobile: "/assets/life/life-4-mobile.webp",
        alt: "life image 3",
      },
      {
        type: "image",
        desktop: "/assets/life/life-5.webp",
        mobile: "/assets/life/life-5-mobile.webp",
        alt: "life image 4",
      },
      {
        type: "image",
        desktop: "/assets/life/life-6.webp",
        mobile: "/assets/life/life-6-mobile.webp",
        alt: "life image 5",
        span: "full",
      },
      {
        type: "image",
        desktop: "/assets/life/life-7.webp",
        mobile: "/assets/life/life-7-mobile.webp",
        alt: "life image 6",
      },
      {
        type: "image",
        desktop: "/assets/life/life-8.webp",
        mobile: "/assets/life/life-8-mobile.webp",
        alt: "life image 7",
      },
      {
        type: "image",
        desktop: "/assets/life/life-9.webp",
        mobile: "/assets/life/life-9-mobile.webp",
        alt: "life image 8",
      },
      {
        type: "image",
        desktop: "/assets/life/life-10.webp",
        mobile: "/assets/life/life-10-mobile.webp",
        alt: "life image 9",
      },
      {
        type: "image",
        desktop: "/assets/life/life-11.webp",
        mobile: "/assets/life/life-11-mobile.webp",
        alt: "life image 10",
        span: "full",
      },
      {
        type: "image",
        desktop: "/assets/life/life-12.webp",
        mobile: "/assets/life/life-12-mobile.webp",
        alt: "life image 11",
      },
      {
        type: "image",
        desktop: "/assets/life/life-13.webp",
        mobile: "/assets/life/life-13-mobile.webp",
        alt: "life image 12",
      },
      {
        type: "image",
        desktop: "/assets/life/life-14.webp",
        mobile: "/assets/life/life-14-mobile.webp",
        alt: "life image 13",
      },
      {
        type: "image",
        desktop: "/assets/life/life-15.webp",
        mobile: "/assets/life/life-15-mobile.webp",
        alt: "life image 14",
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

    // Per Figma, SK's hero is static — the delivered "BANNER" video is the
    // sk-8 gallery slot below, not a hero.
    heroImage: {
      desktop: "/assets/sk/sk-1.webp",
      mobile: "/assets/sk/sk-1-mobile.webp",
      alt: "sk hero",
      objectFit: "contain",
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
      {
        type: "image",
        desktop: "/assets/sk/sk-2.webp",
        mobile: "/assets/sk/sk-2-mobile.webp",
        alt: "sk image 1",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-3.webp",
        mobile: "/assets/sk/sk-3-mobile.webp",
        alt: "sk image 2",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-4.webp",
        mobile: "/assets/sk/sk-4-mobile.webp",
        alt: "sk image 3",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-5.webp",
        mobile: "/assets/sk/sk-5-mobile.webp",
        alt: "sk image 4",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-6.webp",
        mobile: "/assets/sk/sk-6-mobile.webp",
        alt: "sk image 5",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-7.webp",
        mobile: "/assets/sk/sk-7-mobile.webp",
        alt: "sk image 6",
      },
      {
        // Figma tags this slot (not the hero) as the video — the delivered
        // "SK II - BANNER DESKTOP.mp4" plays here. No mobile cut delivered
        // yet (docs/CLIENT-ASKS.md); the desktop file plays on mobile
        // meanwhile.
        type: "video",
        desktop: "/assets/sk/sk-video-8.mp4",
        poster: "/assets/sk/sk-8.webp",
        alt: "sk video 7",
        span: "full",
        // Match Marie Claire's full-width rows: 150px above AND below so the
        // module under the horizontal photo isn't touching it (Figma comment #12).
        spaceBefore: 150,
        spaceAfter: 150,
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-9.webp",
        mobile: "/assets/sk/sk-9-mobile.webp",
        alt: "sk image 8",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-10.webp",
        mobile: "/assets/sk/sk-10-mobile.webp",
        alt: "sk image 9",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-11.webp",
        mobile: "/assets/sk/sk-11-mobile.webp",
        alt: "sk image 10",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-12.webp",
        mobile: "/assets/sk/sk-12-mobile.webp",
        alt: "sk image 11",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-13.webp",
        mobile: "/assets/sk/sk-13-mobile.webp",
        alt: "sk image 12",
        span: "full",
        // Match Marie Claire's full-width rows: 150px above AND below (Figma comment #13 "aqui tb").
        spaceBefore: 150,
        spaceAfter: 150,
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-14.webp",
        mobile: "/assets/sk/sk-14-mobile.webp",
        alt: "sk image 13",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-15.webp",
        mobile: "/assets/sk/sk-15-mobile.webp",
        alt: "sk image 14",
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-16.webp",
        mobile: "/assets/sk/sk-16-mobile.webp",
        alt: "sk image 15",
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
      desktop: "/assets/bucherer/bucherer-1.webp",
      mobile: "/assets/bucherer/bucherer-1-mobile.webp",
      alt: "bucherer hero",
      objectFit: "contain",
    },

    year: "2024",

    media: [
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-2.webp",
        mobile: "/assets/bucherer/bucherer-2-mobile.webp",
        alt: "bucherer image 1",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-3.webp",
        mobile: "/assets/bucherer/bucherer-3-mobile.webp",
        alt: "bucherer image 2",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-4.webp",
        mobile: "/assets/bucherer/bucherer-4-mobile.webp",
        alt: "bucherer image 3",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-5.webp",
        mobile: "/assets/bucherer/bucherer-5-mobile.webp",
        alt: "bucherer image 4",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-6.webp",
        mobile: "/assets/bucherer/bucherer-6-mobile.webp",
        alt: "bucherer image 5",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-7.webp",
        mobile: "/assets/bucherer/bucherer-7-mobile.webp",
        alt: "bucherer image 6",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-8.webp",
        mobile: "/assets/bucherer/bucherer-8-mobile.webp",
        alt: "bucherer image 7",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-9.webp",
        mobile: "/assets/bucherer/bucherer-9-mobile.webp",
        alt: "bucherer image 8",
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
    client: "Bucherer Fine Jewellery",
    title: "Bucherer Fine Jewellery",
    subtitle: "Lorem Ipsum",
    description:
      "Creative direction and digital design for Bucherer Fine Jewellery.",

    heroVideo: {
      desktop: "/assets/bfj/bfj-hero-video.mp4",
      mobile: "/assets/bfj/bfj-hero-video-mobile.mp4",
      poster: "/assets/bfj/bfj-hero-cover.webp",
    },

    heroImage: {
      desktop: "/assets/bfj/bfj-1.webp",
      mobile: "/assets/bfj/bfj-1-mobile.webp",
      alt: "bfj hero",
      objectFit: "contain",
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
      {
        type: "image",
        desktop: "/assets/bfj/bfj-6.webp",
        mobile: "/assets/bfj/bfj-6-mobile.webp",
        alt: "bfj gallery image 5",
        span: "full",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-7.webp",
        mobile: "/assets/bfj/bfj-7-mobile.webp",
        alt: "bfj gallery image 6",
        span: "full",
        // Space below the horizontal photo so the bfj-8/9 module isn't touching it
        // (Figma comment #14). 150 desktop; 0 mobile (BFJ mobile stays flush).
        spaceAfter: { mobile: 0, desktop: 150 },
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-8.webp",
        mobile: "/assets/bfj/bfj-8-mobile.webp",
        alt: "bfj gallery image 7",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-9.webp",
        mobile: "/assets/bfj/bfj-9-mobile.webp",
        alt: "bfj gallery image 8",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-10.webp",
        mobile: "/assets/bfj/bfj-10-mobile.webp",
        alt: "bfj gallery image 9",
        spaceBefore: { mobile: 0, desktop: 100 },
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-11.webp",
        mobile: "/assets/bfj/bfj-11-mobile.webp",
        alt: "bfj gallery image 10",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-12.webp",
        mobile: "/assets/bfj/bfj-12-mobile.webp",
        alt: "bfj gallery image 11",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-13.webp",
        mobile: "/assets/bfj/bfj-13-mobile.webp",
        alt: "bfj gallery image 12",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-14.webp",
        mobile: "/assets/bfj/bfj-14-mobile.webp",
        alt: "bfj gallery image 13",
      },
      {
        type: "image",
        desktop: "/assets/bfj/bfj-15.webp",
        mobile: "/assets/bfj/bfj-15-mobile.webp",
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
    client: "OURONYX",
    title: "OURONYX",
    subtitle: "Lorem Ipsum",
    description:
      "Lorem Ipsum",

    heroVideo: {
      desktop: "/assets/ouronyx/ouronyx-hero-video.mp4",
      mobile: "/assets/ouronyx/ouronyx-hero-video-mobile.mp4",
      poster: "/assets/ouronyx/ouronyx-hero-cover.webp",
    },

    heroImage: {
      desktop: "/assets/ouronyx/ouronyx-1.webp",
      mobile: "/assets/ouronyx/ouronyx-1-mobile.webp",
      alt: "ouronyx hero",
      objectFit: "contain",
      mobileFit: "natural",
    },

    year: "2024",

    media: [
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-2.webp",
        mobile: "/assets/ouronyx/ouronyx-2-mobile.webp",
        alt: "ouronyx image 1",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-3.webp",
        mobile: "/assets/ouronyx/ouronyx-3-mobile.webp",
        alt: "ouronyx image 2",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-4.webp",
        mobile: "/assets/ouronyx/ouronyx-4-mobile.webp",
        alt: "ouronyx image 3",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-5.webp",
        mobile: "/assets/ouronyx/ouronyx-5-mobile.webp",
        alt: "ouronyx image 4",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-6.webp",
        mobile: "/assets/ouronyx/ouronyx-6-mobile.webp",
        alt: "ouronyx image 5",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-7.webp",
        mobile: "/assets/ouronyx/ouronyx-7-mobile.webp",
        alt: "ouronyx image 6",
      },
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-8.webp",
        mobile: "/assets/ouronyx/ouronyx-8-mobile.webp",
        alt: "ouronyx image 7",
        span: "full",
        spaceBefore: { mobile: 0, desktop: 60 },
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
    headerTheme: "light",
    description:
      "Art direction and visual storytelling for Bride Story, capturing the elegance and emotion of bridal fashion through refined creative direction.",

    heroVideo: {
      desktop: "/assets/bride-story/bride-story-hero-video.mp4",
      mobile: "/assets/bride-story/bride-story-hero-video-mobile.mp4",
      poster: "/assets/bride-story/bride-story-hero-cover.webp",
    },

    heroImage: {
      desktop: "/assets/bride-story/bride-story-1.webp",
      mobile: "/assets/bride-story/bride-story-1-mobile.webp",
      alt: "bride-story hero",
      objectFit: "contain",
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
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-2.webp",
        mobile: "/assets/bride-story/bride-story-2-mobile.webp",
        alt: "bride-story image 1",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-3.webp",
        mobile: "/assets/bride-story/bride-story-3-mobile.webp",
        alt: "bride-story image 2",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-4.webp",
        mobile: "/assets/bride-story/bride-story-4-mobile.webp",
        alt: "bride-story image 3",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-5.webp",
        mobile: "/assets/bride-story/bride-story-5-mobile.webp",
        alt: "bride-story image 4",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-6.webp",
        mobile: "/assets/bride-story/bride-story-6-mobile.webp",
        alt: "bride-story image 5",
        span: "full",
        spaceBefore: { mobile: 72, desktop: 202 },
        spaceAfter: { mobile: 72, desktop: 174 },
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-7.webp",
        mobile: "/assets/bride-story/bride-story-7-mobile.webp",
        alt: "bride-story image 6",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-8.webp",
        mobile: "/assets/bride-story/bride-story-8-mobile.webp",
        alt: "bride-story image 7",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-9.webp",
        mobile: "/assets/bride-story/bride-story-9-mobile.webp",
        alt: "bride-story image 8",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-10.webp",
        mobile: "/assets/bride-story/bride-story-10-mobile.webp",
        alt: "bride-story image 9",
      },
      {
        type: "image",
        desktop: "/assets/bride-story/bride-story-11.webp",
        mobile: "/assets/bride-story/bride-story-11-mobile.webp",
        alt: "bride-story image 10",
        span: "full",
        spaceBefore: { mobile: 101, desktop: 101 },
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

    heroVideo: {
      desktop: "/assets/harrods/harrods-hero-video.mp4",
      mobile: "/assets/harrods/harrods-hero-video-mobile.mp4",
      poster: "/assets/harrods/harrods-hero-cover.webp",
    },

    heroImage: {
      desktop: "/assets/harrods/harrods-1.webp",
      mobile: "/assets/harrods/harrods-1-mobile.webp",
      alt: "harrods hero",
      objectFit: "contain",
      mobileFit: "natural",
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
      {
        type: "image",
        desktop: "/assets/harrods/harrods-2.webp",
        mobile: "/assets/harrods/harrods-2-mobile.webp",
        alt: "harrods image 1",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-3.webp",
        mobile: "/assets/harrods/harrods-3-mobile.webp",
        alt: "harrods image 2",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-4.webp",
        mobile: "/assets/harrods/harrods-4-mobile.webp",
        alt: "harrods image 3",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-5.webp",
        mobile: "/assets/harrods/harrods-5-mobile.webp",
        alt: "harrods image 4",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-6.webp",
        mobile: "/assets/harrods/harrods-6-mobile.webp",
        alt: "harrods image 5",
        span: "full",
        spaceBefore: { mobile: 0, desktop: 100 },
        spaceAfter: { mobile: 55, desktop: 100 },
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-7.webp",
        mobile: "/assets/harrods/harrods-7-mobile.webp",
        alt: "harrods image 6",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-8.webp",
        mobile: "/assets/harrods/harrods-8-mobile.webp",
        alt: "harrods image 7",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-9.webp",
        mobile: "/assets/harrods/harrods-9-mobile.webp",
        alt: "harrods image 8",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-10.webp",
        mobile: "/assets/harrods/harrods-10-mobile.webp",
        alt: "harrods image 9",
        spaceBefore: { mobile: 55, desktop: 0 },
        spaceAfter: { mobile: 55, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-11.webp",
        mobile: "/assets/harrods/harrods-11-mobile.webp",
        alt: "harrods image 10",
        span: "full",
        spaceBefore: { mobile: 0, desktop: 100 },
        spaceAfter: { mobile: 0, desktop: 100 },
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-12.webp",
        mobile: "/assets/harrods/harrods-12-mobile.webp",
        alt: "harrods image 11",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-13.webp",
        mobile: "/assets/harrods/harrods-13-mobile.webp",
        alt: "harrods image 12",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-14.webp",
        mobile: "/assets/harrods/harrods-14-mobile.webp",
        alt: "harrods image 13",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-15.webp",
        mobile: "/assets/harrods/harrods-15-mobile.webp",
        alt: "harrods image 14",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-16.webp",
        mobile: "/assets/harrods/harrods-16-mobile.webp",
        alt: "harrods image 15",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-17.webp",
        alt: "harrods image 16",
        desktopOnly: true,
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
