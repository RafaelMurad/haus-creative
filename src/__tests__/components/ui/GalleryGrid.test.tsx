import { render, screen } from "@testing-library/react";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import type { ProjectMedia } from "@/config/projects";

// Mock next/image
jest.mock("next/image", () => {
  return function MockImage({
    fill: _fill,
    priority: _priority,
    ...props
  }: Record<string, unknown>) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
});

// ---------------------------------------------------------------------------
// Test data helpers
// ---------------------------------------------------------------------------

function makeImage(
  overrides: Partial<ProjectMedia> = {},
  index = 1,
): ProjectMedia {
  return {
    type: "image",
    desktop: `/assets/gallery/img-${index}.webp`,
    alt: `Image ${index}`,
    ...overrides,
  };
}

function makeVideo(index = 1): ProjectMedia {
  return {
    type: "video",
    desktop: `/assets/gallery/vid-${index}.mp4`,
    alt: `Video ${index}`,
  };
}

describe("GalleryGrid", () => {
  // =========================================================================
  // Empty / single item
  // =========================================================================

  it("renders nothing when media array is empty", () => {
    const { container } = render(<GalleryGrid media={[]} />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
  });

  it("renders a single image as full-width row", () => {
    const media = [makeImage({}, 1)];
    render(<GalleryGrid media={media} />);
    const img = screen.getByAltText("Image 1");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/assets/gallery/img-1.webp");
  });

  // =========================================================================
  // Default frame (mask)
  // =========================================================================

  it("renders mask frame by default (edge-to-edge image)", () => {
    const media = [makeImage({}, 1)];
    render(<GalleryGrid media={media} />);
    const img = screen.getByAltText("Image 1");
    expect(img.className).toContain("w-full");
  });

  it("renders video items with video element", () => {
    const media = [makeVideo(1)];
    const { container } = render(<GalleryGrid media={media} />);
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    // GalleryVideo resolves a single src for the current breakpoint after
    // hydration (jest matchMedia mock reports desktop).
    expect(video).toHaveAttribute("src", "/assets/gallery/vid-1.mp4");
  });

  it("resolves the desktop file when a mobile source is provided (desktop viewport)", () => {
    const media: ProjectMedia[] = [
      {
        type: "video",
        desktop: "/vid.mp4",
        mobile: "/vid-mobile.mp4",
        alt: "Video with mobile",
      },
    ];
    const { container } = render(<GalleryGrid media={media} />);
    expect(container.querySelector("video")).toHaveAttribute(
      "src",
      "/vid.mp4",
    );
  });

  // =========================================================================
  // Row grouping — half pairs vs full
  // =========================================================================

  it("pairs consecutive half items into 2-column rows", () => {
    const media = [makeImage({}, 1), makeImage({}, 2)];
    const { container } = render(<GalleryGrid media={media} />);
    // Should have a flex row container with md:flex-row
    const flexRow = container.querySelector(".md\\:flex-row");
    expect(flexRow).toBeInTheDocument();
    // Both images inside the same row
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
  });

  it("renders full-span items in their own row", () => {
    const media = [
      makeImage({ span: "full" }, 1),
      makeImage({}, 2),
      makeImage({}, 3),
    ];
    const { container } = render(<GalleryGrid media={media} />);
    // First row should NOT have md:flex-row (single full-width item)
    const rows = container.querySelectorAll(":scope > div > div");
    expect(rows.length).toBeGreaterThanOrEqual(2);
    // All 3 images rendered
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  it("treats lone half item as full-width row", () => {
    const media = [
      makeImage({}, 1),
      makeImage({}, 2),
      makeImage({}, 3), // odd one out
    ];
    render(<GalleryGrid media={media} />);
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  // =========================================================================
  // Frame types
  // =========================================================================

  it("renders inset frame with background colour container", () => {
    const media = [
      makeImage({ frame: "inset", bgColor: "#FFFFFF" }, 1),
    ];
    const { container } = render(<GalleryGrid media={media} />);
    const bgDiv = container.querySelector("[style]");
    expect(bgDiv).toHaveStyle({ backgroundColor: "#FFFFFF" });
    const img = screen.getByAltText("Image 1");
    expect(img.className).toContain("object-contain");
  });

  it("renders phone frame with device mockup styling", () => {
    const media = [
      makeImage({ frame: "phone", bgColor: "#1500FF" }, 1),
    ];
    const { container } = render(<GalleryGrid media={media} />);
    const bgDiv = container.querySelector("[style]");
    expect(bgDiv).toHaveStyle({ backgroundColor: "#1500FF" });
    // Phone frame has rounded corners and border
    const phoneBezel = container.querySelector(".rounded-\\[32px\\]");
    expect(phoneBezel).toBeInTheDocument();
  });

  it("renders colorFrame with solid background", () => {
    const media = [
      makeImage({ frame: "colorFrame", bgColor: "#FF0DDF" }, 1),
    ];
    const { container } = render(<GalleryGrid media={media} />);
    const bgDiv = container.querySelector("[style]");
    expect(bgDiv).toHaveStyle({ backgroundColor: "#FF0DDF" });
  });

  it("uses default background colours when bgColor is not specified", () => {
    const insetMedia = [makeImage({ frame: "inset" }, 1)];
    const { container: c1 } = render(<GalleryGrid media={insetMedia} />);
    expect(c1.querySelector("[style]")).toHaveStyle({
      backgroundColor: "#FFFFFF",
    });

    const phoneMedia = [makeImage({ frame: "phone" }, 2)];
    const { container: c2 } = render(<GalleryGrid media={phoneMedia} />);
    expect(c2.querySelector("[style]")).toHaveStyle({
      backgroundColor: "#1500FF",
    });

    const colorMedia = [makeImage({ frame: "colorFrame" }, 3)];
    const { container: c3 } = render(<GalleryGrid media={colorMedia} />);
    expect(c3.querySelector("[style]")).toHaveStyle({
      backgroundColor: "#FF0E9B",
    });
  });

  // =========================================================================
  // Loading priority
  // =========================================================================

  it("loads first two images eagerly and the rest lazily", () => {
    const media = [makeImage({}, 1), makeImage({}, 2), makeImage({ span: "full" }, 3)];
    render(<GalleryGrid media={media} />);
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("loading", "eager");
    expect(images[1]).toHaveAttribute("loading", "eager");
    expect(images[2]).toHaveAttribute("loading", "lazy");
  });

  // =========================================================================
  // Mixed layout (realistic project gallery)
  // =========================================================================

  it("handles a realistic mixed layout with multiple frame types", () => {
    const media: ProjectMedia[] = [
      makeImage({ frame: "inset", bgColor: "#FFF" }, 1),
      makeImage({ frame: "inset", bgColor: "#FFF" }, 2),
      makeImage({ span: "full" }, 3),
      makeImage({ frame: "phone", bgColor: "#1500FF" }, 4),
      makeImage({ frame: "colorFrame", bgColor: "#FF0E9B" }, 5),
      makeImage({}, 6),
    ];
    render(<GalleryGrid media={media} />);
    expect(screen.getAllByRole("img")).toHaveLength(6);
  });
});
