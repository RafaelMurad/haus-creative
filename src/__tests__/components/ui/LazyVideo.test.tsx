import { render, screen } from "@testing-library/react";
import { LazyVideo } from "@/components/ui/LazyVideo";

// Mock useIntersectionObserver
const mockUseIntersectionObserver = jest.fn();
jest.mock("@/hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: (...args: unknown[]) =>
    mockUseIntersectionObserver(...args),
}));

// Mock HTMLMediaElement methods not implemented in jsdom
const mockPlay = jest.fn().mockResolvedValue(undefined);
const mockPause = jest.fn();
const mockLoad = jest.fn();

beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: mockPlay,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value: mockPause,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "load", {
    configurable: true,
    value: mockLoad,
  });
});

describe("LazyVideo", () => {
  const defaultObserverReturn = {
    elementRef: { current: null },
    isVisible: false,
    isCurrentlyVisible: false,
  };

  beforeEach(() => {
    mockUseIntersectionObserver.mockReturnValue(defaultObserverReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a video element with correct attributes", () => {
    const { container } = render(
      <LazyVideo src="/test-video.mp4" poster="/poster.webp" />,
    );
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("poster", "/poster.webp");
    expect(video).toHaveAttribute("preload", "none");
  });

  it("does not set source src when not visible", () => {
    const { container } = render(<LazyVideo src="/test-video.mp4" />);
    const sources = container.querySelectorAll("source");
    // Desktop source exists but has no src
    expect(sources).toHaveLength(1);
    expect(sources[0]).not.toHaveAttribute("src");
  });

  it("sets source src when visible", () => {
    mockUseIntersectionObserver.mockReturnValue({
      ...defaultObserverReturn,
      isVisible: true,
      isCurrentlyVisible: true,
    });

    const { container } = render(<LazyVideo src="/test-video.mp4" />);
    const sources = container.querySelectorAll("source");
    expect(sources[0]).toHaveAttribute("src", "/test-video.mp4");
  });

  it("renders mobile source when srcMobile is provided", () => {
    mockUseIntersectionObserver.mockReturnValue({
      ...defaultObserverReturn,
      isVisible: true,
    });

    const { container } = render(
      <LazyVideo src="/desktop.mp4" srcMobile="/mobile.mp4" />,
    );
    const sources = container.querySelectorAll("source");
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("src", "/mobile.mp4");
    expect(sources[0]).toHaveAttribute("media", "(max-width: 768px)");
    expect(sources[1]).toHaveAttribute("src", "/desktop.mp4");
  });

  it("applies custom className to video element", () => {
    const { container } = render(
      <LazyVideo src="/test.mp4" className="custom-class" />,
    );
    const video = container.querySelector("video");
    expect(video?.className).toContain("custom-class");
  });

  it("passes rootMargin to useIntersectionObserver", () => {
    render(<LazyVideo src="/test.mp4" rootMargin="500px" />);
    expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
      expect.objectContaining({ rootMargin: "500px" }),
    );
  });

  it("uses triggerOnce: false for play/pause visibility tracking", () => {
    render(<LazyVideo src="/test.mp4" />);
    expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
      expect.objectContaining({ triggerOnce: false }),
    );
  });
});
