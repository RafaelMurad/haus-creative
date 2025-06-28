"use client";

import { useEffect, useRef, useState } from 'react';
import { PerformanceMetrics } from '../types';

interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  sampleRate?: number; // 0-1, percentage of sessions to monitor
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

export function usePerformanceMonitor({
  enabled = process.env.NODE_ENV === 'production',
  sampleRate = 0.1, // Monitor 10% of sessions by default
  onMetrics
}: UsePerformanceMonitorOptions = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(Date.now());
  const shouldMonitor = useRef<boolean>(Math.random() < sampleRate);

  useEffect(() => {
    if (!enabled || !shouldMonitor.current || typeof window === 'undefined') return;

    const measurePerformance = () => {
      const now = Date.now();
      const loadTime = now - startTimeRef.current;
      
      // Measure frame rate
      frameCountRef.current++;
      const timeSinceLastFrame = now - lastFrameTimeRef.current;
      const fps = timeSinceLastFrame > 0 ? 1000 / timeSinceLastFrame : 0;
      lastFrameTimeRef.current = now;

      // Get memory usage if available
      let memoryUsage: number | undefined;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }

      const newMetrics: PerformanceMetrics = {
        loadTime,
        renderTime: loadTime, // Simplified for now
        animationFrameRate: fps,
        memoryUsage
      };

      setMetrics(newMetrics);
      
      if (onMetrics) {
        onMetrics(newMetrics);
      }

      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development') {
        if (fps < 30) {
          console.warn(`Low frame rate detected: ${fps.toFixed(1)} FPS`);
        }
        if (memoryUsage && memoryUsage > 100) {
          console.warn(`High memory usage: ${memoryUsage.toFixed(1)} MB`);
        }
      }
    };

    // Measure performance periodically
    const interval = setInterval(measurePerformance, 1000);

    // Measure on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        measurePerformance();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial measurement
    measurePerformance();

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, onMetrics]);

  return metrics;
}

// Hook for monitoring Core Web Vitals
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    CLS?: number;
    FID?: number;
    FCP?: number;
    LCP?: number;
    TTFB?: number;
  }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => setVitals(prev => ({ ...prev, CLS: metric.value })));
      getFID((metric) => setVitals(prev => ({ ...prev, FID: metric.value })));
      getFCP((metric) => setVitals(prev => ({ ...prev, FCP: metric.value })));
      getLCP((metric) => setVitals(prev => ({ ...prev, LCP: metric.value })));
      getTTFB((metric) => setVitals(prev => ({ ...prev, TTFB: metric.value })));
    }).catch(() => {
      // web-vitals not available, continue without it
    });
  }, []);

  return vitals;
}