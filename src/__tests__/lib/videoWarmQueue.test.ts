/**
 * The background page warmer: at window load, all registered clips upgrade
 * to preload="auto" in parallel; a clip counts as warmed on the browser's
 * suspend (buffering goal met); hidden twins and mobile viewports exempt.
 */

interface WarmQueueModule {
  registerForWarming: (v: HTMLVideoElement) => () => void;
}

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

  it("warms all registered clips in parallel at load", async () => {
    const a = makeClip();
    const b = makeClip();
    const c = makeClip();
    mod.registerForWarming(a);
    mod.registerForWarming(b);
    mod.registerForWarming(c);

    await jest.advanceTimersByTimeAsync(0);
    expect(a.preload).toBe("auto");
    expect(b.preload).toBe("auto");
    expect(c.preload).toBe("auto");
  });

  it("warms clips registered after the first batch finished", async () => {
    const a = makeClip();
    mod.registerForWarming(a);
    await jest.advanceTimersByTimeAsync(0);
    a.finish();
    await jest.advanceTimersByTimeAsync(0);

    const late = makeClip();
    mod.registerForWarming(late);
    await jest.advanceTimersByTimeAsync(0);

    expect(late.preload).toBe("auto");
  });

  it("treats the browser's suspend (buffering goal met) as warmed", async () => {
    const a = makeClip();
    mod.registerForWarming(a);
    await jest.advanceTimersByTimeAsync(0);
    expect(a.preload).toBe("auto");

    // Chrome buffered ~8s of a paused 10s clip and idled — counts as done
    // (no timers should remain pending for it).
    Object.defineProperty(a, "buffered", {
      configurable: true,
      get: () => ({ length: 1, end: () => 8 }),
    });
    a.dispatchEvent(new Event("suspend"));
    await jest.advanceTimersByTimeAsync(0);

    expect(jest.getTimerCount()).toBe(0);
  });

  it("releases a stalled clip via the per-clip timeout", async () => {
    const a = makeClip();
    mod.registerForWarming(a);
    await jest.advanceTimersByTimeAsync(0);
    expect(jest.getTimerCount()).toBe(1);

    await jest.advanceTimersByTimeAsync(CLIP_TIMEOUT);
    expect(jest.getTimerCount()).toBe(0);
  });

  it("skips hidden breakpoint twins (zero client rects)", async () => {
    const hidden = makeClip();
    (hidden as unknown as { getClientRects: () => unknown[] }).getClientRects =
      () => [];
    const visible = makeClip();
    mod.registerForWarming(hidden);
    mod.registerForWarming(visible);

    await jest.advanceTimersByTimeAsync(0);
    expect(hidden.preload).toBe("none");
    expect(visible.preload).toBe("auto");
  });

  it("does nothing on mobile viewports", async () => {
    matchMediaMatches = true; // MOBILE_MEDIA_QUERY matches
    const a = makeClip();
    mod.registerForWarming(a);

    await jest.advanceTimersByTimeAsync(CLIP_TIMEOUT);
    expect(a.preload).toBe("none");
  });

  it("unregister removes a clip before the batch runs", async () => {
    readyStateSpy.mockReturnValue("loading");
    const a = makeClip();
    const b = makeClip();
    const unregisterA = mod.registerForWarming(a);
    mod.registerForWarming(b);
    unregisterA();

    readyStateSpy.mockReturnValue("complete");
    window.dispatchEvent(new Event("load"));
    await jest.advanceTimersByTimeAsync(0);

    expect(a.preload).toBe("none");
    expect(b.preload).toBe("auto");
  });
});
