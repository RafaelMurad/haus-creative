import Image from "next/image";
import type { ProjectMedia } from "@/config/projects";

type SpacingInput =
  | number
  | { mobile: number; desktop: number }
  | boolean
  | undefined;

interface GalleryGridProps {
  media: ProjectMedia[];
  /**
   * Padding applied to both sides of each full-width row. Accepts a single
   * desktop px value (mobile scales to ~40%) or `{ mobile, desktop }` for
   * explicit per-breakpoint control (e.g. YSL where desktop is flush but mobile
   * needs 60px because mobile EXPORT images have no baked whitespace).
   */
  fullRowSpacing?: number | { mobile: number; desktop: number };
}

const MOBILE_RATIO = 0.4;

/** Normalize any spacing input to explicit { mobile, desktop } px values. */
function resolveSpacing(
  input: SpacingInput,
): { mobile: number; desktop: number } | null {
  if (input === undefined || input === false) return null;
  if (input === true) return { mobile: 60, desktop: 150 };
  if (typeof input === "number") {
    if (input <= 0) return null;
    return { mobile: Math.round(input * MOBILE_RATIO), desktop: input };
  }
  if (input.mobile <= 0 && input.desktop <= 0) return null;
  return input;
}

/** Build responsive CSS var-driven padding classes + inline style. */
function rowSpacing(
  input: SpacingInput,
  kind: "py" | "pb" | "pt",
): { className: string; style: React.CSSProperties } | null {
  const resolved = resolveSpacing(input);
  if (!resolved) return null;
  // These Tailwind classes are static strings, so JIT picks them up at build.
  const classMap = {
    py: "py-[var(--row-pad-mb,0px)] md:py-[var(--row-pad-md,0px)]",
    pb: "pb-[var(--row-pad-mb,0px)] md:pb-[var(--row-pad-md,0px)]",
    pt: "pt-[var(--row-pad-mb,0px)] md:pt-[var(--row-pad-md,0px)]",
  };
  return {
    className: classMap[kind],
    style: {
      ["--row-pad-mb" as string]: `${resolved.mobile}px`,
      ["--row-pad-md" as string]: `${resolved.desktop}px`,
    },
  };
}

/**
 * GalleryGrid — Flexible gallery layout renderer matching Figma project pages.
 *
 * Supports four frame types:
 * - `mask`       Edge-to-edge image (default)
 * - `inset`      Image padded inside a coloured background
 * - `phone`      CSS phone device mockup on blue background
 * - `colorFrame` Solid colour background behind the image
 *
 * Items with `span: 'full'` render full-width.
 * Items with `span: 'half'` (default) are paired into 2-column rows on desktop.
 * All items stack vertically on mobile.
 */
