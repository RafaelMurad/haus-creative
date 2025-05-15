'use client'

import { useRef } from 'react'
import { MediaItem as MediaItemType } from '../types'

interface MediaItemProps {
  item: MediaItemType;
  className?: string;
  onLoad?: () => void; // Changed from required to optional
  forwardedRef?: (element: HTMLElement | null) => void;
}

export default function MediaItem({ 
  item, 
  className = '', 
  onLoad, 
  forwardedRef 
}: MediaItemProps) {
  const localRef = useRef<HTMLElement | null>(null)
  const ref = forwardedRef || ((el: HTMLElement | null) => { localRef.current = el })

  // Handle media type rendering
  const renderMedia = () => {
    switch (item.type) {
      case 'video':
        return (
          <video
            ref={ref as (instance: HTMLVideoElement | null) => void}
            src={item.url}
            poster={item.thumbUrl}
            controls={false}
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
            className="w-full h-full object-cover"
            onLoadedData={onLoad}
          />
        )
      case 'gif':
        // GIFs are treated as images in HTML
        return (
          <img
            ref={ref as (instance: HTMLImageElement | null) => void}
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover"
            onLoad={onLoad}
          />
        )
      case 'image':
      default:
        return (
          <img
            ref={ref as (instance: HTMLImageElement | null) => void}
            src={item.url || item.imageUrl} // Handle both url and imageUrl for backward compatibility
            alt={item.title}
            className="w-full h-full object-cover"
            onLoad={onLoad}
          />
        )
    }
  }

  const style = item.size ? {
    width: item.size.width,
    height: item.size.height
  } : {}

  return (
    <div 
      className={`media-item relative overflow-hidden ${className}`}
      style={style}
    >
      {renderMedia()}
    </div>
  )
}