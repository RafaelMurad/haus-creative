import Image from "next/image";
import type { ProjectMedia } from "@/config/projects";
import { GalleryVideo } from "./GalleryVideo";

// Dev-only slot badge. Shows the slot identifier (e.g. "mc-arabia-3", "ysl-2")
// in a corner overlay so the user can reference individual slots while reviewing.
// Hidden in production builds via NODE_ENV check — DO NOT remove without explicit
// user request, this is the primary tool for slot-level review feedback.
function SlotBadge({ item, paired }: { item: ProjectMedia; paired?: boolean }) {
  if (process.env.NODE_ENV !== "development") return null;
  const src = item.desktop || item.mobile || "";
  const match = src.match(/\/([^/]+)\.(?:webp|mp4|jpg|png)$/i);
  const label = match ? match[1] : src;
  return (
    <div
      className="absolute top-2 left-2 z-50 px-2 py-1 rounded bg-black/80 text-white font-mono text-[11px] leading-none pointer-events-none select-none"
      data-slot-badge
    >
      {label}
      <span className="ml-1 opacity-60">{paired ? "·pair" : "·full"}</span>
    </div>
  );
}

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
  if (input === true) return { mobile: 15, desktop: 38 };
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
  // Static class strings (Tailwind JIT picks them up) — per-axis var names
  // so multiple kinds can co-exist on the same element without collision.
  const classMap = {
    py: "py-[var(--row-py-mb,0px)] md:py-[var(--row-py-md,0px)]",
    pb: "pb-[var(--row-pb-mb,0px)] md:pb-[var(--row-pb-md,0px)]",
    pt: "pt-[var(--row-pt-mb,0px)] md:pt-[var(--row-pt-md,0px)]",
  };
  const styleMap: Record<"py" | "pb" | "pt", React.CSSProperties> = {
    py: {
      ["--row-py-mb" as string]: `${resolved.mobile}px`,
      ["--row-py-md" as string]: `${resolved.desktop}px`,
    },
    pb: {
      ["--row-pb-mb" as string]: `${resolved.mobile}px`,
      ["--row-pb-md" as string]: `${resolved.desktop}px`,
    },
    pt: {
      ["--row-pt-mb" as string]: `${resolved.mobile}px`,
      ["--row-pt-md" as string]: `${resolved.desktop}px`,
    },
  };
  return {
    className: classMap[kind],
    style: styleMap[kind],
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
export function GalleryGrid({ media, fullRowSpacing = 0 }: GalleryGridProps) {
  const rows = groupIntoRows(media);

  return (
    <div>
      {rows.map((row, rowIndex) => {
        const isFullRow = row.length === 1 && (row[0].span === "full" || !hasHalfPair(row));
        const lastItem = row[row.length - 1];
        // The final row never emits trailing bottom space, so every project ends
        // flush at its last asset and the Credits section's own top margin is the
        // single, uniform gap below the gallery (Figma: credits spacing must be
        // identical across all projects). Without this, a last item's spaceAfter
        // (e.g. mc-arabia-11's 150) gets added on top of the Credits margin.
        const isLastRow = rowIndex === rows.length - 1;

        // Row-level top spacing: row[0].spaceBefore overrides `fullRowSpacing`.
        // On the last row, full-row fullRowSpacing applies as top-only (never "py")
        // so it doesn't add a trailing bottom gap.
        const topSpacing =
          row[0].spaceBefore !== undefined && row[0].spaceBefore !== false
            ? rowSpacing(row[0].spaceBefore, "pt")
            : isFullRow
              ? rowSpacing(fullRowSpacing, rowIndex === 0 ? "pb" : isLastRow ? "pt" : "py")
              : null;
        // Row-level bottom spacing: last item's spaceAfter — suppressed on the
        // final row so it can't bleed into the gap before Credits.
        const bottomSpacing =
          !isLastRow && lastItem.spaceAfter !== undefined && lastItem.spaceAfter !== false
            ? rowSpacing(lastItem.spaceAfter, "pb")
            : null;

        // Merge top + bottom inline style vars; both reference the same CSS var
        // names, so for pair rows we need to split into separate divs if both
        // are set with different values. For now, prefer combining when possible.
        const space = [topSpacing?.className, bottomSpacing?.className].filter(Boolean).join(" ");
        const inlineStyle: React.CSSProperties = {
          ...(topSpacing?.style ?? {}),
          ...(bottomSpacing?.style ?? {}),
        };

        if (isFullRow) {
          const fullHidden = row[0].mobileOnly
            ? "md:hidden"
            : row[0].desktopOnly
              ? "hidden md:block"
              : "";
          return (
            <div
              key={rowIndex}
              className={`relative w-full ${space} ${fullHidden}`.trim()}
              style={inlineStyle}
            >
              <SlotBadge item={row[0]} />
              <GalleryItem
                item={row[0]}
                index={getGlobalIndex(rows, rowIndex, 0)}
                sizes="100vw"
              />
            </div>
          );
        }

        // Half-width pair row — side by side on desktop, stacked on mobile.
        // Per-slot spacing (row[1].spaceBefore and row[0].spaceAfter) applies
        // as mobile-only padding on individual slot divs so desktop pair alignment
        // isn't broken.
        const allMobileOnly = row.every((item) => item.mobileOnly);
        const allDesktopOnly = row.every((item) => item.desktopOnly);
        const pairHidden = allMobileOnly
          ? "md:hidden"
          : allDesktopOnly
            ? "hidden md:flex"
            : "";
        return (
          <div
            key={rowIndex}
            className={`flex flex-col md:flex-row w-full ${space} ${pairHidden}`.trim()}
            style={inlineStyle}
          >
            {row.map((item, colIndex) => {
              // Per-slot mobile-only padding for intra-pair gaps.
              const beforePad =
                colIndex === 1 && item.spaceBefore !== undefined && item.spaceBefore !== false
                  ? rowSpacing(item.spaceBefore, "pt")
                  : null;
              const afterPad =
                colIndex === 0 && item.spaceAfter !== undefined && item.spaceAfter !== false
                  ? rowSpacing(item.spaceAfter, "pb")
                  : null;
              const itemClass = [beforePad?.className, afterPad?.className]
                .filter(Boolean)
                .join(" ");
              const itemStyle: React.CSSProperties = {
                ...(beforePad?.style ?? {}),
                ...(afterPad?.style ?? {}),
              };
              const desktopReset =
                (beforePad ? "md:!pt-0 " : "") + (afterPad ? "md:!pb-0" : "");
              const itemHidden =
                item.mobileOnly && !allMobileOnly
                  ? "md:hidden"
                  : item.desktopOnly && !allDesktopOnly
                    ? "hidden md:block"
                    : "";
              return (
                <div
                  key={colIndex}
                  className={`relative w-full md:w-1/2 ${itemClass} ${desktopReset} ${itemHidden}`.trim()}
                  style={itemStyle}
                >
                  <SlotBadge item={item} paired />
                  <GalleryItem
                    item={item}
                    index={getGlobalIndex(rows, rowIndex, colIndex)}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    paired
                  />
                </div>
              );
            })}
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
    return <GalleryVideo item={item} index={index} />;
  }

  if (item.mobile) {
    return (
      <picture>
        <source media="(max-width: 767.98px)" srcSet={item.mobile} />
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
            <source media="(max-width: 767.98px)" srcSet={item.mobile} />
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
            <source media="(max-width: 767.98px)" srcSet={item.mobile} />
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
            <source media="(max-width: 767.98px)" srcSet={item.mobile} />
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
