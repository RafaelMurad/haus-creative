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

  /**
   * Designed card aspect for video slots, as "width/height" (take it from the
   * slot's still, e.g. "720/960"). The clip renders object-cover inside this
   * box, so pair rows keep the designed alignment when the delivered clip's
   * dimensions differ from the still's. Omit to render at the clip's natural
   * aspect.
   */
  aspect?: string;

  /**
   * CSS inset (top right bottom left) locating the video within its aspect
   * card — for slots whose still bakes framing whitespace around the photo.
   * Measured from the still (cropdetect). The still renders as the card
   * (frame included) and the clip plays over its photo area. Requires
   * `aspect`.
   */
  inset?: string;

  /**
   * Gutter around a video card on MOBILE — padding on ALL FOUR sides
   * (e.g. "13%", relative to width per CSS % padding), applied below md
   * only. Composes with the desktop `aspect`/`inset` framing.
   */
  mobileGutter?: string;

  /**
   * The clip ships with an audio track (per Vitor 2026-07-14, the
   * Instagram-style toggle): it still autoplays muted, but shows a corner
   * speaker button and unmutes on click/tap — one clip audible at a time.
   * Only set on files actually muxed with audio. Audio presence is a
   * per-FILE fact — where the desktop and mobile edits differ (e.g. the
   * Ouronyx 18 mobile export ships a digitally silent track), use the
   * object form to enable the toggle per breakpoint file.
   */
  hasAudio?: boolean | { desktop?: boolean; mobile?: boolean };

  /** Layout span: 'full' = full width, 'half' = 50% (paired). Defaults to 'half'. */
  span?: "full" | "half";

  /**
   * Vertical alignment of this slot within its pair row on desktop — "center"
   * middle-aligns a shorter item against a taller pair partner (e.g. a still
   * next to a portrait video). Defaults to top. No effect on mobile stacking.
   */
  align?: "center";

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
  /** Intro body (right column). Array = multiple paragraphs (client copy 2026-07-20). */
  introText?: string | string[];
  /** Discipline line shown uppercase in the intro block (e.g. "Creative Direction") */
  editorialSubtitle?: string;
  /** Location line under the discipline (e.g. "Dubai, UAE" / "Shot in Zurich, Switzerland") */
  location?: string;
  /** Agency line ("Agency: X") — omitted entirely when the project has none */
  agency?: string;

  // Hero Media
  heroVideo?: {
    /** Omit for mobile-only hero video — desktop then falls back to heroImage. */
    desktop?: string;
    mobile?: string;
    poster?: string;
    /**
     * Poster for the portrait (mobile) file, shown below the hero swap
     * boundary — for banners whose landscape poster bakes a title that
     * would flash over the portrait edit while it loads (Bride). When set,
     * no poster renders until the breakpoint is known (the black hero
     * section covers the gap) so the wrong-breakpoint frame never flashes.
     */
    posterMobile?: string;
    /** CSS object-position for cropping (e.g. 'top', 'center 20%'). Defaults to 'center'. */
    objectPosition?: string;
    /** CSS object-fit override (e.g. 'contain' to show full video without cropping). Defaults to 'cover'. */
    objectFit?: "cover" | "contain";
    /**
     * The banner file was muxed with its source audio — the project-page
     * hero shows the corner speaker and unmutes on click (same exclusive
     * channel as the gallery clips). Home covers stay silent regardless.
     * Object form enables it per breakpoint file (Bride Story's mobile
     * banner export ships a digitally silent track).
     */
    hasAudio?: boolean | { desktop?: boolean; mobile?: boolean };
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
    subtitle: "Creative Direction",
    description:
      "Commissioned for Marie Claire Arabia's September issue, this editorial reimagined back-to-office dressing through a contemporary fashion perspective.",
    // Client copy 2026-07-20 — the text lists no agency for this project
    // (the earlier "ITP Media" line was dropped with it).
    introText: [
      "Commissioned for Marie Claire Arabia's September issue, this editorial reimagined back-to-office dressing through a contemporary fashion perspective.",
      "Shot across the streets of Central London, the story portrays the modern executive woman: confident, ambitious and effortlessly elegant. Combining cinematic urban imagery with refined editorial styling.",
    ],
    editorialSubtitle: "Creative Direction",
    location: "London, UK",

    // Hero is fully static per review 2026-07-20 — the mobile-only hero
    // video (Figma-tagged, wired 2026-07-07) was retired; mobile shows the
    // cover image like desktop. The mp4 stays on disk if it's ever wanted
    // back (mc-arabia-hero-video-mobile.mp4).

    heroImage: {
      desktop: "/assets/mc-arabia/mc-arabia-hero.webp",
      mobile: "/assets/mc-arabia/mc-arabia-hero-mobile.webp",
      alt: "Marie Claire Arabia September Issue editorial",
      objectFit: "contain",
      // The mobile still bakes the "marie claire" masthead to the frame
      // edge — cover-crop clipped it once the mobile hero went static
      // (review 2026-07-20); natural renders the 440×864 cover art whole.
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

    metaTitle: "Marie Claire Arabia",
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
    title: "YSL Beauty - The Golden Celebration",
    subtitle: "Creative Direction",
    description:
      "YSL Beauty's first global Eid campaign marked a milestone for the luxury house, celebrating one of the region's most important cultural moments through a contemporary lens.",
    editorialSubtitle: "Creative Direction",
    location: "Dubai, UAE",
    agency: "Mazarine",
    introText: [
      "YSL Beauty's first global Eid campaign marked a milestone for the luxury house, celebrating one of the region's most important cultural moments through a contemporary lens.",
      "Inspired by the warmth and cinematic beauty of desert sunsets, I collaborated with YSL Beauty's global and regional teams to develop the creative direction for a series of capsule films featuring brand ambassadors from the GCC and Southeast Asia.",
      "The challenge was to honour local cultural nuances while remaining unmistakably YSL, balancing authenticity with the brand's iconic visual codes. The result was a refined campaign that connected with regional audiences while maintaining a cohesive global luxury identity.",
    ],

    // Both Figma frames tag the hero as video. The delivered
    // YSL-HomeBanner-Mobile.mp4 is byte-identical to gallery clip 3
    // (md5 534aebbc… — Drive copy re-verified 2026-07-15, same file), i.e.
    // the EID MUBARAK gift-box cut, a proper 720×1280 portrait edit. Per
    // Rafael's call (2026-07-15) it plays as the mobile banner as
    // delivered — closes CLIENT-ASKS #1.
    heroVideo: {
      desktop: "/assets/ysl/ysl-hero-video.mp4",
      mobile: "/assets/ysl/ysl-hero-video-mobile.mp4",
      poster: "/assets/ysl/ysl-hero-cover.webp",
      // Banner muxed with its source audio (audio toggle).
      hasAudio: true,
    },

    heroImage: {
      desktop: "/assets/ysl/ysl-1.webp",
      mobile: "/assets/ysl/ysl-1-mobile.webp",
      alt: "YSL editorial hero",
      objectFit: "contain",
    },

    year: "2024",

    credits: [
      {
        role: "Talent",
        name: "Nada Daeshen (GCC), Meerqeen (Malaysia), Luna Maya (Indonesia)",
      },
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
        hasAudio: true,
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
        hasAudio: true,
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
        hasAudio: true,
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
        hasAudio: true,
        mobile: "/assets/ysl/ysl-video-13-mobile.mp4",
        poster: "/assets/ysl/ysl-13.webp",
        alt: "ysl video 12",
      },
    ],

    metaTitle: "Yves Saint Laurent Beauty",
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
    title: "WAOMAG Showcase",
    subtitle: "Creative Direction",
    headerTheme: "light",
    description:
      "As founder and Creative Director of We Are One Magazine (WAOMAG), I use the channel as a laboratory for experimentation across image-making, graphic design, culture and emerging creative technologies.",
    editorialSubtitle: "Creative Direction",
    location: "São Paulo, Brazil",
    introText: [
      "As founder and Creative Director of We Are One Magazine (WAOMAG), I use the channel as a laboratory for experimentation across image-making, graphic design, culture and emerging creative technologies.",
      "From fashion editorials exploring unconventional photographic techniques to experimental editorial design, cultural interviews, street-style storytelling and AI-generated fashion films, WAOMAG continuously pushes the boundaries of visual communication while remaining rooted in a cosmopolitan perspective.",
    ],

    heroImage: {
      desktop: "/assets/wao-cosmo/wao-cosmo-1.webp",
      mobile: "/assets/wao-cosmo/wao-cosmo-1-mobile.webp",
      alt: "wao-cosmo hero",
      objectFit: "contain",
    },

    year: "2024",

    credits: [
      { role: "Creative Director", name: "Vitor Milito" },
      { role: "Photographer", name: "Muraca" },
      { role: "Model", name: "Luiza Tozelli (WAY)" },
      { role: "Stylist", name: "Paulo Faria" },
      { role: "HMU", name: "Vini Vieira" },
    ],

    media: [
      {
        type: "video",
        // Video1 — COSMOPOLITAN covers collage (Figma-tagged slot)
        desktop: "/assets/wao-cosmo/wao-cosmo-video-2.mp4",
        poster: "/assets/wao-cosmo/wao-cosmo-2.webp",
        aspect: "720/960",
        alt: "wao-cosmo video 1",
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
        type: "video",
        // Video2 — white puffer with dog
        desktop: "/assets/wao-cosmo/wao-cosmo-video-13.mp4",
        hasAudio: true,
        poster: "/assets/wao-cosmo/wao-cosmo-13.webp",
        aspect: "720/1137",
        alt: "wao-cosmo video 12",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "video",
        // Video3 — dark photo collage
        desktop: "/assets/wao-cosmo/wao-cosmo-video-14.mp4",
        poster: "/assets/wao-cosmo/wao-cosmo-14.webp",
        aspect: "720/1065",
        inset: "12.77% 5.83% 12.11% 11.11%",
        alt: "wao-cosmo video 13",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "video",
        // Video4 — street duo ("My name is Zumi")
        desktop: "/assets/wao-cosmo/wao-cosmo-video-15.mp4",
        hasAudio: true,
        poster: "/assets/wao-cosmo/wao-cosmo-15.webp",
        aspect: "720/1065",
        // Top gutter bumped from the measured 0% per review — was too close
        // to the row above.
        inset: "5% 11.39% 0% 5.56%",
        alt: "wao-cosmo video 14",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "video",
        // Video5 — red dress on the curb
        desktop: "/assets/wao-cosmo/wao-cosmo-video-16.mp4",
        hasAudio: true,
        poster: "/assets/wao-cosmo/wao-cosmo-16.webp",
        aspect: "720/1194",
        inset: "0% 5.56% 10.89% 11.39%",
        alt: "wao-cosmo video 15",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "video",
        // Video6 — yellow dress at the doorway
        desktop: "/assets/wao-cosmo/wao-cosmo-video-17.mp4",
        hasAudio: true,
        poster: "/assets/wao-cosmo/wao-cosmo-17.webp",
        aspect: "720/1194",
        inset: "10.89% 11.39% 0% 5.56%",
        alt: "wao-cosmo video 16",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "video",
        // Video7 — VETEMENTS coat over the bridge
        desktop: "/assets/wao-cosmo/wao-cosmo-video-18.mp4",
        poster: "/assets/wao-cosmo/wao-cosmo-18.webp",
        aspect: "720/1191",
        inset: "0% 5.56% 10.83% 11.39%",
        alt: "wao-cosmo video 17",
        // Was `true` (38 desktop / 15 mobile); desktop kept, mobile
        // standardised to the 55 gap used between stacked slots.
        spaceBefore: { mobile: 55, desktop: 38 },
      },
      {
        type: "video",
        // Video8 — escalator
        desktop: "/assets/wao-cosmo/wao-cosmo-video-19.mp4",
        poster: "/assets/wao-cosmo/wao-cosmo-19.webp",
        aspect: "720/1191",
        inset: "10.92% 11.39% 0% 5.56%",
        alt: "wao-cosmo video 18",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      {
        type: "video",
        // Video9 — tan coat, blurred street
        desktop: "/assets/wao-cosmo/wao-cosmo-video-20.mp4",
        poster: "/assets/wao-cosmo/wao-cosmo-20.webp",
        aspect: "720/1194",
        inset: "0% 5.56% 19.1% 11.39%",
        alt: "wao-cosmo video 19",
        spaceBefore: { mobile: 55, desktop: 55 },
      },
      {
        type: "video",
        // Video10 — evening street reflection
        desktop: "/assets/wao-cosmo/wao-cosmo-video-21.mp4",
        poster: "/assets/wao-cosmo/wao-cosmo-21.webp",
        aspect: "720/1194",
        inset: "10.89% 11.39% 6.2% 5.56%",
        alt: "wao-cosmo video 20",
        spaceBefore: { mobile: 55, desktop: 0 },
      },
      // The two trailing mobileOnly stills (wao-cosmo-21/20 covers) were
      // removed per review 2026-07-15 — they duplicated the clips above
      // them once videos 20/21 started playing on mobile.
    ],

    metaTitle: "WAOMAG",
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
    title: "Vivara - Summer Campaign",
    subtitle: "Art Direction",
    headerTheme: "light",
    description:
      "For over a decade, Gisele Bündchen has been the face of Vivara, appearing in four major campaigns each year.",
    editorialSubtitle: "Art Direction",
    location: "São Paulo, Brazil",
    agency: "GB65",
    introText: [
      "For over a decade, Gisele Bündchen has been the face of Vivara, appearing in four major campaigns each year. The creative challenge is continually reinventing the visual narrative while preserving the strength and recognition of such an enduring partnership.",
      "Working under the creative direction of Giovanni Bianco, I contributed to campaigns that refreshed the brand's aesthetic season after season, balancing timeless elegance with contemporary luxury to keep each collection feeling distinctive and relevant.",
    ],

    heroVideo: {
      desktop: "/assets/vivara/vivara-hero-video.mp4",
      mobile: "/assets/vivara/vivara-hero-video-mobile.mp4",
      poster: "/assets/vivara/vivara-hero-cover.webp",
      // Banner muxed with its source audio (audio toggle).
      hasAudio: true,
    },

    heroImage: {
      desktop: "/assets/vivara/vivara-1.webp",
      mobile: "/assets/vivara/vivara-1-mobile.webp",
      alt: "vivara hero",
      objectFit: "contain",
    },

    year: "2024",

    credits: [
      { role: "Creative Director", name: "Giovanni Bianco" },
      { role: "Art Director", name: "Vitor Milito" },
      { role: "Photographers", name: "MAR+VIN" },
      { role: "Talent", name: "Gisele Bündchen" },
      { role: "HMU", name: "Henrique Martins" },
      { role: "Styling", name: "Pedro Sales" },
      { role: "DoP", name: "William Etchebehere" },
      { role: "Post Production", name: "Bruno Rezende" },
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

    metaTitle: "Vivara",
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
    title: "Life By Vivara - Summer Campaign",
    subtitle: "Art Direction",
    headerTheme: "light",
    description:
      "Featuring actress Marina Ruy Barbosa, the Life by Vivara Summer Campaign drew inspiration from Marrakech, capturing a vibrant, contemporary expression of luxury.",
    editorialSubtitle: "Art Direction",
    location: "São Paulo, Brazil",
    agency: "GB65",
    introText: [
      "Featuring actress Marina Ruy Barbosa, the Life by Vivara Summer Campaign drew inspiration from Marrakech, capturing a vibrant, contemporary expression of luxury designed to resonate with a younger generation of consumers.",
      "Working alongside Creative Director Giovanni Bianco, I contributed to the campaign's visual development, helping shape a world that balanced aspirational fashion imagery with the warmth, colour and energy of its destination-inspired narrative.",
    ],

    heroVideo: {
      desktop: "/assets/life/life-hero-video.mp4",
      mobile: "/assets/life/life-hero-video-mobile.mp4",
      poster: "/assets/life/life-hero-cover.webp",
      // Banner muxed with its source audio (audio toggle).
      hasAudio: true,
    },

    heroImage: {
      desktop: "/assets/life/life-1.webp",
      mobile: "/assets/life/life-1-mobile.webp",
      alt: "life hero",
      objectFit: "contain",
    },

    year: "2024",

    credits: [
      { role: "Creative Director", name: "Giovanni Bianco" },
      { role: "Art Director", name: "Vitor Milito" },
      { role: "Photographer", name: "Lufree" },
      { role: "Talent", name: "Marina Ruy Barbosa" },
      { role: "HMU", name: "Henrique Martins" },
      { role: "Styling", name: "Rita Lazzarotti" },
      { role: "DoP", name: "William Etchebehere" },
      { role: "Post Production", name: "Bruno Rezende" },
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

    metaTitle: "Life by Vivara",
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
    title: "SK-II - Your Truest Self",
    subtitle: "Creative Direction",
    description:
      "Working with Shophouse, I contributed to the global visual refresh of SK-II, helping define a new creative direction for talent, product and ingredient imagery.",
    editorialSubtitle: "Creative Direction",
    location: "Shot in New York, Hong Kong and Tokyo",
    agency: "Shophouse",
    introText: [
      "Working with Shophouse, I contributed to the global visual refresh of SK-II, helping define a new creative direction for talent, product and ingredient imagery.",
      "The campaign established a comprehensive visual system that became the foundation for brand assets and creative guidelines used by agency partners across local markets. Principal photography took place in Hong Kong, while product and ingredient imagery was produced in New York.",
      "The creative challenge was to reinforce SK-II's leadership across Asia while broadening its appeal to Western audiences. This meant finding a contemporary visual expression for the brand's 50-year heritage and its iconic ingredient, Pitera™, through a more optimistic, natural aesthetic, combining dynamic talent imagery, minimalist product photography and multisensory ingredient visualisation.",
    ],

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
      { role: "Creative Director", name: "Vitor Milito" },
      { role: "Photographer & Director", name: "Paola Kudacki" },
      { role: "Still Life", name: "Kat Borchart" },
      { role: "Talent", name: "Tang Wei, Haruka Ayase" },
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
        // Figma tags this slot (not the hero) as the video — desktop only.
        // Mobile shows the static sk-8 crop via the mobileOnly twin below.
        type: "video",
        desktop: "/assets/sk/sk-video-8.mp4",
        hasAudio: true,
        poster: "/assets/sk/sk-8.webp",
        alt: "sk video 7",
        span: "full",
        desktopOnly: true,
        // Match Marie Claire's full-width rows: 150px above AND below so the
        // module under the horizontal photo isn't touching it (Figma comment #12).
        spaceBefore: 150,
        spaceAfter: 150,
      },
      {
        type: "image",
        desktop: "/assets/sk/sk-8.webp",
        mobile: "/assets/sk/sk-8-mobile.webp",
        alt: "sk image 7",
        span: "full",
        mobileOnly: true,
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

    metaTitle: "SK-II",
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
    title: "BUCHERER - The Summer of Indulgence",
    subtitle: "Creative Direction",
    description:
      "The Summer of Indulgence was a 360° campaign celebrating the pleasures of the season while showcasing Bucherer's jewellery, watches and luxury retail experience.",
    editorialSubtitle: "Creative Direction",
    location: "Shot in Zurich, Switzerland",
    agency: "Spring Studios",
    introText: [
      "The Summer of Indulgence was a 360° campaign celebrating the pleasures of the season while showcasing Bucherer's jewellery, watches and luxury retail experience.",
      "Inspired by the warmth and joy of summer, we developed a vibrant creative concept built around colourful visuals, playful copy and nostalgic ice cream references. Bucherer boutiques were transformed into luxurious gelaterias, inviting customers to indulge in scoops of flavour while discovering the latest collections.",
      "The campaign unified multiple retail offerings under a single creative platform, delivering a cohesive brand experience across retail, digital, social media and marketing communications.",
    ],

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
        // Figma tags this slot as the project's one video (both frames) —
        // the March 4x5.mp4 collage clip. Same file plays on mobile.
        type: "video",
        desktop: "/assets/bucherer/bucherer-video-8.mp4",
        poster: "/assets/bucherer/bucherer-8.webp",
        alt: "bucherer video 7",
      },
      {
        type: "image",
        desktop: "/assets/bucherer/bucherer-9.webp",
        mobile: "/assets/bucherer/bucherer-9-mobile.webp",
        alt: "bucherer image 8",
      },
    ],

    credits: [
      { role: "Creative Director", name: "Vitor Milito" },
      { role: "Copywriter", name: "Vanessa da Silva" },
      { role: "Photographer", name: "Armin Zogbaum" },
      { role: "Set Designer", name: "Rahel Morgen" },
      { role: "Producer", name: "Maria De Luca" },
      { role: "Post Production", name: "Spring Studios" },
    ],

    metaTitle: "BUCHERER",
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
    title: "Bucherer Fine Jewellery - Collections",
    subtitle: "Creative Direction",
    description:
      "Spring Studios was commissioned to develop a comprehensive content strategy for Bucherer Fine Jewellery, creating distinct visual worlds for each jewellery collection.",
    editorialSubtitle: "Creative Direction",
    location: "Shot in Cape Town, South Africa",
    agency: "Spring Studios",
    introText: [
      "Spring Studios was commissioned to develop a comprehensive content strategy for Bucherer Fine Jewellery, creating distinct visual worlds for each jewellery collection.",
      "From the bohemian spirit of Peekaboo to the understated minimalism of B Dimension, we developed eight unique personas, each defined by their own lifestyle, aspirations and attitude.",
      "Across multiple locations, we produced editorial photography, still life and film that brought each collection to life. The resulting assets were deployed across digital campaigns, e-commerce, social media, DOOH, print collateral and in-store experiences, establishing a cohesive visual language across every customer touchpoint.",
    ],

    heroVideo: {
      desktop: "/assets/bfj/bfj-hero-video.mp4",
      mobile: "/assets/bfj/bfj-hero-video-mobile.mp4",
      poster: "/assets/bfj/bfj-hero-cover.webp",
      // Banner muxed with its source audio (audio toggle).
      hasAudio: true,
    },

    heroImage: {
      desktop: "/assets/bfj/bfj-1.webp",
      mobile: "/assets/bfj/bfj-1-mobile.webp",
      alt: "bfj hero",
      objectFit: "contain",
    },

    year: "2024",

    credits: [
      { role: "Group Creative Director", name: "Matt Brooke" },
      { role: "Art Director", name: "Vitor Milito" },
      { role: "CD Copy", name: "Jessica Clark" },
      { role: "Photographers", name: "Sebastian Sabal-Bruce, Luke Kuisis" },
      { role: "Film Director", name: "Jon Clements" },
      { role: "Stylist", name: "Anne-Marie Curtis" },
      { role: "Post Production", name: "Spring Studios" },
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

    metaTitle: "Bucherer Fine Jewellery",
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
    title: "OURONYX - Beauty Has Power",
    subtitle: "Creative Direction",
    description:
      "Beauty Has Power was the launch campaign for OURONYX, a next-generation aesthetic wellness brand, created to build awareness and drive conversion across key international markets.",
    editorialSubtitle: "Creative Direction",
    location: "London, UK",
    agency: "Spring Studios",
    introText: [
      "Beauty Has Power was the launch campaign for OURONYX, a next-generation aesthetic wellness brand, created to build awareness and drive conversion across key international markets.",
      "From the outset, I helped shape the brand's creative vision, from naming, visual identity and clinic interiors to the art direction of the launch campaign. We developed a sophisticated visual language featuring premium talent that reflected the brand's international audience and elevated positioning.",
      "Beyond the campaign, the project encompassed a complete digital ecosystem, including doctor-led video content, an immersive website with interactive features and an integrated booking platform, alongside a comprehensive social media programme supporting both launch and ongoing brand growth.",
    ],

    heroVideo: {
      desktop: "/assets/ouronyx/ouronyx-hero-video.mp4",
      mobile: "/assets/ouronyx/ouronyx-hero-video-mobile.mp4",
      poster: "/assets/ouronyx/ouronyx-hero-cover.webp",
      // Banner muxed with its source audio (audio toggle).
      hasAudio: true,
    },

    heroImage: {
      desktop: "/assets/ouronyx/ouronyx-1.webp",
      mobile: "/assets/ouronyx/ouronyx-1-mobile.webp",
      alt: "ouronyx hero",
      objectFit: "contain",
      mobileFit: "natural",
    },

    year: "2024",

    // Placeholder credits (same set as the other projects) until the real
    // Ouronyx crew list is supplied from the Figma column.
    // Real credits per the client text delivery 2026-07-20 (closes
    // CLIENT-ASKS #4 — was the shared placeholder crew).
    credits: [
      { role: "Creative Directors", name: "Vitor Milito, Jessica Clark" },
      { role: "Photographer", name: "Scott Trindle" },
      { role: "Film Director", name: "Kloss Films" },
      {
        role: "Talent",
        name: "Daniel Ricciardo, Caroline Issa, Jessica Kahawaty",
      },
      { role: "Post Production", name: "Spring Studios" },
    ],

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
        // Per Vitor's Figma comments ("VIDEO 1" desktop / "VIDEO MOBILE 1"
        // mobile): the 52s brand film plays here on both breakpoints, each
        // with its delivered edit. It opens on exactly this slot's still,
        // which stays as poster.
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-8.mp4",
        hasAudio: true,
        mobile: "/assets/ouronyx/ouronyx-video-8-mobile.mp4",
        poster: "/assets/ouronyx/ouronyx-8.webp",
        alt: "ouronyx video 7",
        span: "full",
        // Mobile-only border (Vitor 2026-07-14): the 440×550 mobile edit
        // can't survive a full-bleed ~3× phone upscale even at max encode
        // quality (grain-tuned CRF 20) — rendering it smaller keeps the
        // title text legible. Desktop (1440×830) stays full-bleed.
        mobileGutter: "13%",
        spaceBefore: { mobile: 0, desktop: 60 },
      },
      // Rows 9-12 — user-supplied stills (2026-07-10, Figma exports) paired
      // with the tagged phone-UI and tablet-mockup videos. Both videos have
      // distinct delivered mobile edits.
      {
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-9.webp",
        alt: "ouronyx image 9",
        // Usual Ouronyx desktop gap to the studio row above (matches slot 8).
        spaceBefore: { mobile: 0, desktop: 60 },
      },
      {
        // Tagged video — Instagram/phone UI (WEB 2; MOBILE 2 edit below md)
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-10.mp4",
        mobile: "/assets/ouronyx/ouronyx-video-10-mobile.mp4",
        poster: "/assets/ouronyx/ouronyx-10.webp",
        // Quality mitigation (Vitor 2026-07-14, "aumentar as bordas"): the
        // delivered clip is only 484×638 (mobile 300×388) — rendered smaller
        // on white so it upscales less. Inner area is ratio-matched to the
        // clip; interim until the hi-res re-exports (CLIENT-ASKS #5) land.
        aspect: "720/900",
        inset: "15% 16.8% 15% 16.8%",
        mobileGutter: "15%",
        alt: "ouronyx video 10",
      },
      {
        // Mobile-only: per design review (Diego), the arms-up image follows
        // the phone-UI video on mobile, flush (no gap) — desktop shows it
        // in the 11|12 pair (that slot is desktopOnly).
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-12.webp",
        mobile: "/assets/ouronyx/ouronyx-12-mobile.webp",
        alt: "ouronyx image 12",
        span: "full",
        mobileOnly: true,
      },
      {
        // Tagged video — tablet website mockup (WEB 3; MOBILE 3 edit below
        // md — Vitor's mobile pin "VIDEO 3" confirms this card follows the
        // arms-up image directly; the MOBILE 7 close-up card was removed
        // per review 2026-07-13)
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-11.mp4",
        mobile: "/assets/ouronyx/ouronyx-video-11-mobile.mp4",
        poster: "/assets/ouronyx/ouronyx-11.webp",
        // Same quality mitigation as the phone-UI card above (484×638 /
        // 300×388 sources) — see CLIENT-ASKS #5.
        aspect: "720/900",
        inset: "15% 16.8% 15% 16.8%",
        mobileGutter: "15%",
        alt: "ouronyx video 11",
      },
      {
        // Desktop pair partner of the tablet video; on mobile this image
        // renders earlier (after the phone-UI video) via its mobileOnly twin.
        type: "image",
        desktop: "/assets/ouronyx/ouronyx-12.webp",
        alt: "ouronyx image 12",
        desktopOnly: true,
      },
      {
        // Tagged video — the wide website mockup film (WEB 4).
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-13.mp4",
        hasAudio: true,
        poster: "/assets/ouronyx/ouronyx-13.webp",
        alt: "ouronyx video 13",
        span: "full",
        // Usual Ouronyx 60px desktop air both sides; mobile untouched.
        spaceBefore: { mobile: 0, desktop: 60 },
        spaceAfter: { mobile: 0, desktop: 60 },
      },
      // Slots 14-18 are STATICS per the Figma tags (only the hero, phone-UI,
      // tablet and website rows are video). Stills come from the delivered
      // clips' design frames; desktop-only until mobile crops arrive
      // (renderer falls back to desktop per the no-manual-crops rule).
      {
        // Tagged video — cream OURONYX "Light" card (WEB 5), inset on the
        // beige panel per Figma (color sampled from the delivered covers).
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-14.mp4",
        poster: "/assets/ouronyx/ouronyx-14.webp",
        // The beige panel from an earlier design pass was a mistake
        // (confirmed by the designer) — the cream card sits inset on WHITE
        // within the pair-aligned 720/900 box (same measured geometry,
        // panel colour dropped).
        aspect: "720/900",
        inset: "14.6% 16.4% 14.6% 16.9%",
        // Mobile: the cream card sits inset from the column edges per Figma.
        mobileGutter: "13%",
        alt: "ouronyx video 14",
      },
      {
        // Tagged video — smiling woman (WEB 6); natural 720×900 matches the
        // partner card, so the pair aligns.
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-15.mp4",
        hasAudio: true,
        poster: "/assets/ouronyx/ouronyx-15.webp",
        alt: "ouronyx video 15",
      },
      {
        // Vitor pin "VIDEO 7" — the denim stool interview clip (same file
        // both breakpoints; opens on this slot's still, kept as poster).
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-16.mp4",
        poster: "/assets/ouronyx/ouronyx-16.webp",
        alt: "ouronyx video 16",
      },
      {
        // Vitor pin "VIDEO 8" — the man portrait clip (same file both
        // breakpoints; opens on this slot's still, kept as poster).
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-17.mp4",
        poster: "/assets/ouronyx/ouronyx-17.webp",
        alt: "ouronyx video 17",
      },
      {
        // Vitor pins "VIDEO 9" (both frames) — the interview film plays on
        // both breakpoints with its delivered edits (WEB 9 wide, MOBILE 9
        // portrait). Both open on the black logo card, kept as poster.
        type: "video",
        desktop: "/assets/ouronyx/ouronyx-video-18.mp4",
        // Desktop mix is real; the MOBILE 9 export ships a silent track.
        hasAudio: { desktop: true, mobile: false },
        mobile: "/assets/ouronyx/ouronyx-video-18-mobile.mp4",
        poster: "/assets/ouronyx/ouronyx-18.webp",
        alt: "ouronyx video 18",
        span: "full",
        spaceBefore: { mobile: 55, desktop: 60 },
      },
    ],

    metaTitle: "Ouronyx",
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
    title: "BRIDE Magazine",
    subtitle: "Creative Direction",
    headerTheme: "light",
    description:
      "As Creative Director of BRIDE, São Paulo's leading trade fair for the luxury wedding industry, I expanded the brand beyond the annual event into a multi-platform creative business.",
    editorialSubtitle: "Creative Direction",
    location: "São Paulo, Brazil",
    introText: [
      "As Creative Director of BRIDE, São Paulo's leading trade fair for the luxury wedding industry, I expanded the brand beyond the annual event into a multi-platform creative business.",
      "I conceived and launched BRIDE Magazine, leading its editorial vision while developing the publication's branding and design system. I oversaw creative direction across content, design and production, while building strategic partnerships with brands, photographers, designers and industry collaborators.",
      "Under this expanded vision, BRIDE also evolved into a creative agency, delivering branding, editorial and design projects for clients across the luxury wedding ecosystem. The result was a cohesive brand platform that extended BRIDE's influence beyond the event, establishing it as a year-round creative and editorial authority within the industry.",
    ],

    heroVideo: {
      desktop: "/assets/bride-story/bride-story-hero-video.mp4",
      mobile: "/assets/bride-story/bride-story-hero-video-mobile.mp4",
      poster: "/assets/bride-story/bride-story-hero-cover.webp",
      // Text-free frame-0 of the portrait edit — the landscape poster above
      // bakes the BRIDE title and flashed over the mobile video while it
      // loaded (live review 2026-07-20).
      posterMobile: "/assets/bride-story/bride-story-hero-cover-mobile.webp",
      // Whole-frame hero (review 2026-07-20): the baked "BRIDE" title sits
      // at the frame's left edge and cover-crop cut it in tall windows.
      // Contain renders the 1920×1080 banner as a natural-aspect band that
      // scales with the viewport above lg; below lg the portrait edit
      // plays full-bleed (it's composed for tall boxes).
      objectFit: "contain",
      // Desktop banner has a full mix; the delivered mobile export ships a
      // digitally silent track (max −91 dB), so no toggle below md.
      hasAudio: { desktop: true, mobile: false },
    },

    heroImage: {
      desktop: "/assets/bride-story/bride-story-1.webp",
      mobile: "/assets/bride-story/bride-story-1-mobile.webp",
      alt: "bride-story hero",
      objectFit: "contain",
    },

    year: "2024",

    credits: [
      { role: "Creative Director", name: "Vitor Milito" },
      {
        role: "Photographers",
        name: "Fernando Tomaz, Hugo Toni, Marcio Scavone, Alex Korolkovas",
      },
      { role: "Stylists", name: "Thiago Biagi, Henrique Tank" },
      { role: "HMU", name: "Krishna Carvalho" },
      {
        role: "Models",
        name: "Isabel Hickman, Amanda Lopes, Paula Zago, Michele Provenze",
      },
      { role: "Post Production", name: "Bruno Rezende, Fujioka" },
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

    metaTitle: "BRIDE",
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
    title: "Harrods Restaurants",
    subtitle: "Creative Direction",
    description:
      "When Harrods set out to reposition its portfolio of restaurants, I was brought in to lead the destination's creative direction across digital channels.",
    editorialSubtitle: "Creative Direction",
    location: "London, UK",
    introText: [
      "When Harrods set out to reposition its portfolio of restaurants, I was brought in to lead the destination's creative direction across digital channels.",
      "Over the course of a year, I helped relaunch the restaurants' digital presence, developed paid campaign creative, and planned and directed a continuous programme of organic content production across five restaurants. The strategy established a more cohesive visual identity while driving growth across social channels, particularly Instagram.",
    ],

    heroVideo: {
      desktop: "/assets/harrods/harrods-hero-video.mp4",
      mobile: "/assets/harrods/harrods-hero-video-mobile.mp4",
      poster: "/assets/harrods/harrods-hero-cover.webp",
      // Banner files muxed with their source audio (audio-toggle pilot).
      hasAudio: true,
    },

    heroImage: {
      desktop: "/assets/harrods/harrods-1.webp",
      mobile: "/assets/harrods/harrods-1-mobile.webp",
      alt: "harrods hero",
      objectFit: "contain",
      mobileFit: "natural",
    },

    year: "2024",

    // No credits: the client text batch (2026-07-20) provided none for
    // Harrods, so the section is omitted entirely (it renders only when
    // the list is non-empty) — see CLIENT-ASKS #8. The old shared
    // placeholder crew was removed per review; add the real list when
    // Vitor sends it.

    media: [
      {
        // Per Vitor's Figma comment pin ("VIDEO 1" — pinned on the MOBILE
        // column only): the dining clip plays in this slot below md; desktop
        // keeps the still (SK sk-8 twin pattern, mirrored). Full-span row of
        // its own so the desktop pair flow is untouched; the mobile still is
        // full-bleed, so the clip runs edge-to-edge at natural aspect.
        type: "video",
        desktop: "/assets/harrods/harrods-video-2.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-2-mobile.webp",
        alt: "harrods video 1",
        span: "full",
        mobileOnly: true,
      },
      {
        // Desktop half of the twin — static on desktop per the pin's
        // mobile-only placement.
        type: "image",
        desktop: "/assets/harrods/harrods-2.webp",
        mobile: "/assets/harrods/harrods-2-mobile.webp",
        alt: "harrods image 1",
        desktopOnly: true,
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-3.webp",
        mobile: "/assets/harrods/harrods-3-mobile.webp",
        alt: "harrods image 2",
      },
      {
        // Mobile twin for VIDEO 2: on the mobile Figma column Vitor pins the
        // clip on the champagne-woman frame — which is harrods-4's MOBILE
        // crop (the mobile column swaps this pair's positions vs desktop).
        // Same clip file as the desktop slot-5 card; the full-bleed woman
        // crop stays as poster. Full-span row so desktop pairing is
        // untouched.
        type: "video",
        desktop: "/assets/harrods/harrods-video-5.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-4-mobile.webp",
        alt: "harrods video 3",
        span: "full",
        mobileOnly: true,
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-4.webp",
        mobile: "/assets/harrods/harrods-4-mobile.webp",
        alt: "harrods image 3",
        // Middle-aligned against the taller portrait video in the pair.
        align: "center",
        // Mobile shows this position as the VIDEO 2 twin above.
        desktopOnly: true,
      },
      {
        // Per Vitor's Figma comment pin ("VIDEO 2"): the dining-montage clip
        // plays in this pair slot on DESKTOP. On mobile the clip moves one
        // position earlier (the pin sits on the woman frame there) and this
        // slot renders its framed still instead — see the twins around it.
        type: "video",
        desktop: "/assets/harrods/harrods-video-5.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-5.webp",
        // The still bakes the card frame: photo 592×1056 at (44,4) in the
        // 720×1065 canvas — tight inner edge (toward the pair gap), wide
        // outer edge. The clip plays inside that photo area.
        aspect: "720/1065",
        inset: "0.4% 11.7% 0.5% 6.1%",
        alt: "harrods video 4",
        desktopOnly: true,
      },
      {
        // Mobile twin for the slot-5 position: the framed gold-bag card
        // (its 60px margins are baked into the mobile crop).
        type: "image",
        desktop: "/assets/harrods/harrods-5.webp",
        mobile: "/assets/harrods/harrods-5-mobile.webp",
        alt: "harrods image 4",
        span: "full",
        mobileOnly: true,
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-6.webp",
        mobile: "/assets/harrods/harrods-6-mobile.webp",
        alt: "harrods image 5",
        span: "full",
        spaceBefore: { mobile: 0, desktop: 50 },
        spaceAfter: { mobile: 27, desktop: 50 },
      },
      {
        // Per Vitor's Figma comment pin ("VIDEO 3"): the caviar clip plays in
        // this pair slot. WEB 3 ≡ MOBILE 3 byte-for-byte — one file, both
        // breakpoints.
        type: "video",
        desktop: "/assets/harrods/harrods-video-7.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-7.webp",
        // Mirror of slot 5's card: photo 592×1056 at (86,4) — wide outer
        // edge (left cell), tight inner edge. Mobile still is full-bleed,
        // so no mobileGutter here.
        aspect: "720/1065",
        inset: "0.4% 5.8% 0.5% 11.9%",
        alt: "harrods video 6",
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-8.webp",
        mobile: "/assets/harrods/harrods-8-mobile.webp",
        alt: "harrods image 7",
        // Middle-aligned against the taller portrait video in the pair.
        align: "center",
      },
      {
        // Desktop only: the mobile crop of this still is the burrata dish,
        // which would duplicate the VIDEO 4 clip right below it in the
        // mobile stack (removed per review 2026-07-14).
        type: "image",
        desktop: "/assets/harrods/harrods-9.webp",
        mobile: "/assets/harrods/harrods-9-mobile.webp",
        alt: "harrods image 8",
        desktopOnly: true,
      },
      {
        // Per Vitor's Figma comment pin ("VIDEO 4"): the burrata clip plays
        // in this pair slot. WEB 4 ≡ MOBILE 4 byte-for-byte — one file, both
        // breakpoints.
        type: "video",
        desktop: "/assets/harrods/harrods-video-10.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-10.webp",
        // Right-cell card like slot 5: photo 592×1056 at (46,4) in the
        // 720×1065 canvas. Mobile still is full-bleed — no gutter.
        aspect: "720/1065",
        inset: "0.4% 11.4% 0.5% 6.4%",
        alt: "harrods video 9",
        // 20% off the standard 55 per review — the stack around this clip
        // read too airy on mobile.
        spaceBefore: { mobile: 44, desktop: 0 },
        spaceAfter: { mobile: 44, desktop: 0 },
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-11.webp",
        mobile: "/assets/harrods/harrods-11-mobile.webp",
        alt: "harrods image 10",
        span: "full",
        spaceBefore: { mobile: 0, desktop: 50 },
        spaceAfter: { mobile: 0, desktop: 50 },
      },
      {
        // Per Vitor's Figma comment pin ("VIDEO 5"): the sushi clip plays in
        // this pair slot. WEB 5 ≡ MOBILE 5 byte-for-byte — one file, both
        // breakpoints.
        type: "video",
        desktop: "/assets/harrods/harrods-video-12.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-12.webp",
        // Left-cell card, same geometry as slot 7: photo 592×1056 at (86,4)
        // in the 720×1065 canvas. Mobile plays full-bleed (gutter removed
        // per review 2026-07-14).
        aspect: "720/1065",
        inset: "0.4% 5.8% 0.5% 11.9%",
        alt: "harrods video 11",
        // Mobile separation from the stills around it (desktop pair row
        // untouched).
        spaceBefore: { mobile: 44, desktop: 0 },
        spaceAfter: { mobile: 44, desktop: 0 },
      },
      {
        // Desktop cell of the 12|13 pair; on mobile this position renders
        // via the two mobileOnly fulls below (user-supplied carpaccio card
        // first, then this slot's own crop).
        type: "image",
        desktop: "/assets/harrods/harrods-13.webp",
        mobile: "/assets/harrods/harrods-13-mobile.webp",
        alt: "harrods image 12",
        desktopOnly: true,
      },
      {
        // Mobile-only: user-supplied carpaccio close-up (Figma export,
        // framed-card format with the 60px margins baked in) — inserted
        // before slot 13 per review 2026-07-14.
        type: "image",
        desktop: "/assets/harrods/harrods-12a-mobile.webp",
        alt: "harrods image 11a",
        span: "full",
        mobileOnly: true,
      },
      {
        // Mobile twin for the slot-13 position — per Vitor's mobile-column
        // pin ("VIDEO 6") the cocktails clip plays here below md. Same file
        // as the desktop slot-15 card; this position's mobile crop is the
        // cocktails frame and stays as poster.
        type: "video",
        desktop: "/assets/harrods/harrods-video-15.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-13-mobile.webp",
        alt: "harrods video 12",
        span: "full",
        mobileOnly: true,
      },
      {
        type: "image",
        desktop: "/assets/harrods/harrods-14.webp",
        mobile: "/assets/harrods/harrods-14-mobile.webp",
        alt: "harrods image 13",
      },
      {
        // Per Vitor's Figma comment pin ("VIDEO 6"): the cocktails clip plays
        // in this pair slot. WEB 6 ≡ MOBILE 6 byte-for-byte — one file, both
        // breakpoints.
        type: "video",
        desktop: "/assets/harrods/harrods-video-15.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-15.webp",
        // Right-cell card, same geometry as slot 10: photo 592×1056 at
        // (46,4) in the 720×1065 canvas. Desktop only — on mobile this clip
        // plays at the slot-13 position per the mobile-column pin, and this
        // slot's own mobile crop would duplicate it (slot-9 rule).
        aspect: "720/1065",
        inset: "0.4% 11.4% 0.5% 6.4%",
        alt: "harrods video 14",
        desktopOnly: true,
      },
      {
        // Per Vitor's Figma comment pin ("VIDEO 7"): the chocolate-dessert
        // clip plays in this pair slot. WEB 7 ≡ MOBILE 7 byte-for-byte — one
        // file, both breakpoints.
        type: "video",
        desktop: "/assets/harrods/harrods-video-16.mp4",
        hasAudio: true,
        poster: "/assets/harrods/harrods-16.webp",
        // Left-cell card: photo 592×1056 at (86,6). This still exports at
        // 719×1066 (off-by-one vs the 720×1065 siblings), so the numbers
        // are taken from the actual file. Mobile plays full-bleed (gutter
        // removed per review 2026-07-14).
        aspect: "719/1066",
        inset: "0.6% 5.7% 0.4% 12.0%",
        alt: "harrods video 15",
      },
      {
        // Renders on both breakpoints: desktop as the pair partner of the
        // chocolate clip, mobile stacked after it (per the mobile column).
        // Mobile crop = delivered HAR_MOB_16 (centered card), fixing the
        // off-center look of the asymmetric desktop card below md.
        type: "image",
        desktop: "/assets/harrods/harrods-17.webp",
        mobile: "/assets/harrods/harrods-17-mobile.webp",
        alt: "harrods image 16",
      },
    ],

    metaTitle: "Harrods",
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
