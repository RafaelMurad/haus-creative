"use client";

interface AudioToggleButtonProps {
  audible: boolean;
  onToggle: () => void;
  /** Positioning classes from the host (e.g. "bottom-3 right-3"). */
  className?: string;
}

/**
 * Instagram-style corner speaker for muted-autoplay videos — shows the
 * muted/audible state and toggles it. The host positions it over the video
 * (it is always absolutely positioned).
 */
export function AudioToggleButton({
  audible,
  onToggle,
  className = "bottom-3 right-3",
}: AudioToggleButtonProps) {
  return (
    <button
      type="button"
      aria-label={audible ? "Mute video" : "Play video with sound"}
      onClick={onToggle}
      className={`absolute z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition-opacity hover:bg-black/75 ${className}`}
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
  );
}
