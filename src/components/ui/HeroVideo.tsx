"use client";

import {
  HERO_MOBILE_MEDIA_QUERY,
  useResponsiveVideoSource,
} from "@/hooks/useMediaQuery";
import { useExclusiveAudio } from "@/hooks/useExclusiveAudio";
import { AudioToggleButton } from "./AudioToggleButton";

interface HeroVideoProps {
  /** Omit to render no video on desktop (mobile-only hero, e.g. MC Arabia). */
  desktop?: string;
  mobile?: string;
  poster?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  /**
   * The banner file carries an audio track — show the corner speaker and
   * unmute on click, sharing the one-audible-at-a-time channel with the
   * gallery clips. Only set where the file was muxed with audio; object
   * form enables it per breakpoint file (some mobile exports ship silent
   * tracks).
   */
  hasAudio?: boolean | { desktop?: boolean; mobile?: boolean };
}

/**
 * Full-bleed hero video that re-selects its source when the viewport crosses
 * the mobile breakpoint.
 *
 * Browsers evaluate `<source media>` on <video> only once, at load time
 * (unlike <picture>, which re-evaluates on resize) — so a native two-source
 * video never swaps files when the window is resized. This component tracks
 * the breakpoint with matchMedia and remounts the element (`key`) with the
 * right file instead. Until the breakpoint is known (SSR + first paint) it
 * renders the provided sources and lets the browser pick, so no-JS and
 * first-paint behavior match the previous markup.
 *
 * When only one side has a file, the other side renders nothing — the page
 * supplies its own fallback (e.g. the static heroImage on desktop).
 */
export function HeroVideo({
  desktop,
  mobile,
  poster,
  objectFit = "cover",
  objectPosition = "center",
  hasAudio = false,
}: HeroVideoProps) {
  const resolved = useResponsiveVideoSource(
    desktop,
    mobile,
    HERO_MOBILE_MEDIA_QUERY,
  );
  // Audio presence is a per-file fact — resolve the flag against the file
  // that's actually playing (the mobile fallback to the desktop file keeps
  // the desktop flag, e.g. YSL's shared banner).
  const audioEnabled =
    typeof hasAudio === "object"
      ? mobile && resolved === mobile
        ? !!hasAudio.mobile
        : !!hasAudio.desktop
      : hasAudio;
  const { videoRef, audible, toggle } = useExclusiveAudio(
    audioEnabled,
    resolved,
  );

  if (!desktop && !mobile) return null;
  // Breakpoint known but this side has no file (e.g. desktop viewport on a
  // mobile-only hero) — render nothing.
  if (resolved === undefined) return null;

  // Whole-frame heroes go contain only ABOVE the lg swap boundary — below
  // it the portrait edit plays in tall boxes whose ratio it matches, where
  // cover fills edge-to-edge without cutting anything (contain there would
  // just add hairline bars, e.g. on home's viewport-ratio tiles).
  const fitClass =
    objectFit === "contain" ? "object-cover lg:object-contain" : "object-cover";

  const video = (
    <video
      ref={videoRef}
      key={resolved ?? "pre-hydration"}
      className={`absolute inset-0 w-full h-full ${fitClass}${audioEnabled ? " cursor-pointer" : ""}`}
      style={{ objectPosition }}
      playsInline
      autoPlay
      loop
      muted
      poster={poster}
      preload="metadata"
      src={resolved ?? undefined}
      onClick={audioEnabled ? toggle : undefined}
    >
      {resolved === null && (
        <>
          {mobile && (
            <source src={mobile} type="video/mp4" media={HERO_MOBILE_MEDIA_QUERY} />
          )}
          {desktop && <source src={desktop} type="video/mp4" />}
        </>
      )}
    </video>
  );

  if (!audioEnabled) return video;

  // The hero's parent section is the positioned full-bleed box the video
  // fills, so the speaker anchors to the same box as a sibling overlay.
  return (
    <>
      {video}
      <AudioToggleButton
        audible={audible}
        onToggle={toggle}
        className="bottom-5 right-5"
      />
    </>
  );
}
