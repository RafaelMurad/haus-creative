/**
 * Core Web Vitals Monitoring - Minimal Implementation
 * Phase 3.1 Chunk 1: Basic Web Vitals tracking with web-vitals library
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'

// Basic performance metric interface
export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
}

// Performance thresholds (Google's Core Web Vitals)
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
  INP: { good: 200, needsImprovement: 500 },   // Interaction to Next Paint (ms) - replaces FID
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift (ratio)
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte (ms)
}

// Simple performance monitor class
class WebVitalsMonitor {
  private metrics: PerformanceMetric[] = []

  constructor() {
    this.initializeWebVitals()
  }

  private initializeWebVitals() {
    // Monitor Core Web Vitals
    onLCP(this.handleWebVital.bind(this, 'LCP'))
    onINP(this.handleWebVital.bind(this, 'INP'))
    onCLS(this.handleWebVital.bind(this, 'CLS'))
    onFCP(this.handleWebVital.bind(this, 'FCP'))
    onTTFB(this.handleWebVital.bind(this, 'TTFB'))
  }

  private handleWebVital(name: string, metric: any) {
    const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS]
    const rating = this.getRating(metric.value, threshold)
    
    const performanceMetric: PerformanceMetric = {
      name,
      value: metric.value,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
    }

    this.metrics.push(performanceMetric)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vital ${name}:`, {
        value: Math.round(metric.value),
        rating,
        threshold: threshold.good
      })
    }
  }

  private getRating(
    value: number, 
    threshold: { good: number; needsImprovement: number }
  ): 'good' | 'needs-improvement' | 'poor' {
    if (value <= threshold.good) return 'good'
    if (value <= threshold.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  // Public methods
  public getMetrics(): PerformanceMetric[] {
    return this.metrics
  }

  public getPerformanceScore(): number {
    if (this.metrics.length === 0) return 0

    const scores = this.metrics.map(metric => {
      switch (metric.rating) {
        case 'good': return 100
        case 'needs-improvement': return 50
        case 'poor': return 0
        default: return 0
      }
    })

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  public exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2)
  }

  public clearMetrics(): void {
    this.metrics = []
  }
}

// Singleton instance
let webVitalsMonitor: WebVitalsMonitor | null = null

export const initializePerformanceMonitoring = (): WebVitalsMonitor => {
  if (!webVitalsMonitor && typeof window !== 'undefined') {
    webVitalsMonitor = new WebVitalsMonitor()
  }
  return webVitalsMonitor!
}

export const getPerformanceMonitor = (): WebVitalsMonitor | null => {
  return webVitalsMonitor
}

export { WebVitalsMonitor }
