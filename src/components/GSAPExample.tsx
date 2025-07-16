'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function GSAPExample() {
  const container = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  // Simple animation using the official useGSAP hook
  useGSAP(() => {
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        x: 200,
        rotation: 360,
        duration: 2,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
      })
    }
  }, { scope: container })

  // Scroll-triggered animation
  useGSAP(() => {
    if (boxRef.current) {
      gsap.fromTo(boxRef.current, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: boxRef.current,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  }, { scope: container })

  return (
    <div ref={container} className="p-8">
      <h2 className="text-2xl font-bold mb-4">GSAP Example</h2>
      <div 
        ref={boxRef}
        className="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
      >
        Box
      </div>
    </div>
  )
}