import { render, screen, act } from "@testing-library/react";
import { SimpleCarousel } from "@/components/ui/SimpleCarousel";
import type { ProjectMedia } from "@/config/projects";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    loading: _loading,
    sizes: _sizes,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="next-image" {...props} />;
  },
}));

const mockImages: ProjectMedia[] = [
  {
    type: "image",
    desktop: "/assets/gallery1/Gallery1-1.webp",
    alt: "Slide 1",
  },
  {
    type: "image",
    desktop: "/assets/gallery1/Gallery1-2.webp",
    alt: "Slide 2",
  },
  {
    type: "image",
    desktop: "/assets/gallery1/Gallery1-3.webp",
    alt: "Slide 3",
  },
];

const mockVideo: ProjectMedia[] = [
  {
    type: "video",
    desktop: "/assets/gallery3/Gallery3-Video.mp4",
    alt: "Video slide",
  },
];

describe("SimpleCarousel", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders without crashing with image items", () => {
    render(<SimpleCarousel items={mockImages} animation="fade" />);
    const images = screen.getAllByTestId("next-image");
    expect(images).toHaveLength(3);
  });

  it("renders video items with autoplay attributes", () => {
    const { container } = render(
      <SimpleCarousel items={mockVideo} animation="none" />
    );
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("autoplay");
  });

  it("applies carousel accessibility attributes", () => {
    render(<SimpleCarousel items={mockImages} animation="fade" />);
    const carousel = screen.getByRole("region");
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("shows first slide as active initially", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" />
    );
    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[0]).toHaveAttribute("data-active", "true");
    expect(slides[1]).toHaveAttribute("data-active", "false");
  });

  it("auto-advances to next slide after specified interval", () => {
    const { container } = render(
      <SimpleCarousel
        items={mockImages}
        animation="fade"
        autoAdvanceTime={2000}
      />
    );

    // Initially first slide is active
    let slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[0]).toHaveAttribute("data-active", "true");

    // Advance timer
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[1]).toHaveAttribute("data-active", "true");
    expect(slides[0]).toHaveAttribute("data-active", "false");
  });

  it("loops back to first slide after last", () => {
    const { container } = render(
      <SimpleCarousel
        items={mockImages}
        animation="none"
        autoAdvanceTime={1000}
      />
    );

    // Advance past all slides
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[0]).toHaveAttribute("data-active", "true");
  });

  it("does not auto-advance when autoAdvanceTime is undefined", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" />
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // First slide should still be active
    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[0]).toHaveAttribute("data-active", "true");
  });

  it("renders a single item without auto-advance", () => {
    render(
      <SimpleCarousel
        items={[mockImages[0]]}
        animation="fade"
        autoAdvanceTime={2000}
      />
    );
    const images = screen.getAllByTestId("next-image");
    expect(images).toHaveLength(1);
  });

  it("renders nothing when items array is empty", () => {
    const { container } = render(
      <SimpleCarousel items={[]} animation="fade" />
    );
    expect(container.querySelector("[data-slide-index]")).toBeNull();
  });

  it("accepts an optional className", () => {
    render(
      <SimpleCarousel
        items={mockImages}
        animation="fade"
        className="custom-class"
      />
    );
    const carousel = screen.getByRole("region");
    expect(carousel.className).toContain("custom-class");
  });
});
