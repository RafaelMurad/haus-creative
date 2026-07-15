"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Cross-instance signal so only one clip on the page is audible at a time. */
const AUDIO_EVENT = "haus:gallery-audio";

/**
 * Audio toggle for muted-autoplay videos with page-wide exclusivity —
 * unmuting one participant mutes every other (gallery clips and the hero
 * banner share the same channel).
 *
 * The muted flag is driven imperatively through the returned ref because
 * React only applies the `muted` prop on mount. Pass the resolved source as
 * `resyncKey`: the breakpoint swap remounts the element (key) with muted
 * markup, and the effect re-applies the current state to the new node.
 */
export function useExclusiveAudio(enabled: boolean, resyncKey?: unknown) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audible, setAudible] = useState(false);
  const instanceId = useId();

  // Sync the DOM muted flag (and keep playback going through the unmute
  // gesture — play() is a no-op when already playing).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !audible;
    if (audible) v.play()?.catch(() => {});
  }, [audible, resyncKey]);

  // Another participant went audible — fall back to muted.
  useEffect(() => {
    if (!enabled) return;
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== instanceId) setAudible(false);
    };
    window.addEventListener(AUDIO_EVENT, onOther);
    return () => window.removeEventListener(AUDIO_EVENT, onOther);
  }, [enabled, instanceId]);

  const toggle = () => {
    setAudible((prev) => {
      const next = !prev;
      if (next) {
        window.dispatchEvent(
          new CustomEvent<string>(AUDIO_EVENT, { detail: instanceId }),
        );
      }
      return next;
    });
  };

  return { videoRef, audible, toggle };
}
