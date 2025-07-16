'use client'

import React from 'react'
import useGSAPAnimation from '../hooks/useGSAPAnimation'
import useScrollTrigger from '../hooks/useScrollTrigger'

interface AnimatedSectionProps {
  children: React.ReactNode
  effect?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'clip-reveal'
  duration?: number
  delay?: number
  stagger?: number
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedSection({
  children,
  effect = 'fade',
  duration = 0.8,
  delay = 0,
  stagger = 0.1,
  className = '',
  style = {}
}: AnimatedSectionProps) {
  const { elementRef, isAnimating } = useGSAPAnimation(
    {
      effect,
      duration,
      delay,
      stagger,
      scrollTrigger: {
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      }
    },
    [effect, duration, delay, stagger]
  )

  return (
    <div
      ref={elementRef}
      className={`animated-section ${className}`}
      style={style}
      data-animating={isAnimating}
    >
      {children}
    </div>
  )
}

// Example of a component with ScrollTrigger
export function ScrollTriggerSection({
  children,
  trigger = 'top center',
  className = '',
  style = {}
}: {
  children: React.ReactNode
  trigger?: string
  className?: string
  style?: React.CSSProperties
}) {
  const { triggerRef } = useScrollTrigger(
    {
      start: trigger,
      toggleActions: 'play none none reverse',
      markers: false
    },
    [trigger]
  )

  return (
    <div
      ref={triggerRef}
      className={`scroll-trigger-section ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}