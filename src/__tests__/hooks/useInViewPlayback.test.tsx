import React, { useRef } from "react";
import { render, act } from "@testing-library/react";
import { useInViewPlayback } from "@/hooks/useInViewPlayback";

// The hook creates TWO observers per element: the playback gate (no
// rootMargin) and the look-ahead prefetch (rootMargin one viewport out).
// Track every instance with its options so tests can address each.
interface MockObserver {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observe: jest.Mock;
  disconnect: jest.Mock;
}
let observers: MockObserver[] = [];

beforeEach(() => {
  jest.clearAllMocks();
  observers = [];

  global.IntersectionObserver = jest.fn(
    (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
      const instance: MockObserver = {
        callback,
        options,
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
      observers.push(instance);
      return {
        observe: instance.observe,
        unobserve: jest.fn(),
        disconnect: instance.disconnect,
        root: null,
        rootMargin: options?.rootMargin ?? "",
        thresholds: [],
        takeRecords: jest.fn(),
      };
    },
  ) as unknown as typeof IntersectionObserver;
});

const playbackObservers = () => observers.filter((o) => !o.options?.rootMargin);
const prefetchObservers = () => observers.filter((o) => o.options?.rootMargin);

// Helper component that attaches the hook to a real <video> element
function Clip({ resyncKey }: { resyncKey?: unknown }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useInViewPlayback(videoRef, resyncKey);
  return <video ref={videoRef} data-testid="clip" muted preload="none" />;
}

function trigger(observer: MockObserver, isIntersecting: boolean) {
  act(() => {
    observer.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

describe("useInViewPlayback", () => {
  it("observes the video element and does not play it on mount", () => {
    const { getByTestId } = render(<Clip />);
    const video = getByTestId("clip") as HTMLVideoElement;

    expect(playbackObservers()).toHaveLength(1);
    expect(playbackObservers()[0].observe).toHaveBeenCalledWith(video);
    expect(video).not.toHaveAttribute("autoplay");
  });

  it("plays when the clip enters the viewport", () => {
    const { getByTestId } = render(<Clip />);
    const video = getByTestId("clip") as HTMLVideoElement;
    video.play = jest.fn().mockResolvedValue(undefined);
    video.pause = jest.fn();

    trigger(playbackObservers()[0], true);

    expect(video.play).toHaveBeenCalled();
    expect(video.pause).not.toHaveBeenCalled();
  });

  it("pauses when the clip fully leaves the viewport", () => {
    const { getByTestId } = render(<Clip />);
    const video = getByTestId("clip") as HTMLVideoElement;
    video.play = jest.fn().mockResolvedValue(undefined);
    video.pause = jest.fn();

    trigger(playbackObservers()[0], true);
    trigger(playbackObservers()[0], false);

    expect(video.pause).toHaveBeenCalled();
  });

  it("re-attaches the observers when resyncKey changes (breakpoint remount)", () => {
    const { rerender } = render(<Clip resyncKey="/a.mp4" />);
    expect(playbackObservers()).toHaveLength(1);

    rerender(<Clip resyncKey="/b.mp4" />);

    expect(playbackObservers()[0].disconnect).toHaveBeenCalled();
    expect(playbackObservers()).toHaveLength(2);
  });

  it("disconnects both observers on unmount", () => {
    const { unmount } = render(<Clip />);
    unmount();

    expect(playbackObservers()[0].disconnect).toHaveBeenCalled();
    expect(prefetchObservers()[0].disconnect).toHaveBeenCalled();
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

  describe("look-ahead prefetch", () => {
    it("registers a second observer with a one-viewport rootMargin", () => {
      const { getByTestId } = render(<Clip />);
      const video = getByTestId("clip") as HTMLVideoElement;

      expect(prefetchObservers()).toHaveLength(1);
      expect(prefetchObservers()[0].options?.rootMargin).toBe("100% 0px");
      expect(prefetchObservers()[0].observe).toHaveBeenCalledWith(video);
    });

    it("upgrades preload to auto on approach WITHOUT playing", () => {
      const { getByTestId } = render(<Clip />);
      const video = getByTestId("clip") as HTMLVideoElement;
      video.play = jest.fn().mockResolvedValue(undefined);

      trigger(prefetchObservers()[0], true);

      expect(video.preload).toBe("auto");
      expect(video.play).not.toHaveBeenCalled();
    });

    it("is one-shot: disconnects after the first approach", () => {
      render(<Clip />);

      trigger(prefetchObservers()[0], true);

      expect(prefetchObservers()[0].disconnect).toHaveBeenCalled();
    });

    it("does not upgrade preload while still out of prefetch range", () => {
      const { getByTestId } = render(<Clip />);
      const video = getByTestId("clip") as HTMLVideoElement;

      trigger(prefetchObservers()[0], false);

      expect(video.preload).toBe("none");
      expect(prefetchObservers()[0].disconnect).not.toHaveBeenCalled();
    });

    it("defers attaching until the window load event while the page is still loading", () => {
      const spy = jest
        .spyOn(document, "readyState", "get")
        .mockReturnValue("loading");
      try {
        render(<Clip />);
        // Playback gate attaches immediately; prefetch waits for load.
        expect(playbackObservers()).toHaveLength(1);
        expect(prefetchObservers()).toHaveLength(0);

        act(() => {
          window.dispatchEvent(new Event("load"));
        });

        expect(prefetchObservers()).toHaveLength(1);
      } finally {
        spy.mockRestore();
      }
    });
  });
});
