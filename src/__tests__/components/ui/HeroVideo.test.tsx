import { render, act } from "@testing-library/react";
import { HeroVideo } from "@/components/ui/HeroVideo";

/**
 * Replaces the jest.setup.js matchMedia stub with a controllable mock so
 * tests can flip the breakpoint and assert the source swap.
 */
function mockMatchMedia(initialMatches: boolean) {
  let listener: ((event: { matches: boolean }) => void) | null = null;
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: initialMatches,
    media: query,
    addEventListener: (_: string, cb: (event: { matches: boolean }) => void) => {
      listener = cb;
    },
    removeEventListener: jest.fn(),
  }));
  return {
    fire(matches: boolean) {
      act(() => listener?.({ matches }));
    },
  };
}

describe("HeroVideo", () => {
  it("resolves the desktop source on desktop viewports", () => {
    mockMatchMedia(false);
    const { container } = render(
      <HeroVideo desktop="/d.mp4" mobile="/m.mp4" />,
    );

    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/d.mp4",
    );
  });

  it("resolves the mobile source on mobile viewports", () => {
    mockMatchMedia(true);
    const { container } = render(
      <HeroVideo desktop="/d.mp4" mobile="/m.mp4" />,
    );

    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/m.mp4",
    );
  });

  it("falls back to the desktop source on mobile when no mobile file exists", () => {
    mockMatchMedia(true);
    const { container } = render(<HeroVideo desktop="/d.mp4" />);

    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/d.mp4",
    );
  });

  it("renders nothing on desktop for a mobile-only hero video", () => {
    mockMatchMedia(false);
    const { container } = render(<HeroVideo mobile="/m.mp4" />);

    expect(container.querySelector("video")).not.toBeInTheDocument();
  });

  it("plays the mobile file on mobile for a mobile-only hero video", () => {
    mockMatchMedia(true);
    const { container } = render(<HeroVideo mobile="/m.mp4" />);

    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/m.mp4",
    );
  });

  it("appears and disappears as the breakpoint flips on a mobile-only hero video", () => {
    const media = mockMatchMedia(true);
    const { container } = render(<HeroVideo mobile="/m.mp4" />);
    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/m.mp4",
    );

    media.fire(false);
    expect(container.querySelector("video")).not.toBeInTheDocument();

    media.fire(true);
    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/m.mp4",
    );
  });

  it("scroll-gates playback: no autoplay, plays on enter, pauses on exit", () => {
    // Element-matched capture — find the observer watching the video node
    // (the audio hook registers observers of its own).
    const observed: Array<[Element, IntersectionObserverCallback]> = [];
    class MockIO {
      private cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
      }
      observe = (el: Element) => {
        observed.push([el, this.cb]);
      };
      unobserve = jest.fn();
      disconnect = jest.fn();
    }
    const prevIO = globalThis.IntersectionObserver;
    (globalThis as Record<string, unknown>).IntersectionObserver = MockIO;
    try {
      mockMatchMedia(false);
      const { container } = render(<HeroVideo desktop="/d.mp4" />);
      const video = container.querySelector("video")!;
      expect(video).not.toHaveAttribute("autoplay");

      const pair = observed.find(([el]) => el === video);
      expect(pair).toBeDefined();

      video.play = jest.fn().mockResolvedValue(undefined);
      video.pause = jest.fn();
      act(() => {
        pair![1](
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });
      expect(video.play).toHaveBeenCalled();

      act(() => {
        pair![1](
          [{ isIntersecting: false } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });
      expect(video.pause).toHaveBeenCalled();
    } finally {
      (globalThis as Record<string, unknown>).IntersectionObserver = prevIO;
    }
  });

  it("swaps the source when the viewport crosses the breakpoint", () => {
    const media = mockMatchMedia(false);
    const { container } = render(
      <HeroVideo desktop="/d.mp4" mobile="/m.mp4" />,
    );
    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/d.mp4",
    );

    media.fire(true);
    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/m.mp4",
    );

    media.fire(false);
    expect(container.querySelector("video")!.getAttribute("src")).toBe(
      "/d.mp4",
    );
  });
});
