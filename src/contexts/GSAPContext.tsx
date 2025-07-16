'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

interface GSAPContextType {
  gsap: typeof gsap
  useGSAP: typeof useGSAP
}

const GSAPContext = createContext<GSAPContextType | null>(null)

interface GSAPProviderProps {
  children: ReactNode
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  const value: GSAPContextType = {
    gsap,
    useGSAP
  }

  return (
    <GSAPContext.Provider value={value}>
      {children}
    </GSAPContext.Provider>
  )
}

export function useGSAPContext() {
  const context = useContext(GSAPContext)
  if (!context) {
    throw new Error('useGSAPContext must be used within a GSAPProvider')
  }
  return context
}