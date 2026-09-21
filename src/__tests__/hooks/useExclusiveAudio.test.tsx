import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import {
  useExclusiveAudio,
  resetAutoSoundSession,
} from "@/hooks/useExclusiveAudio";

// The hook creates up to TWO observers per element: the auto-claim watcher
// (threshold 0.5, only with autoClaim) and the audible-drop watcher (no
// options, only while audible). Track every instance with its options so
// tests can address each.
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
  resetAutoSoundSession();

  global.IntersectionObserver = jest.fn(
    (
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) => {
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

afterEach(() => {
  jest.useRealTimers();
});

const claimObservers = () => observers.filter((o) => o.options?.threshold === 0.5);
const dropObservers = () => observers.filter((o) => !o.options);

// Helper component: a hook-wired <video> with the toggle exposed, mirroring
// GalleryVideo's wiring (tap on the clip toggles sound).
function Clip({
  id,
  autoClaim = false,
  enabled = true,
}: {
  id: string;
  autoClaim?: boolean;
  enabled?: boolean;
}) {
  const { videoRef, audible, toggle } = useExclusiveAudio(
    enabled,
    undefined,
    autoClaim,
  );
  return (
    <div>
      <video ref={videoRef} data-testid={`clip-${id}`} muted onClick={toggle} />
      <span data-testid={`audible-${id}`}>{String(audible)}</span>
    </div>
  );
}

function trigger(observer: MockObserver, isIntersecting: boolean) {
  act(() => {
    observer.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

/** Flush the play() promise chain (revert runs in a catch microtask). */
const flush = () => act(async () => {});

/** Put the element "on screen" for the revert's resume-play guard. */
function mockOnScreen(video: HTMLVideoElement) {
  video.getBoundingClientRect = jest.fn(
    () => ({ top: 0, bottom: 100 }) as DOMRect,
  );
}

describe("useExclusiveAudio auto-claim (mobile case galleries)", () => {
  it("creates no claim observer without autoClaim (desktop unchanged)", () => {
    render(<Clip id="a" />);
    expect(claimObservers()).toHaveLength(0);
  });

  it("registers the claim observer at half visibility with autoClaim", () => {
    const { getByTestId } = render(<Clip id="a" autoClaim />);
    expect(claimObservers()).toHaveLength(1);
    expect(claimObservers()[0].observe).toHaveBeenCalledWith(
      getByTestId("clip-a"),
    );
  });

  it("claims the channel as the clip scrolls in: unmutes and keeps playing", async () => {
    const { getByTestId } = render(<Clip id="a" autoClaim />);
    const video = getByTestId("clip-a") as HTMLVideoElement;
    video.play = jest.fn().mockResolvedValue(undefined);

    trigger(claimObservers()[0], true);
    await flush();

    expect(getByTestId("audible-a").textContent).toBe("true");
    expect(video.muted).toBe(false);
    expect(video.play).toHaveBeenCalled();
  });

  it("hands the channel over between clips, Instagram-style", async () => {
    const { getByTestId } = render(
      <>
        <Clip id="a" autoClaim />
        <Clip id="b" autoClaim />
      </>,
    );
    const a = getByTestId("clip-a") as HTMLVideoElement;
    const b = getByTestId("clip-b") as HTMLVideoElement;
    a.play = jest.fn().mockResolvedValue(undefined);
    b.play = jest.fn().mockResolvedValue(undefined);

    trigger(claimObservers()[0], true);
    await flush();
    trigger(claimObservers()[1], true);
    await flush();

    expect(getByTestId("audible-a").textContent).toBe("false");
    expect(getByTestId("audible-b").textContent).toBe("true");
    expect(a.muted).toBe(true);
    expect(b.muted).toBe(false);
  });

  it("reverts to the muted loop when the browser refuses sound (iOS) and resumes on-screen playback", async () => {
    const { getByTestId } = render(<Clip id="a" autoClaim />);
    const video = getByTestId("clip-a") as HTMLVideoElement;
    mockOnScreen(video);
    video.play = jest
      .fn()
      .mockRejectedValueOnce(new DOMException("denied", "NotAllowedError"))
      .mockResolvedValue(undefined);

    trigger(claimObservers()[0], true);
    await flush();

    expect(getByTestId("audible-a").textContent).toBe("false");
    expect(video.muted).toBe(true);
    // Unmuted attempt + muted resume.
    expect(video.play).toHaveBeenCalledTimes(2);
  });

  it("stops volunteering after a refusal until the next pointerdown (the unlocking gesture)", async () => {
    const { getByTestId } = render(
      <>
        <Clip id="a" autoClaim />
        <Clip id="b" autoClaim />
      </>,
    );
    const a = getByTestId("clip-a") as HTMLVideoElement;
    const b = getByTestId("clip-b") as HTMLVideoElement;
    mockOnScreen(a);
    a.play = jest
      .fn()
      .mockRejectedValueOnce(new DOMException("denied", "NotAllowedError"))
      .mockResolvedValue(undefined);
    b.play = jest.fn().mockResolvedValue(undefined);

    trigger(claimObservers()[0], true);
    await flush();

    // Blocked: the next clip enters silently.
    trigger(claimObservers()[1], true);
    await flush();
    expect(getByTestId("audible-b").textContent).toBe("false");
    expect(b.play).not.toHaveBeenCalled();

    // A tap anywhere is the gesture that may unlock autoplay — retry resumes.
    fireEvent.pointerDown(window);
    trigger(claimObservers()[1], true);
    await flush();
    expect(getByTestId("audible-b").textContent).toBe("true");
  });

  it("reverts via the deferred check when the engine pauses instead of rejecting", async () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<Clip id="a" autoClaim />);
    const video = getByTestId("clip-a") as HTMLVideoElement;
    mockOnScreen(video);
    // play() "succeeds" but the element stays paused (jsdom default).
    video.play = jest.fn().mockResolvedValue(undefined);

    trigger(claimObservers()[0], true);
    await flush();
    expect(getByTestId("audible-a").textContent).toBe("true");

    act(() => {
      jest.advanceTimersByTime(250);
    });
    await flush();

    expect(getByTestId("audible-a").textContent).toBe("false");
    expect(video.muted).toBe(true);
  });

  it("respects an explicit dismissal for the rest of the session, until sound is invited back", async () => {
    const { getByTestId } = render(<Clip id="a" autoClaim />);
    const video = getByTestId("clip-a") as HTMLVideoElement;
    video.play = jest.fn().mockResolvedValue(undefined);

    trigger(claimObservers()[0], true);
    await flush();
    expect(getByTestId("audible-a").textContent).toBe("true");

    // Visitor taps sound off — later clips must not volunteer it again.
    fireEvent.click(video);
    await flush();
    expect(getByTestId("audible-a").textContent).toBe("false");
    trigger(claimObservers()[0], true);
    await flush();
    expect(getByTestId("audible-a").textContent).toBe("false");

    // Tapping sound back on lifts the dismissal for upcoming clips.
    fireEvent.click(video);
    await flush();
    expect(getByTestId("audible-a").textContent).toBe("true");
    trigger(dropObservers()[0], false); // scroll away: drop to muted
    await flush();
    trigger(claimObservers()[0], true);
    await flush();
    expect(getByTestId("audible-a").textContent).toBe("true");
  });

  it("still drops sound once the audible clip fully leaves the viewport", async () => {
    const { getByTestId } = render(<Clip id="a" autoClaim />);
    const video = getByTestId("clip-a") as HTMLVideoElement;
    video.play = jest.fn().mockResolvedValue(undefined);

    trigger(claimObservers()[0], true);
    await flush();
    expect(getByTestId("audible-a").textContent).toBe("true");

    trigger(dropObservers()[0], false);
    await flush();

    expect(getByTestId("audible-a").textContent).toBe("false");
    expect(video.muted).toBe(true);
  });
});
