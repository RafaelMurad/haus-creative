"use client";

import { useEffect, type RefObject } from "react";

/**
 * Scroll-gated playback for the muted looping clips: play while any part of
 * the element is in the viewport, pause once it fully leaves. The <video>
 * must NOT carry the autoPlay attribute — playback starts here instead, so a
 * clip entering view for the first time starts at frame 0 rather than
 * already being mid-film (client note 2026-07-27), and re-entries resume
 * where they paused, Instagram-style.
 *
 * Pass the resolved source as `resyncKey`: the breakpoint swap remounts the
 * video element (key), and the effect re-attaches the observer to the new
 * node. Browsers without IntersectionObserver fall back to playing
 * immediately (the old autoplay behavior) so clips never dead-end.
 */
export function useInViewPlayback(
  videoRef: RefObject<HTMLVideoElement | null>,
  resyncKey?: unknown,
) {
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (typeof IntersectionObserver === "undefined") {
      v.play()?.catch(() => {});
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play()?.catch(() => {});
      else v.pause();
    });
    io.observe(v);

    // Look-ahead prefetch: one viewport before the clip scrolls in, upgrade
    // preload so the file buffers during the approach instead of at entry.
    // Without this, a preload="none" clip fetches its first byte only when
    // play() fires at the viewport edge — on a cold CDN region the visitor
    // stares at the poster while megabytes stream in (Vitor's "video da
    // esquerda não tá tocando", review 2026-07-27). One-shot per element;
    // playback stays gated at the true boundary above, so the frame-0 rule
    // is untouched.
    const prefetch = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        v.preload = "auto";
        prefetch.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    prefetch.observe(v);

    return () => {
      io.disconnect();
      prefetch.disconnect();
    };
  }, [videoRef, resyncKey]);
}
