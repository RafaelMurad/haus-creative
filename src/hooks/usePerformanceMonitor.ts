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
  const shouldMonitor = useRef<boolean>(Math.random() < sampleRate);
  const onMetricsRef = useRef(onMetrics);
  
  // Keep onMetrics ref updated without causing re-renders
  useEffect(() => {
    onMetricsRef.current = onMetrics;
  }, [onMetrics]);

  useEffect(() => {
    // Disable in development to avoid interfering with debugging
    if (!enabled || !shouldMonitor.current || typeof window === 'undefined' || process.env.NODE_ENV === 'development') return;

    const measurePerformance = () => {
      const now = Date.now();
      const loadTime = now - startTimeRef.current;

      // Get memory usage if available
      let memoryUsage: number | undefined;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }

      // Simple frame rate estimation based on performance.now() precision
      const fps = 60; // Default to 60fps, more sophisticated measurement can be added later

      const newMetrics: PerformanceMetrics = {
        loadTime,
        renderTime: loadTime,
        animationFrameRate: fps,
        memoryUsage
      };

      setMetrics(newMetrics);
      
      if (onMetricsRef.current) {
        onMetricsRef.current(newMetrics);
      }
    };

    // Measure performance less frequently to reduce overhead
    const interval = setInterval(measurePerformance, 10000); // Every 10 seconds

    // Measure on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        measurePerformance();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial measurement (delayed to allow page to load)
    setTimeout(measurePerformance, 5000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

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