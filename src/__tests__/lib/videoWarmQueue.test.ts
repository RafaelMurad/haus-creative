/**
 * The background page warmer: after load, registered clips upgrade to
 * preload="auto" one at a time in document order; approaching clips can
 * jump the queue; mobile viewports are exempt.
 */

interface WarmQueueModule {
  registerForWarming: (v: HTMLVideoElement) => () => void;
  prioritizeWarming: (v: HTMLVideoElement) => void;
}

const START_DELAY = 1500;
const CLIP_TIMEOUT = 20_000;

let matchMediaMatches = false;

function makeClip(): HTMLVideoElement & { finish: () => void } {
  const v = document.createElement("video") as HTMLVideoElement & {
    finish: () => void;
  };
  v.setAttribute("preload", "none");
  const state = { rs: 0, end: 0 };
  Object.defineProperty(v, "readyState", {
    configurable: true,
    get: () => state.rs,
  });
  Object.defineProperty(v, "duration", { configurable: true, get: () => 10 });
  Object.defineProperty(v, "buffered", {
    configurable: true,
    get: () => ({ length: state.end > 0 ? 1 : 0, end: () => state.end }),
  });
  v.finish = () => {
    state.rs = 4;
    state.end = 10;
    v.dispatchEvent(new Event("canplaythrough"));
  };
  // jsdom has no layout — pretend the clip is visible (the queue skips
  // 0-size hidden breakpoint twins).
  (v as unknown as { getClientRects: () => unknown[] }).getClientRects = () => [
    {},
  ];
  document.body.appendChild(v);
  return v;
}

describe("videoWarmQueue", () => {
  let mod: WarmQueueModule;
  let readyStateSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
    document.body.innerHTML = "";
    matchMediaMatches = false;
    window.matchMedia = jest.fn(() => ({
      matches: matchMediaMatches,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })) as unknown as typeof window.matchMedia;
    readyStateSpy = jest
      .spyOn(document, "readyState", "get")
      .mockReturnValue("complete");
    mod = require("@/lib/videoWarmQueue");
  });

  afterEach(() => {
    readyStateSpy.mockRestore();
    jest.useRealTimers();
  });

  it("warms clips sequentially in document order after the start delay", async () => {
    const a = makeClip();
    const b = makeClip();
    mod.registerForWarming(a);
    mod.registerForWarming(b);

    expect(a.preload).toBe("none");

    await jest.advanceTimersByTimeAsync(START_DELAY);
    expect(a.preload).toBe("auto");
    expect(b.preload).toBe("none"); // strictly one at a time

    a.finish();
    await jest.advanceTimersByTimeAsync(0);
    expect(b.preload).toBe("auto");
  });

  it("lets a prioritized clip jump ahead of document order", async () => {
    const a = makeClip();
    const b = makeClip();
    const c = makeClip();
    mod.registerForWarming(a);
    mod.registerForWarming(b);
    mod.registerForWarming(c);

    await jest.advanceTimersByTimeAsync(START_DELAY);
    expect(a.preload).toBe("auto");

    mod.prioritizeWarming(c); // visitor is outrunning the queue toward c
    a.finish();
    await jest.advanceTimersByTimeAsync(0);

    expect(c.preload).toBe("auto");
    expect(b.preload).toBe("none");
  });

  it("moves on after the per-clip timeout instead of stalling the queue", async () => {
    const a = makeClip();
    const b = makeClip();
    mod.registerForWarming(a);
    mod.registerForWarming(b);

    await jest.advanceTimersByTimeAsync(START_DELAY);
    expect(a.preload).toBe("auto");
    expect(b.preload).toBe("none");

    await jest.advanceTimersByTimeAsync(CLIP_TIMEOUT); // a never finishes
    expect(b.preload).toBe("auto");
  });

  it("treats the browser's suspend (buffering goal met) as warmed", async () => {
    const a = makeClip();
    const b = makeClip();
    mod.registerForWarming(a);
    mod.registerForWarming(b);

    await jest.advanceTimersByTimeAsync(START_DELAY);
    expect(a.preload).toBe("auto");

    // Chrome buffered ~15s of a paused clip and idled — not full duration.
    Object.defineProperty(a, "buffered", {
      configurable: true,
      get: () => ({ length: 1, end: () => 8 }),
    });
    a.dispatchEvent(new Event("suspend"));
    await jest.advanceTimersByTimeAsync(0);

    expect(b.preload).toBe("auto");
  });

  it("skips hidden breakpoint twins (zero client rects)", async () => {
    const hidden = makeClip();
    (hidden as unknown as { getClientRects: () => unknown[] }).getClientRects =
      () => [];
    const visible = makeClip();
    mod.registerForWarming(hidden);
    mod.registerForWarming(visible);

    await jest.advanceTimersByTimeAsync(START_DELAY);
    expect(hidden.preload).toBe("none");
    expect(visible.preload).toBe("auto");
  });

  it("does nothing on mobile viewports", async () => {
    matchMediaMatches = true; // MOBILE_MEDIA_QUERY matches
    const a = makeClip();
    mod.registerForWarming(a);

    await jest.advanceTimersByTimeAsync(START_DELAY + CLIP_TIMEOUT);
    expect(a.preload).toBe("none");
  });

  it("unregister removes a clip before it warms", async () => {
    const a = makeClip();
    const b = makeClip();
    const unregisterA = mod.registerForWarming(a);
    mod.registerForWarming(b);
    unregisterA();

    await jest.advanceTimersByTimeAsync(START_DELAY);
    expect(a.preload).toBe("none");
    expect(b.preload).toBe("auto");
  });
});
