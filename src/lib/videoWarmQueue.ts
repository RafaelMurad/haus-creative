"use client";

import { MOBILE_MEDIA_QUERY } from "@/hooks/useMediaQuery";

/**
 * Page-wide background warmer: after the window load event, every registered
 * clip is upgraded to preload="auto" ONE AT A TIME in document (scroll)
 * order, so by the time the visitor scrolls to a clip it is already
 * buffered ("all content ready when I scroll down", 2026-08-04).
 *
 * Design constraints:
 * - Starts only after `load` + a grace delay — the warm-up must never
 *   compete with the LCP image or the in-view hero's own stream.
 * - Strictly sequential: seven clips fetched in parallel starve each other
 *   AND the clip the visitor is actually watching; one at a time finishes
 *   top-of-page first, matching scroll order.
 * - `prioritize()` lets the look-ahead observer bump an approaching clip to
 *   the front when the visitor scrolls faster than the queue.
 * - Desktop only, and never under Save-Data: eagerly pulling a whole page
 *   of video onto a phone plan is hostile. Mobile keeps the one-viewport
 *   look-ahead behavior.
 */

const WARM_START_DELAY_MS = 1500;
const PER_CLIP_TIMEOUT_MS = 20_000;

const queue: HTMLVideoElement[] = [];
const prioritized = new Set<HTMLVideoElement>();
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
 * willing to hold for a paused element. Chrome never fills a paused video
 * to 100% — it buffers its look-ahead goal (typically 10–15s) and then
 * fires `suspend` and idles. That suspend IS the "warmed" signal: the clip
 * starts instantly on scroll and streams on as it plays. The timeout is
 * only a safety net for stalled networks.
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
    // suspended before the queue got here) — nothing left to wait for.
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
      // Approaching clips (bumped by the look-ahead observer) win; the rest
      // go in document order = scroll order. Re-evaluated every step so
      // bumps and late registrations slot in correctly.
      queue.sort((a, b) => {
        const pa = prioritized.has(a) ? 0 : 1;
        const pb = prioritized.has(b) ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1;
      });
      const v = queue.shift()!;
      prioritized.delete(v);
      // Skip detached elements, already-warm clips, and hidden breakpoint
      // twins (0-size; their files are shared with a visible sibling slot).
      if (!v.isConnected || fullyBuffered(v)) continue;
      if (v.getClientRects().length === 0) continue;
      await warm(v);
    }
  } finally {
    running = false;
    // Late registrations while the last clip was warming.
    if (queue.length > 0 && eligible()) void run();
  }
}

function ensureStarted(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  const kick = () => setTimeout(() => void run(), WARM_START_DELAY_MS);
  if (document.readyState === "complete") kick();
  else window.addEventListener("load", kick, { once: true });
}

/** Register a clip for background warming. Returns an unregister cleanup. */
export function registerForWarming(v: HTMLVideoElement): () => void {
  if (!queue.includes(v)) queue.push(v);
  ensureStarted();
  if (started && !running && document.readyState === "complete") {
    setTimeout(() => void run(), WARM_START_DELAY_MS);
  }
  return () => {
    const i = queue.indexOf(v);
    if (i >= 0) queue.splice(i, 1);
    prioritized.delete(v);
  };
}

/** The look-ahead observer bumps an approaching clip ahead of the rest. */
export function prioritizeWarming(v: HTMLVideoElement): void {
  if (queue.includes(v)) prioritized.add(v);
}