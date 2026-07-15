"use client";

import {
  MOBILE_MEDIA_QUERY,
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
   * gallery clips. Only set where the file was muxed with audio.
   */
  hasAudio?: boolean;
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
  const resolved = useResponsiveVideoSource(desktop, mobile);
  const { videoRef, audible, toggle } = useExclusiveAudio(hasAudio, resolved);

  if (!desktop && !mobile) return null;
  // Breakpoint known but this side has no file (e.g. desktop viewport on a
  // mobile-only hero) — render nothing.
  if (resolved === undefined) return null;

  const video = (
    <video
      ref={videoRef}
      key={resolved ?? "pre-hydration"}
      className={`absolute inset-0 w-full h-full${hasAudio ? " cursor-pointer" : ""}`}
      style={{ objectFit, objectPosition }}
      playsInline
      autoPlay
      loop
      muted
      poster={poster}
      preload="metadata"
      src={resolved ?? undefined}
      onClick={hasAudio ? toggle : undefined}
    >
      {resolved === null && (
        <>
          {mobile && (
            <source src={mobile} type="video/mp4" media={MOBILE_MEDIA_QUERY} />
          )}
          {desktop && <source src={desktop} type="video/mp4" />}
        </>
      )}
    </video>
  );

  if (!hasAudio) return video;

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
