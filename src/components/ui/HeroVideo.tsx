"use client";

import {
  HERO_DESKTOP_MEDIA_QUERY,
  HERO_MOBILE_MEDIA_QUERY,
  useResponsiveVideoSource,
} from "@/hooks/useMediaQuery";
import { useExclusiveAudio } from "@/hooks/useExclusiveAudio";
import { useInViewPlayback } from "@/hooks/useInViewPlayback";
import { AudioToggleButton } from "./AudioToggleButton";

interface HeroVideoProps {
  /** Omit to render no video on desktop (mobile-only hero, e.g. MC Arabia). */
  desktop?: string;
  mobile?: string;
  poster?: string;
  /**
   * Poster for the portrait file (below the hero swap boundary). When set,
   * the poster renders only after the breakpoint is known so the
   * wrong-breakpoint frame never flashes over the loading video.
   */
  posterMobile?: string;
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
  /**
   * Default true: a missing mobile file plays the desktop file below the
   * breakpoint (YSL's shared banner). False = strictly desktop-only — the
   * mobile side renders nothing and the pre-hydration <source> is gated so
   * phones never fetch a byte (the home showreel).
   */
  mobileFallback?: boolean;
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
 *
 * Playback is scroll-gated (useInViewPlayback). The project-page hero sits
 * at the top and is in view on load, so it still starts right away — but on
 * the home page, where the same component layers each tile's banner, a tile
 * below the fold now starts from frame 0 when scrolled to instead of already
 * being mid-film.
 */
export function HeroVideo({
  desktop,
  mobile,
  poster,
  posterMobile,
  objectFit = "cover",
  objectPosition = "center",
  hasAudio = false,
  mobileFallback = true,
}: HeroVideoProps) {
  const resolved = useResponsiveVideoSource(
    desktop,
    mobile,
    HERO_MOBILE_MEDIA_QUERY,
    mobileFallback,
  );
  // Poster is per-file where a mobile poster exists: the landscape poster
  // bakes content (e.g. Bride's title) that must not flash over the
  // portrait edit. Pre-hydration renders none in that case — the black
  // hero section covers the gap. Without posterMobile, behavior is
  // unchanged (single poster at all times).
  const activePoster = posterMobile
    ? resolved === null
      ? undefined
      : mobile && resolved === mobile
        ? posterMobile
        : poster
    : poster;
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
  useInViewPlayback(videoRef, resolved);

  if (!desktop && !mobile) return null;
  // Breakpoint known but this side has no file (e.g. desktop viewport on a
  // mobile-only hero) — render nothing.
  if (resolved === undefined) return null;

  const video = (
    <video
      ref={videoRef}
      key={resolved ?? "pre-hydration"}
      className={`absolute inset-0 w-full h-full${audioEnabled ? " cursor-pointer" : ""}`}
      style={{ objectFit, objectPosition }}
      playsInline
      loop
      muted
      poster={activePoster}
      // "none", not "metadata": with 7 tile heroes on the home page, the
      // metadata hint let Chrome read megabytes of below-fold clips at
      // landing (measured 3.6 MB, starving the LCP image). In-view heroes
      // still start instantly — the look-ahead observer flips preload to
      // "auto" at mount and play() forces the fetch regardless.
      preload="none"
      src={resolved ?? undefined}
      onClick={audioEnabled ? toggle : undefined}
    >
      {resolved === null && (
        <>
          {mobile && (
            <source src={mobile} type="video/mp4" media={HERO_MOBILE_MEDIA_QUERY} />
          )}
          {desktop && (
            <source
              src={desktop}
              type="video/mp4"
              media={mobileFallback ? undefined : HERO_DESKTOP_MEDIA_QUERY}
            />
          )}
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
