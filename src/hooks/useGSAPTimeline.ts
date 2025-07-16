'use client'

import { useRef, useCallback, DependencyList, useState } from 'react'
import { useGSAP } from '@gsap/react'

interface TimelineOptions {
  paused?: boolean
  repeat?: number
  yoyo?: boolean
  onComplete?: () => void
  onStart?: () => void
  onUpdate?: () => void
  onRepeat?: () => void
  onReverseComplete?: () => void
}

interface UseGSAPTimelineReturn {
  timeline: React.RefObject<gsap.core.Timeline | null>
  createTimeline: (options?: TimelineOptions) => gsap.core.Timeline
  addToTimeline: (target: any, vars: any, position?: any) => gsap.core.Timeline
  play: () => void
  pause: () => void
  reverse: () => void
  restart: () => void
  kill: () => void
  isPlaying: boolean
}

/**
 * Custom hook for handling GSAP timeline animations using the official useGSAP hook
 */
export default function useGSAPTimeline(
  options: TimelineOptions = {},
  deps: DependencyList = []
): UseGSAPTimelineReturn {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Create timeline
  const createTimeline = useCallback((timelineOptions: TimelineOptions = {}) => {
    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    const mergedOptions = { ...options, ...timelineOptions }
    
    const timeline = gsap.timeline({
      paused: mergedOptions.paused,
      repeat: mergedOptions.repeat,
      yoyo: mergedOptions.yoyo,
      onStart: () => {
        setIsPlaying(true)
        mergedOptions.onStart?.()
      },
      onComplete: () => {
        setIsPlaying(false)
        mergedOptions.onComplete?.()
      },
      onUpdate: mergedOptions.onUpdate,
      onRepeat: mergedOptions.onRepeat,
      onReverseComplete: mergedOptions.onReverseComplete
    })

    timelineRef.current = timeline
    return timeline
  }, [options])

  // Add animation to timeline
  const addToTimeline = useCallback((target: any, vars: any, position?: any) => {
    if (!timelineRef.current) return timelineRef.current as any
    
    return timelineRef.current.to(target, vars, position)
  }, [])

  // Timeline controls
  const play = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  const pause = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const reverse = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.reverse()
    }
  }, [])

  const restart = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.restart()
      setIsPlaying(true)
    }
  }, [])

  const kill = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
      setIsPlaying(false)
    }
  }, [])

  // Use the official useGSAP hook
  useGSAP(() => {
    createTimeline()
  }, deps)

  return {
    timeline: timelineRef,
    createTimeline,
    addToTimeline,
    play,
    pause,
    reverse,
    restart,
    kill,
    isPlaying
  }
}