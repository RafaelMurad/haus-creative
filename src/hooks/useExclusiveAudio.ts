"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Cross-instance signal so only one clip on the page is audible at a time. */
const AUDIO_EVENT = "haus:gallery-audio";

/**
 * Session memory for auto sound (mobile case galleries, Vitor 2026-09-20):
 * once the visitor taps sound off, clips stop volunteering it; once the
 * browser refuses an unmuted autoplay, attempts pause until the next
 * pointerdown — the gesture that may unlock them (Chrome Android unlocks the
 * page after one tap; iOS keeps requiring a tap per video, so there the
 * refusal simply persists and clips stay on the muted-loop + speaker-button
 * behavior). Module-level on purpose: the choice follows the visitor across
 * case navigations within the SPA session.
 */
let autoSoundDismissed = false;
let autoSoundBlocked = false;

/** Test-only: clear the module-level auto-sound session flags. */
export function resetAutoSoundSession() {
  autoSoundDismissed = false;
  autoSoundBlocked = false;
}

/**
 * Audio toggle for muted-autoplay videos with page-wide exclusivity —
 * unmuting one participant mutes every other (gallery clips and the hero
 * banner share the same channel).
 *
 * The muted flag is driven imperatively through the returned ref because
 * React only applies the `muted` prop on mount. Pass the resolved source as
 * `resyncKey`: the breakpoint swap remounts the element (key) with muted
 * markup, and the effect re-applies the current state to the new node.
 *
 * With `autoClaim` (mobile case galleries), a clip claims the audio channel
 * once half of it scrolls in — sound follows the scroll, Instagram-style —
 * and falls back to the plain muted loop wherever the browser refuses
 * unmuted autoplay (iOS requires a per-video tap; Android allows sound after
 * the tap that navigated into the case).
 */
export function useExclusiveAudio(
  enabled: boolean,
  resyncKey?: unknown,
  autoClaim = false,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audible, setAudible] = useState(false);
  const instanceId = useId();

  // Sync the DOM muted flag (and keep playback going through the unmute
  // gesture — play() is a no-op when already playing). If the browser
  // refuses sound — an auto-claim without a qualifying gesture — revert to
  // the muted loop instead of leaving a frozen frame. Engines enforce the
  // policy two ways: rejecting the play() promise, or silently pausing the
  // element on unmute; the deferred `verify` check covers the second.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !audible;
    if (!audible) return;
    const revert = () => {
      autoSoundBlocked = true;
      v.muted = true;
      setAudible(false);
      // Resume the muted loop only while on screen — off-screen playback is
      // the scroll gate's decision (useInViewPlayback), not ours.
      const r = v.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight && v.paused) {
        v.play()?.catch(() => {});
      }
    };
    v.play()?.catch(revert);
    const verify = window.setTimeout(() => {
      if (v.paused) revert();
    }, 250);
    return () => window.clearTimeout(verify);
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

  // Sound doesn't follow the user away: once the audible clip fully leaves
  // the viewport, drop back to muted. Observed only while audible (and
  // re-attached after breakpoint remounts via resyncKey).
  useEffect(() => {
    if (!audible) return;
    const v = videoRef.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setAudible(false);
    });
    io.observe(v);
    return () => io.disconnect();
  }, [audible, resyncKey]);

  // Auto claim (mobile case galleries): entering clips volunteer their
  // soundtrack. Half-visibility threshold so the clip being looked at holds
  // the channel — the first pixel of the next clip doesn't steal audio from
  // one still filling the screen. Suppressed after an explicit dismissal
  // (visitor's choice wins) or while the browser refuses unmuted autoplay;
  // any pointerdown is the gesture that may lift the refusal, so it retries
  // from the next clip on.
  useEffect(() => {
    if (!enabled || !autoClaim) return;
    const v = videoRef.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const unlock = () => {
      autoSoundBlocked = false;
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || autoSoundDismissed || autoSoundBlocked)
          return;
        window.dispatchEvent(
          new CustomEvent<string>(AUDIO_EVENT, { detail: instanceId }),
        );
        setAudible(true);
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      window.removeEventListener("pointerdown", unlock);
    };
  }, [enabled, autoClaim, instanceId, resyncKey]);

  const toggle = () => {
    setAudible((prev) => {
      const next = !prev;
      if (next) {
        // A real tap is also the gesture that unlocks refused autoplay.
        autoSoundDismissed = false;
        autoSoundBlocked = false;
        window.dispatchEvent(
          new CustomEvent<string>(AUDIO_EVENT, { detail: instanceId }),
        );
      } else {
        // Explicit dismissal: stop volunteering sound on upcoming clips.
        autoSoundDismissed = true;
      }
      return next;
    });
  };

  return { videoRef, audible, toggle };
}
