import Image from "next/image";
import type { ProjectMedia } from "@/config/projects";

interface GalleryGridProps {
  media: ProjectMedia[];
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
export function GalleryGrid({ media }: GalleryGridProps) {
  const rows = groupIntoRows(media);

  return (
    <div>
      {rows.map((row, rowIndex) => {
        const isFullRow = row.length === 1 && (row[0].span === "full" || !hasHalfPair(row));
        // Full-width rows get automatic spacing (~150px in Figma).
        // Manual spaceBefore on individual items also adds spacing.
        // Full-width rows get ~150px gap (75px top + 75px bottom) matching Figma
        const autoSpace = isFullRow && rowIndex > 0 ? "py-[60px] md:py-[150px]" : "";
        const manualSpace = row[0].spaceBefore ? "py-[60px] md:py-[150px]" : "";
        const space = manualSpace || autoSpace;

        if (isFullRow) {
          // Full-width row — natural aspect ratio
          return (
            <div key={rowIndex} className={`w-full ${space}`}>
              <GalleryItem
                item={row[0]}
                index={getGlobalIndex(rows, rowIndex, 0)}
                sizes="100vw"
              />
            </div>
          );
        }

        // Half-width pair row — matched heights, side by side on desktop, stacked on mobile
        return (
          <div key={rowIndex} className={`flex flex-col md:flex-row w-full ${space}`}>
            {row.map((item, colIndex) => (
              <div key={colIndex} className="w-full md:w-1/2 aspect-[4/5] overflow-hidden">
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
  // Paired items (half-width rows) fill their container to match heights.
  // Single items (full-width) render at natural aspect ratio.
  const imgClass = paired
    ? "w-full h-full object-cover block"
    : "w-full h-auto block";

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

  if (paired) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={item.desktop}
          alt={item.alt}
          fill
          className="object-cover"
          sizes={sizes}
          loading={index < 2 ? "eager" : "lazy"}
        />
      </div>
    );
  }

  return (
    <Image
      src={item.desktop}
      alt={item.alt}
      width={1440}
      height={900}
      className="w-full h-auto block"
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
