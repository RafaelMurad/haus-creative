"use client";

import { useState, useRef } from "react";

interface VideoHeroProps {
  videoSrc: string;
  videoSrcMobile?: string;
  posterSrc?: string;
  fullVideoSrc?: string;
}

export function VideoHero({
  videoSrc,
  videoSrcMobile,
  posterSrc,
  fullVideoSrc,
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayFullVideo = () => {
    // In a real implementation, this would open a modal with the full video
    // For now, we'll just toggle a playing state
    setIsPlaying(true);
    if (fullVideoSrc && videoRef.current) {
      videoRef.current.src = fullVideoSrc;
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  return (
    <section
      className="relative w-full h-screen bg-black overflow-hidden"
      data-playing={isPlaying}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        autoPlay
        loop
        muted
        poster={posterSrc}
      >
        {/* Mobile video source */}
        {videoSrcMobile && (
          <source src={videoSrcMobile} type="video/mp4" media="(max-width: 768px)" />
        )}
        {/* Desktop video source */}
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top gradient for header readability */}
        <div
          className="absolute top-0 left-0 w-full h-[120px]"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 w-full h-[200px]"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.30) 100%)",
          }}
        />
      </div>

      {/* Play Full Video Button */}
      {fullVideoSrc && !isPlaying && (
        <div className="absolute z-20 left-4 md:left-5 bottom-[90px] md:bottom-5">
          <button
            onClick={handlePlayFullVideo}
            className="group flex items-center gap-2 text-white uppercase text-xs transition-opacity duration-250 hover:opacity-50"
          >
            <PlayIcon />
            <span className="mt-[0.3em]">View Full Video</span>
          </button>
        </div>
      )}

      {/* Scroll indicator (optional) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <div className="w-[1px] h-12 bg-white/50 animate-pulse" />
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.5 11.691V1.309L10.882 6.5L0.5 11.691Z" stroke="currentColor" />
    </svg>
  );
}
