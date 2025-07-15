"use client";

import { useRef, useEffect } from "react";
import { MediaItem as MediaItemType } from "../types";

interface MediaItemProps {
  item: MediaItemType;
  isActive?: boolean;
  className?: string;
}

export default function MediaItem({ 
  item, 
  isActive = true, 
  className = "" 
}: MediaItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Control video playback based on isActive prop
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && item.type === 'video') {
      if (isActive) {
        const attemptPlay = async () => {
          try {
            if (videoElement.readyState >= 2) {
              await videoElement.play();
            } else {
              setTimeout(attemptPlay, 100);
            }
          } catch (error: any) {
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.warn('Video play failed:', error);
            }
          }
        };
        attemptPlay();
      } else {
        videoElement.pause();
      }
    }
  }, [isActive, item.type]);

  const renderMedia = () => {
    switch (item.type) {
      case 'video':
        return (
          <video
            ref={videoRef}
            src={item.url}
            className={`w-full h-full object-cover ${className}`}
            muted
            loop
            playsInline
            poster={item.thumbUrl}
            preload="metadata"
            controls={false}
            disablePictureInPicture={true}
            disableRemotePlayback={true}
          />
        );
      
      case 'image':
      default:
        return (
          <img
            src={item.url}
            alt={item.title}
            className={`w-full h-full object-cover ${className}`}
          />
        );
    }
  };

  return (
    <div className="w-full h-full relative">
      {renderMedia()}
    </div>
  );
}