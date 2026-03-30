import { render, screen, act, fireEvent } from "@testing-library/react";
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

  // =========================================================================
  // Touch/swipe support
  // =========================================================================

  it("advances to next slide on swipe left", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" autoAdvanceTime={5000} />
    );
    const carousel = screen.getByRole("region");

    // Swipe left (negative deltaX)
    fireEvent.touchStart(carousel, {
      touches: [{ clientX: 200, clientY: 300 }],
    });
    fireEvent.touchEnd(carousel, {
      changedTouches: [{ clientX: 100, clientY: 300 }],
    });

    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[1]).toHaveAttribute("data-active", "true");
  });

  it("goes to previous slide on swipe right", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" autoAdvanceTime={5000} />
    );
    const carousel = screen.getByRole("region");

    // First advance to slide 1
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Swipe right (positive deltaX)
    fireEvent.touchStart(carousel, {
      touches: [{ clientX: 100, clientY: 300 }],
    });
    fireEvent.touchEnd(carousel, {
      changedTouches: [{ clientX: 250, clientY: 300 }],
    });

    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[0]).toHaveAttribute("data-active", "true");
  });

  it("ignores swipe below threshold distance", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" />
    );
    const carousel = screen.getByRole("region");

    // Tiny swipe (only 20px, threshold is 50px)
    fireEvent.touchStart(carousel, {
      touches: [{ clientX: 200, clientY: 300 }],
    });
    fireEvent.touchEnd(carousel, {
      changedTouches: [{ clientX: 180, clientY: 300 }],
    });

    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[0]).toHaveAttribute("data-active", "true");
  });

  it("ignores vertical swipes (scroll gestures)", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" />
    );
    const carousel = screen.getByRole("region");

    // Mostly vertical swipe (deltaY > SWIPE_VERTICAL_LIMIT)
    fireEvent.touchStart(carousel, {
      touches: [{ clientX: 200, clientY: 100 }],
    });
    fireEvent.touchEnd(carousel, {
      changedTouches: [{ clientX: 100, clientY: 300 }],
    });

    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[0]).toHaveAttribute("data-active", "true");
  });

  it("wraps to last slide when swiping right on first slide", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" />
    );
    const carousel = screen.getByRole("region");

    // Swipe right on first slide
    fireEvent.touchStart(carousel, {
      touches: [{ clientX: 100, clientY: 300 }],
    });
    fireEvent.touchEnd(carousel, {
      changedTouches: [{ clientX: 250, clientY: 300 }],
    });

    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[2]).toHaveAttribute("data-active", "true");
  });

  // =========================================================================
  // Animation type branches
  // =========================================================================

  it("applies slide animation styles (translateX)", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="slide" autoAdvanceTime={5000} />
    );

    // Active slide should have translateX(0%)
    const slides = container.querySelectorAll("[data-slide-index]");
    const activeStyle = (slides[0] as HTMLElement).style;
    expect(activeStyle.transform).toBe("translateX(0%)");
    expect(activeStyle.opacity).toBe("1");

    // Inactive slide should be offset
    const inactiveStyle = (slides[1] as HTMLElement).style;
    expect(inactiveStyle.transform).toBe("translateX(100%)");
  });

  it("applies slideUp animation styles (translateY)", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="slideUp" />
    );

    const slides = container.querySelectorAll("[data-slide-index]");
    const activeStyle = (slides[0] as HTMLElement).style;
    expect(activeStyle.transform).toBe("translateY(0%)");
    expect(activeStyle.opacity).toBe("1");

    const inactiveStyle = (slides[1] as HTMLElement).style;
    expect(inactiveStyle.transform).toBe("translateY(20%)");
    expect(inactiveStyle.opacity).toBe("0");
  });

  it("applies scale animation styles", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="scale" />
    );

    const slides = container.querySelectorAll("[data-slide-index]");
    const activeStyle = (slides[0] as HTMLElement).style;
    expect(activeStyle.transform).toBe("scale(1)");
    expect(activeStyle.opacity).toBe("1");

    const inactiveStyle = (slides[1] as HTMLElement).style;
    expect(inactiveStyle.transform).toBe("scale(0.9)");
    expect(inactiveStyle.opacity).toBe("0");
  });

  it("applies blur animation styles", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="blur" />
    );

    const slides = container.querySelectorAll("[data-slide-index]");
    const activeStyle = (slides[0] as HTMLElement).style;
    expect(activeStyle.filter).toBe("blur(0px)");
    expect(activeStyle.transform).toBe("scale(1)");

    const inactiveStyle = (slides[1] as HTMLElement).style;
    expect(inactiveStyle.filter).toBe("blur(8px)");
    expect(inactiveStyle.transform).toBe("scale(1.05)");
  });

  // =========================================================================
  // Page Visibility API
  // =========================================================================

  it("pauses auto-advance when tab becomes hidden", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" autoAdvanceTime={1000} />
    );

    // Simulate tab going hidden
    Object.defineProperty(document, "hidden", { value: true, writable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    // Advance past where slide should change
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Should still be on the first slide (timer was cleared)
    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides[0]).toHaveAttribute("data-active", "true");

    // Simulate tab becoming visible again
    Object.defineProperty(document, "hidden", { value: false, writable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    // Now advancing should work
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const slidesAfter = container.querySelectorAll("[data-slide-index]");
    expect(slidesAfter[1]).toHaveAttribute("data-active", "true");
  });

  // =========================================================================
  // Video with mobile source branch
  // =========================================================================

  it("renders mobile source when video has mobile property", () => {
    const videoWithMobile: ProjectMedia[] = [
      {
        type: "video",
        desktop: "/assets/gallery/video.mp4",
        mobile: "/assets/gallery/video-mobile.mp4",
        alt: "Video with mobile",
      },
    ];

    const { container } = render(
      <SimpleCarousel items={videoWithMobile} animation="none" />
    );

    const sources = container.querySelectorAll("video source");
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("src", "/assets/gallery/video-mobile.mp4");
    expect(sources[1]).toHaveAttribute("src", "/assets/gallery/video.mp4");
  });

  // =========================================================================
  // Priority prop
  // =========================================================================

  it("renders with priority prop without crashing", () => {
    const { container } = render(
      <SimpleCarousel items={mockImages} animation="fade" priority />
    );

    // Should render all slides correctly with the priority prop
    const slides = container.querySelectorAll("[data-slide-index]");
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute("data-active", "true");
  });
});