export function GalleryGrid({ media, fullRowSpacing = 150 }: GalleryGridProps) {
  const rows = groupIntoRows(media);

  return (
    <div>
      {rows.map((row, rowIndex) => {
        const isFullRow = row.length === 1 && (row[0].span === "full" || !hasHalfPair(row));

        // Resolve per-row spacing:
        // 1. Manual `spaceBefore` on the first item takes priority (top-only).
        // 2. Otherwise, full-width rows get `fullRowSpacing` on both sides —
        //    except the very first row, which gets bottom-only so the page
        //    wrapper's top spacing (mt-[143px]) isn't doubled.
        // 3. Pair rows get no auto spacing (they butt against neighbours).
        // Spacing of 0 (flush) on either breakpoint skips that axis accordingly.
        const spacing =
          row[0].spaceBefore !== undefined && row[0].spaceBefore !== false
            ? rowSpacing(row[0].spaceBefore, "pt")
            : isFullRow
              ? rowSpacing(fullRowSpacing, rowIndex === 0 ? "pb" : "py")
              : null;

        const space = spacing?.className ?? "";
        const inlineStyle = spacing?.style;

        if (isFullRow) {
          // Full-width row — natural aspect ratio
          return (
            <div key={rowIndex} className={`w-full ${space}`} style={inlineStyle}>
              <GalleryItem
                item={row[0]}
                index={getGlobalIndex(rows, rowIndex, 0)}
                sizes="100vw"
              />
            </div>
          );
        }

        // Half-width pair row — side by side on desktop, stacked on mobile.
        // Images render at natural aspect; matched-aspect pairs line up by design.
        return (
          <div
            key={rowIndex}
            className={`flex flex-col md:flex-row w-full ${space}`}
            style={inlineStyle}
          >
            {row.map((item, colIndex) => (
              <div key={colIndex} className="w-full md:w-1/2">
                <GalleryItem
                  item={item}
                  index={getGlobalIndex(rows, rowIndex, colIndex)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  paired
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Gallery Item — renders a single media item with its frame style
// =============================================================================

interface GalleryItemProps {
  item: ProjectMedia;
  index: number;
  sizes: string;
  paired?: boolean;
}

function GalleryItem({ item, index, sizes, paired }: GalleryItemProps) {
  const frame = item.frame ?? "mask";

  switch (frame) {
    case "inset":
      return <InsetFrame item={item} index={index} sizes={sizes} />;
    case "phone":
      return <PhoneFrame item={item} index={index} sizes={sizes} />;
    case "colorFrame":
      return <ColorFrame item={item} index={index} sizes={sizes} />;
    case "mask":
    default:
      return <MaskFrame item={item} index={index} sizes={sizes} paired={paired} />;
  }
}

// =============================================================================
// Frame: Mask — edge-to-edge image, no background
// =============================================================================

function MaskFrame({ item, index, sizes, paired }: GalleryItemProps) {
  // All items render at natural aspect. Paired items share a source aspect per design,
  // so side-by-side images line up without needing a forced container aspect.
  const imgClass = "w-full h-auto block";

  if (item.type === "video") {
    return (
      <video
        className={imgClass}
        playsInline
        autoPlay
        loop
        muted
        poster={item.poster}
        preload={index < 2 ? "metadata" : "none"}
      >
        {item.mobile && (
          <source
            src={item.mobile}
            type="video/mp4"
            media="(max-width: 768px)"
          />
        )}
        <source src={item.desktop} type="video/mp4" />
      </video>
    );
  }

  if (item.mobile) {
    return (
      <picture>
        <source media="(max-width: 768px)" srcSet={item.mobile} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.desktop}
          alt={item.alt}
          className={imgClass}
          loading={index < 2 ? "eager" : "lazy"}
        />
      </picture>
    );
  }

  return (
    <Image
      src={item.desktop}
      alt={item.alt}
      width={paired ? 720 : 1440}
      height={paired ? 1200 : 700}
      className={imgClass}
      sizes={sizes}
      loading={index < 2 ? "eager" : "lazy"}
    />
  );
}

// =============================================================================
// Frame: Inset — image padded inside a coloured background container
// =============================================================================

function InsetFrame({ item, index, sizes }: GalleryItemProps) {
  const bgColor = item.bgColor ?? "#FFFFFF";

  return (
    <div
      className="w-full aspect-[3/4] flex items-center justify-center p-[24px] md:p-[55px]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative w-full h-full">
        {item.mobile ? (
          <picture>
            <source media="(max-width: 768px)" srcSet={item.mobile} />
            <img
              src={item.desktop}
              alt={item.alt}
              className="w-full h-full object-contain"
              loading={index < 2 ? "eager" : "lazy"}
            />
          </picture>
        ) : (
          <Image
            src={item.desktop}
            alt={item.alt}
            fill
            className="object-contain"
            sizes={sizes}
            loading={index < 2 ? "eager" : "lazy"}
          />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Frame: Phone — CSS phone device mockup on blue background
// =============================================================================

/**
 * Phone mockup dimensions from Figma:
 * - Blue background rectangle: 610 x 790
 * - Phone SVG overlay: 720.33 x 900
 * - Phone screen is inset within the SVG frame
 *
 * We replicate this with CSS: a rounded-corner container with a dark border
 * simulating the device bezel, on a blue (#1500FF) background.
 */
function PhoneFrame({ item, index, sizes }: GalleryItemProps) {
  const bgColor = item.bgColor ?? "#1500FF";

  return (
    <div
      className="w-full aspect-[3/4] flex items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative w-[58%] h-[78%] rounded-[32px] md:rounded-[40px] overflow-hidden border-[6px] md:border-[8px] border-black/90 shadow-lg">
        {item.mobile ? (
          <picture>
            <source media="(max-width: 768px)" srcSet={item.mobile} />
            <img
              src={item.desktop}
              alt={item.alt}
              className="w-full h-full object-cover"
              loading={index < 2 ? "eager" : "lazy"}
            />
          </picture>
        ) : (
          <Image
            src={item.desktop}
            alt={item.alt}
            fill
            className="object-cover"
            sizes={sizes}
            loading={index < 2 ? "eager" : "lazy"}
          />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Frame: ColorFrame — solid colour background behind the image
// =============================================================================

function ColorFrame({ item, index, sizes }: GalleryItemProps) {
  const bgColor = item.bgColor ?? "#FF0E9B";

  return (
    <div
      className="w-full aspect-[3/4] flex items-center justify-center p-[24px] md:p-[55px]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative w-full h-full">
        {item.mobile ? (
          <picture>
            <source media="(max-width: 768px)" srcSet={item.mobile} />
            <img
              src={item.desktop}
              alt={item.alt}
              className="w-full h-full object-contain"
              loading={index < 2 ? "eager" : "lazy"}
            />
          </picture>
        ) : (
          <Image
            src={item.desktop}
            alt={item.alt}
            fill
            className="object-contain"
            sizes={sizes}
            loading={index < 2 ? "eager" : "lazy"}
          />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Groups media items into rows based on span.
 * Consecutive 'half' items are paired into 2-item rows.
 * 'full' items get their own single-item row.
 */
function groupIntoRows(media: ProjectMedia[]): ProjectMedia[][] {
  const rows: ProjectMedia[][] = [];
  let i = 0;

  while (i < media.length) {
    const item = media[i];

    if (item.span === "full") {
      rows.push([item]);
      i++;
    } else {
      // Default to half — try to pair with next item
      const nextItem = media[i + 1];
      if (nextItem && nextItem.span !== "full") {
        rows.push([item, nextItem]);
        i += 2;
      } else {
        // Lone half item — render as full width
        rows.push([item]);
        i++;
      }
    }
  }

  return rows;
}

/** Check if a single-item row should be treated as full width. */
function hasHalfPair(row: ProjectMedia[]): boolean {
  return row.length === 2;
}

/** Calculate the global index of an item across all rows. */
function getGlobalIndex(
  rows: ProjectMedia[][],
  rowIndex: number,
  colIndex: number,
): number {
  let count = 0;
  for (let r = 0; r < rowIndex; r++) {
    count += rows[r].length;
  }
  return count + colIndex;
}
