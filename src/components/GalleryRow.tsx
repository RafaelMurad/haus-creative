'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import MediaItem from './MediaItem'
import useGsapAnimation from '../hooks/useGsapAnimation'
import { GalleryConfig, MediaItem as MediaItemType } from '../types'

interface GalleryRowProps {
  gallery: GalleryConfig;
}

export default function GalleryRow({ gallery }: GalleryRowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)
  
  // Set up the elements ref without ScrollTrigger initially
  const { elementsRef } = useGsapAnimation(
    {
      effect: gallery.animation.effect,
      duration: gallery.animation.duration,
      ease: gallery.animation.ease,
      stagger: gallery.animation.stagger || 0.15,
      from: gallery.animation.from,
      to: gallery.animation.to
    },
    [gallery.id]
  )
  
  // Set up ScrollTrigger after the component mounts and refs are populated
  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;
    
    const elements = elementsRef.current.filter(Boolean).filter(el => el instanceof Element);
    if (elements.length === 0) return;
    
    // Create animations with ScrollTrigger when the DOM is ready
    const animations = elements.map((el, index) => {
      return gsap.fromTo(
        el,
        { ...gallery.animation.from },
        {
          ...gallery.animation.to,
          duration: gallery.animation.duration,
          ease: gallery.animation.ease,
          delay: index * (gallery.animation.stagger || 0.15),
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
          }
        }
      );
    });
    
    setIsReady(true);
    
    // Clean up on unmount
    return () => {
      animations.forEach(anim => {
        if (anim && anim.scrollTrigger) {
          anim.scrollTrigger.kill();
        }
        anim.kill();
      });
    };
  }, [gallery.id, gallery.animation, elementsRef]);

  // Handle different gallery layouts
  const getLayoutClass = (): string => {
    switch (gallery.layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4'
      case 'carousel':
        return 'relative h-[500px]' // Height can be dynamic based on requirements
      case 'fullscreen':
        return 'relative h-screen w-full'
      default:
        return 'flex flex-wrap gap-4'
    }
  }

  // Set up carousel autoplay for carousel layouts
  useEffect(() => {
    if (gallery.layout !== 'carousel' && gallery.layout !== 'fullscreen') return
    if (!isReady) return;
    
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide()
      }
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isTransitioning, gallery.layout, isReady])
  
  // Carousel transition logic
  const nextSlide = (): void => {
    if (isTransitioning || !gallery.items.length) return

    setIsTransitioning(true)
    const nextIndex = (activeIndex + 1) % gallery.items.length
    
    // Get animation config
    const { animation } = gallery
    
    // Animate out current slide and in next slide
    const timeline = gsap.timeline({
      onComplete: () => {
        setActiveIndex(nextIndex)
        setIsTransitioning(false)
      }
    })
    
    if (elementsRef.current[activeIndex] && elementsRef.current[nextIndex]) {
      timeline.to(elementsRef.current[activeIndex], {
        opacity: 0,
        scale: animation.from?.scale || 0.95,
        duration: animation.duration || 0.8,
        ease: animation.ease || "power2.inOut"
      })
      
      timeline.fromTo(
        elementsRef.current[nextIndex],
        { opacity: 0, scale: animation.from?.scale || 0.95 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: animation.duration || 0.8,
          ease: animation.ease || "power2.inOut",
        },
        "<0.2" // Start 0.2s after the first animation starts
      )
    }
  }
  
  // Define a no-op function for onLoad to satisfy the type requirements
  const handleMediaLoad = () => {
    // No operation needed
  }
  
  // Render the appropriate layout
  const renderLayout = () => {
    switch (gallery.layout) {
      case 'carousel':
      case 'fullscreen':
        return (
          <div className={`relative ${gallery.layout === 'fullscreen' ? 'h-screen' : 'h-full'} overflow-hidden`}>
            {gallery.items.map((item, index) => (
              <div 
                key={item.id}
                className={`absolute inset-0 transition-opacity ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <MediaItem 
                  item={item}
                  forwardedRef={el => {
                    if (elementsRef.current) {
                      elementsRef.current[index] = el;
                    }
                  }}
                  className="w-full h-full"
                  onLoad={handleMediaLoad}
                />
              </div>
            ))}
          </div>
        )
      
      default: // grid, masonry, or default layout
        return gallery.items.map((item, index) => (
          <div 
            key={item.id} 
            className={gallery.layout === 'masonry' ? 'mb-4 break-inside-avoid' : ''}
          >
            <MediaItem 
              item={item} 
              forwardedRef={el => {
                if (elementsRef.current) {
                  elementsRef.current[index] = el;
                }
              }}
              onLoad={handleMediaLoad}
            />
          </div>
        ))
    }
  }
  
  return (
    <section className="gallery-row py-6">
      {/* Gallery Container - simplified without any padding for text elements */}
      <div 
        ref={containerRef}
        className={`max-w-7xl mx-auto px-4 ${getLayoutClass()}`}
      >
        {renderLayout()}
      </div>
    </section>
  )
}