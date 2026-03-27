import { render, screen } from "@testing-library/react";
import { WorkGalleryItem } from "@/components/home/WorkGalleryItem";
import type { Project } from "@/config/site";
import type { ProjectMedia } from "@/config/projects";
import type { CarouselConfig } from "@/types/carousel";

// Mock hooks and components to isolate WorkGalleryItem
jest.mock("@/hooks/useSlideInOnView", () => ({
  useSlideInOnView: () => ({
    ref: { current: null },
    isVisible: false,
  }),
}));

jest.mock("@/components/ui", () => ({
  MediaRenderer: ({
    media,
    className,
  }: {
    media: { src: string };
    className?: string;
  }) => (
    <div
      data-testid="media-renderer"
      data-src={media.src}
      className={className}
    />
  ),
  SimpleCarousel: ({
    items,
    animation,
    autoAdvanceTime,
    className,
  }: {
    items: ProjectMedia[];
    animation: string;
    autoAdvanceTime?: number;
    className?: string;
  }) => (
    <div
      data-testid="simple-carousel"
      data-item-count={items.length}
      data-animation={animation}
      data-auto-advance={autoAdvanceTime}
      className={className}
    />
  ),
}));

describe("WorkGalleryItem", () => {
  const mockProject: Project = {
    id: "test-project",
    title: "Test Project",
    subtitle: "A test project",
    href: "/work/test-project",
    media: {
      type: "image",
      src: "/assets/projects/test.jpg",
      alt: "Test project image",
    },
  };

  const mockGalleryMedia: ProjectMedia[] = [
    { type: "image", desktop: "/img1.webp", alt: "Image 1" },
    { type: "image", desktop: "/img2.webp", alt: "Image 2" },
    { type: "image", desktop: "/img3.webp", alt: "Image 3" },
  ];

  const mockCarouselConfig: CarouselConfig = {
    animation: "fade",
    autoAdvanceTime: 2000,
  };

  // =========================================================================
  // Fallback mode — no carousel props (backwards compatible)
  // =========================================================================

  it("renders a link to the project page", () => {
    render(<WorkGalleryItem project={mockProject} />);
    const link = screen.getByRole("link", {
      name: /view test project project/i,
    });
    expect(link).toHaveAttribute("href", "/work/test-project");
  });

  it("renders the project title", () => {
    render(<WorkGalleryItem project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders MediaRenderer when no carousel props are provided", () => {
    render(<WorkGalleryItem project={mockProject} />);
    const renderer = screen.getByTestId("media-renderer");
    expect(renderer).toHaveAttribute("data-src", "/assets/projects/test.jpg");
  });

  it("renders within a full-viewport section using dynamic viewport height", () => {
    const { container } = render(<WorkGalleryItem project={mockProject} />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("h-dvh");
  });

  it("renders MediaRenderer when galleryMedia is provided without carouselConfig", () => {
    render(
      <WorkGalleryItem project={mockProject} galleryMedia={mockGalleryMedia} />,
    );
    expect(screen.getByTestId("media-renderer")).toBeInTheDocument();
    expect(screen.queryByTestId("simple-carousel")).not.toBeInTheDocument();
  });

  it("renders MediaRenderer when carouselConfig is provided without galleryMedia", () => {
    render(
      <WorkGalleryItem
        project={mockProject}
        carouselConfig={mockCarouselConfig}
      />,
    );
    expect(screen.getByTestId("media-renderer")).toBeInTheDocument();
    expect(screen.queryByTestId("simple-carousel")).not.toBeInTheDocument();
  });

  it("renders MediaRenderer when galleryMedia is empty", () => {
    render(
      <WorkGalleryItem
        project={mockProject}
        galleryMedia={[]}
        carouselConfig={mockCarouselConfig}
      />,
    );
    expect(screen.getByTestId("media-renderer")).toBeInTheDocument();
    expect(screen.queryByTestId("simple-carousel")).not.toBeInTheDocument();
  });

  // =========================================================================
  // Carousel mode — galleryMedia + carouselConfig provided
  // =========================================================================

  it("renders SimpleCarousel when both galleryMedia and carouselConfig are provided", () => {
    render(
      <WorkGalleryItem
        project={mockProject}
        galleryMedia={mockGalleryMedia}
        carouselConfig={mockCarouselConfig}
      />,
    );
    expect(screen.queryByTestId("media-renderer")).not.toBeInTheDocument();
    const carousel = screen.getByTestId("simple-carousel");
    expect(carousel).toBeInTheDocument();
  });

  it("passes correct props to SimpleCarousel", () => {
    render(
      <WorkGalleryItem
        project={mockProject}
        galleryMedia={mockGalleryMedia}
        carouselConfig={mockCarouselConfig}
      />,
    );
    const carousel = screen.getByTestId("simple-carousel");
    expect(carousel).toHaveAttribute("data-item-count", "3");
    expect(carousel).toHaveAttribute("data-animation", "fade");
    expect(carousel).toHaveAttribute("data-auto-advance", "2000");
  });

  it("still renders title and link in carousel mode", () => {
    render(
      <WorkGalleryItem
        project={mockProject}
        galleryMedia={mockGalleryMedia}
        carouselConfig={mockCarouselConfig}
      />,
    );
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    const link = screen.getByRole("link", {
      name: /view test project project/i,
    });
    expect(link).toHaveAttribute("href", "/work/test-project");
  });
});
