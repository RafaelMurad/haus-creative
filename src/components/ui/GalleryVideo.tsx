"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ProjectMedia } from "@/config/projects";
import {
  MOBILE_MEDIA_QUERY,
  useResponsiveVideoSource,
} from "@/hooks/useMediaQuery";

interface GalleryVideoProps {
  item: ProjectMedia;
  index: number;
}

/** Cross-instance signal so only one gallery clip is audible at a time. */
const AUDIO_EVENT = "haus:gallery-audio";

/**
 * In-gallery ambient video at natural aspect (the video sibling of the
 * MaskFrame image render).
 *
 * Like HeroVideo, this re-selects its source when the viewport crosses the
 * mobile breakpoint — `<source media>` on <video> is only evaluated at load
 * time, so the native two-source markup (kept for SSR/no-JS) never swaps on
 * resize by itself.
 *
 * Clips flagged `hasAudio` get the Instagram-style treatment: they autoplay
 * muted (autoplay policy) with a corner speaker button; clicking the video or
 * the button unmutes it and mutes every other clip. The muted flag is driven
 * imperatively through a ref because React only applies the `muted` prop on
 * mount.
 */
export function GalleryVideo({ item, index }: GalleryVideoProps) {
  const resolved = useResponsiveVideoSource(item.desktop, item.mobile);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audible, setAudible] = useState(false);
  const instanceId = useId();

  // Sync the DOM muted flag (and keep playback going through the unmute
  // gesture). Re-runs on `resolved` too: the breakpoint swap remounts the
  // element (key) with muted markup.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !audible;
    if (audible) v.play()?.catch(() => {});
  }, [audible, resolved]);

  // Another clip went audible — fall back to muted.
  useEffect(() => {
    if (!item.hasAudio) return;
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== instanceId) setAudible(false);
    };
    window.addEventListener(AUDIO_EVENT, onOther);
    return () => window.removeEventListener(AUDIO_EVENT, onOther);
  }, [item.hasAudio, instanceId]);

  const toggleAudio = () => {
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

  const video = (
    <video
      ref={videoRef}
      key={resolved ?? "pre-hydration"}
      className={`${
        item.aspect
          ? "block w-full h-auto md:h-full md:object-cover"
          : "w-full h-auto block"
      }${item.hasAudio ? " cursor-pointer" : ""}`}
      playsInline
      autoPlay
      loop
      muted
      poster={item.inset ? undefined : item.poster}
      preload={index < 2 ? "metadata" : "none"}
      src={resolved ?? undefined}
      onClick={item.hasAudio ? toggleAudio : undefined}
    >
      {resolved === null && (
        <>
          {item.mobile && (
            <source
              src={item.mobile}
              type="video/mp4"
              media={MOBILE_MEDIA_QUERY}
            />
          )}
          <source src={item.desktop} type="video/mp4" />
        </>
      )}
    </video>
  );

  // Audio clips: anchor the speaker button to the video box itself, so it
  // stays inside the clip on framed cards and gutters alike. The wrapper is
  // h-full on md so the framed (inset) video still fills its card area.
  const core = item.hasAudio ? (
    <div className="relative md:h-full">
      {video}
      <button
        type="button"
        aria-label={audible ? "Mute video" : "Play video with sound"}
        onClick={toggleAudio}
        className="absolute bottom-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition-opacity hover:bg-black/75"
      >
        {audible ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white" aria-hidden>
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
            <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
            <path d="M14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white" aria-hidden>
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
            <path d="M20.5 10.6l-1.4-1.4-2.1 2.1-2.1-2.1-1.4 1.4 2.1 2.1-2.1 2.1 1.4 1.4 2.1-2.1 2.1 2.1 1.4-1.4-2.1-2.1 2.1-2.1z" />
          </svg>
        )}
      </button>
    </div>
  ) : (
    video
  );

  // Desktop only: the designed card box (aspect from the slot still) with
  // the clip inset inside it — the framing whitespace stays as page
  // background. The inset sits on a plain div because absolutely-positioned
  // replaced elements (video) don't stretch between top/bottom offsets;
  // divs do, and the video fills the div. On mobile both wrappers are
  // inert and the clip renders natural-aspect edge-to-edge, stacking like
  // the static images (per-slot mobile spacing comes from config).
  const framed = item.aspect ? (
    <div
      className="relative w-full md:aspect-[var(--card-ar)] md:bg-[var(--card-bg)]"
      style={
        {
          "--card-ar": item.aspect,
          // Painted card background behind the inset clip (e.g. the beige
          // Ouronyx panel). Transparent when unset.
          "--card-bg": item.bgColor ?? "transparent",
        } as React.CSSProperties
      }
    >
      <div
        className="md:absolute md:[inset:var(--card-inset)]"
        style={{ "--card-inset": item.inset ?? "0" } as React.CSSProperties}
      >
        {core}
      </div>
    </div>
  ) : (
    core
  );

  // Mobile card gutter — insets the card on all four sides below md only,
  // composing with (not replacing) the desktop framing above.
  if (item.mobileGutter) {
    return (
      <div
        className="p-[var(--m-gutter)] md:p-0"
        style={{ "--m-gutter": item.mobileGutter } as React.CSSProperties}
      >
        {framed}
      </div>
    );
  }

  return framed;
}
