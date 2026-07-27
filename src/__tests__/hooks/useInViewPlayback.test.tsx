import React, { useRef } from "react";
import { render, act } from "@testing-library/react";
import { useInViewPlayback } from "@/hooks/useInViewPlayback";

// Capture the observer callback so tests can trigger intersections manually
let observerCallback: IntersectionObserverCallback;
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  observerCallback = undefined as unknown as IntersectionObserverCallback;

  global.IntersectionObserver = jest.fn((callback) => {
    observerCallback = callback;
    return {
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
      root: null,
      rootMargin: "",
      thresholds: [],
      takeRecords: jest.fn(),
    };
  }) as unknown as typeof IntersectionObserver;
});

// Helper component that attaches the hook to a real <video> element
function Clip({ resyncKey }: { resyncKey?: unknown }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useInViewPlayback(videoRef, resyncKey);
  return <video ref={videoRef} data-testid="clip" muted />;
}

function triggerIntersection(isIntersecting: boolean) {
  act(() => {
    observerCallback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

describe("useInViewPlayback", () => {
  it("observes the video element and does not play it on mount", () => {
    const { getByTestId } = render(<Clip />);
    const video = getByTestId("clip") as HTMLVideoElement;

    expect(mockObserve).toHaveBeenCalledWith(video);
    expect(video).not.toHaveAttribute("autoplay");
  });

  it("plays when the clip enters the viewport", () => {
    const { getByTestId } = render(<Clip />);
    const video = getByTestId("clip") as HTMLVideoElement;
    video.play = jest.fn().mockResolvedValue(undefined);
    video.pause = jest.fn();

    triggerIntersection(true);

    expect(video.play).toHaveBeenCalled();
    expect(video.pause).not.toHaveBeenCalled();
  });

  it("pauses when the clip fully leaves the viewport", () => {
    const { getByTestId } = render(<Clip />);
    const video = getByTestId("clip") as HTMLVideoElement;
    video.play = jest.fn().mockResolvedValue(undefined);
    video.pause = jest.fn();

    triggerIntersection(true);
    triggerIntersection(false);

    expect(video.pause).toHaveBeenCalled();
  });

  it("re-attaches the observer when resyncKey changes (breakpoint remount)", () => {
    const { rerender } = render(<Clip resyncKey="/a.mp4" />);
    expect(mockObserve).toHaveBeenCalledTimes(1);

    rerender(<Clip resyncKey="/b.mp4" />);

    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledTimes(2);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<Clip />);
    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("falls back to playing immediately when IntersectionObserver is unavailable", () => {
    const prevIO = globalThis.IntersectionObserver;
    delete (globalThis as Record<string, unknown>).IntersectionObserver;
    const playSpy = jest
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    try {
      render(<Clip />);
      expect(playSpy).toHaveBeenCalled();
    } finally {
      playSpy.mockRestore();
      (globalThis as Record<string, unknown>).IntersectionObserver = prevIO;
    }
  });
});
