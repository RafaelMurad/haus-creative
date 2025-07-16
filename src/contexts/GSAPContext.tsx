'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins only once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface GSAPContextType {
  gsap: typeof gsap
  isReady: boolean
}

const GSAPContext = createContext<GSAPContextType | null>(null)

interface GSAPProviderProps {
  children: ReactNode
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Ensure GSAP is ready on the client side
    if (typeof window !== 'undefined') {
      setIsReady(true)
    }
  }, [])

  const value: GSAPContextType = {
    gsap,
    isReady
  }

  return (
    <GSAPContext.Provider value={value}>
      {children}
    </GSAPContext.Provider>
  )
}

export function useGSAP() {
  const context = useContext(GSAPContext)
  if (!context) {
    throw new Error('useGSAP must be used within a GSAPProvider')
  }
  return context
}