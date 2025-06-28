"use client";

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface GalleryAnalytics {
  galleryId: string;
  action: 'view' | 'interaction' | 'error' | 'performance';
  data?: Record<string, any>;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = false;
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isEnabled = process.env.NODE_ENV === 'production';
      this.startBatchFlush();
    }
  }

  private startBatchFlush() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.events.push(enrichedEvent);

    // Flush if batch is full
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  trackGallery(analytics: GalleryAnalytics) {
    this.track({
      name: 'gallery_event',
      properties: {
        gallery_id: analytics.galleryId,
        action: analytics.action,
        ...analytics.data
      }
    });
  }

  trackPerformance(metrics: {
    loadTime: number;
    renderTime: number;
    animationFrameRate: number;
    memoryUsage?: number;
  }) {
    this.track({
      name: 'performance_metrics',
      properties: metrics
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...context
      }
    });
  }

  private async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // In a real app, you'd send to your analytics service
      // For now, we'll just log in development
      if (process.env.NODE_ENV === 'development') {
        console.group('Analytics Events');
        eventsToSend.forEach(event => {
          console.log(event);
        });
        console.groupEnd();
      }

      // Example: Send to analytics service
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events: eventsToSend })
      // });
    } catch (error) {
      console.warn('Failed to send analytics:', error);
      // Re-add events to queue for retry
      this.events.unshift(...eventsToSend);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(); // Final flush
  }
}

// Singleton instance
export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackGallery: analytics.trackGallery.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics)
  };
}