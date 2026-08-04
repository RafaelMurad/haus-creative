"use client";

import { MOBILE_MEDIA_QUERY } from "@/hooks/useMediaQuery";

/**
 * Page-wide background warmer: at the window load event, every registered
 * clip is upgraded to preload="auto" IN PARALLEL, so the whole page reaches
 * instant-start as fast as the connection allows ("max 2–3s, everything
 * ready", 2026-08-04).
 *
 * Parallel, not sequential: the goal is every clip holding its first few
 * seconds ASAP — a shared pipe fills all buffers together, so the bottom of
 * the page gets its first seconds before the top gets its fifteenth.
 * Chrome's own paused-media buffering goal (~10–15s per clip, then
 * `suspend`) caps how much each element takes, so this converges instead of
 * downloading whole files.
 *
 * Exempt: mobile viewports and Save-Data users — forcing a page's worth of
 * video onto a phone plan is hostile; they keep the one-viewport look-ahead
 * from useInViewPlayback.
 */

const PER_CLIP_TIMEOUT_MS = 20_000;

const queue: HTMLVideoElement[] = [];
let started = false;
let running = false;

function eligible(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) return false;
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  return true;
}

function fullyBuffered(v: HTMLVideoElement): boolean {
  if (v.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && v.buffered.length) {
    const end = v.buffered.end(v.buffered.length - 1);
    if (Number.isFinite(v.duration) && end >= v.duration - 0.3) return true;
  }
  return false;
}

/**
 * Resolves when the browser has buffered as much of the clip as it is
 * willing to hold for a paused element (Chrome buffers its look-ahead goal,
 * then fires `suspend` and idles — that IS instant-start readiness; the
 * rest streams during playback). Timeout is a stalled-network safety net.
 */
function warm(v: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout>;
    const done = () => {
      clearTimeout(timer);
      v.removeEventListener("progress", check);
      v.removeEventListener("canplaythrough", check);
      v.removeEventListener("suspend", onSuspend);
      resolve();
    };
    const check = () => {
      // Detached elements (breakpoint remounts) resolve immediately.
      if (!v.isConnected || fullyBuffered(v)) done();
    };
    const onSuspend = () => {
      // Only meaningful once something is buffered — a preload="none"
      // element fires an initial suspend before any fetch.
      if (v.buffered.length > 0) done();
    };
    v.addEventListener("progress", check);
    v.addEventListener("canplaythrough", check);
    v.addEventListener("suspend", onSuspend);
    timer = setTimeout(done, PER_CLIP_TIMEOUT_MS);
    v.preload = "auto";
    check();
    // Already idle with data (e.g. the look-ahead warmed it and Chrome
    // suspended before we got here) — nothing left to wait for.
    if (v.networkState === HTMLMediaElement.NETWORK_IDLE && v.buffered.length > 0) {
      done();
    }
  });
}

async function run(): Promise<void> {
  if (running) return;
  running = true;
  try {
    while (queue.length > 0) {
      if (!eligible()) return;
      const batch = queue.splice(0, queue.length).filter(
        (v) =>
          v.isConnected &&
          !fullyBuffered(v) &&
          // Hidden breakpoint twins (0-size) share their file with a
          // visible sibling slot — warming them would double-fetch.
          v.getClientRects().length > 0,
      );
      await Promise.all(batch.map(warm));
    }
  } finally {
    running = false;
    // Registrations that arrived while the batch was warming.
    if (queue.length > 0 && eligible()) void run();
  }
}

function ensureStarted(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  // Zero-delay defer so every registration in the same hydration pass joins
  // ONE parallel batch instead of the first clip batching alone.
  const kick = () => setTimeout(() => void run(), 0);
  if (document.readyState === "complete") kick();
  else window.addEventListener("load", kick, { once: true });
}

/** Register a clip for background warming. Returns an unregister cleanup. */
export function registerForWarming(v: HTMLVideoElement): () => void {
  if (!queue.includes(v)) queue.push(v);
  ensureStarted();
  if (started && !running && document.readyState === "complete") {
    setTimeout(() => void run(), 0);
  }
  return () => {
    const i = queue.indexOf(v);
    if (i >= 0) queue.splice(i, 1);
  };
}
