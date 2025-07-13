/**
 * Memory Usage Optimization and Monitoring
 * Phase 3.2 Chunk 4: Memory management for optimal performance
 */

// Memory usage thresholds (in MB)
const MEMORY_THRESHOLDS = {
    LOW: 50,      // Under 50MB - healthy
    MODERATE: 100, // 50-100MB - monitor
    HIGH: 200,    // 100-200MB - optimize
    CRITICAL: 300 // Over 200MB - immediate action
}

export enum MemoryStatus {
    HEALTHY = 'healthy',
    MODERATE = 'moderate',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export interface MemoryMetrics {
    usedJSHeapSize: number      // Current JS heap usage (bytes)
    totalJSHeapSize: number     // Total allocated heap (bytes)
    jsHeapSizeLimit: number     // Maximum heap size (bytes)
    usedMB: number              // Used memory in MB
    totalMB: number             // Total allocated in MB
    limitMB: number             // Limit in MB
    utilizationPercent: number  // Percentage of heap used
    status: MemoryStatus
    timestamp: number
}

export interface MemoryOptimizationStrategy {
    shouldReduceImageQuality: boolean
    shouldLimitConcurrency: boolean
    shouldUnloadUnusedComponents: boolean
    shouldReduceAnimations: boolean
    maxConcurrentOperations: number
    recommendedImageQuality: 'low' | 'medium' | 'high'
}

class MemoryMonitor {
    private metrics: MemoryMetrics[] = []
    private observers: ((metrics: MemoryMetrics) => void)[] = []
    private monitoringInterval: NodeJS.Timeout | null = null
    private isMonitoring = false

    constructor() {
        this.startMonitoring()
    }

    private startMonitoring(): void {
        if (this.isMonitoring || typeof window === 'undefined') return

        // Check if performance.memory is available
        if (!('memory' in performance)) {
            console.warn('Performance.memory API not available - memory monitoring disabled')
            return
        }

        this.isMonitoring = true

        // Monitor memory every 10 seconds
        this.monitoringInterval = setInterval(() => {
            this.collectMemoryMetrics()
        }, 10000)

        // Collect initial metrics
        this.collectMemoryMetrics()
    }

    private collectMemoryMetrics(): void {
        if (!('memory' in performance)) return

        const memory = (performance as any).memory

        const usedJSHeapSize = memory.usedJSHeapSize
        const totalJSHeapSize = memory.totalJSHeapSize
        const jsHeapSizeLimit = memory.jsHeapSizeLimit

        const usedMB = Math.round(usedJSHeapSize / (1024 * 1024))
        const totalMB = Math.round(totalJSHeapSize / (1024 * 1024))
        const limitMB = Math.round(jsHeapSizeLimit / (1024 * 1024))

        const utilizationPercent = Math.round((usedJSHeapSize / jsHeapSizeLimit) * 100)
        const status = this.getMemoryStatus(usedMB)

        const metrics: MemoryMetrics = {
            usedJSHeapSize,
            totalJSHeapSize,
            jsHeapSizeLimit,
            usedMB,
            totalMB,
            limitMB,
            utilizationPercent,
            status,
            timestamp: Date.now()
        }

        this.metrics.push(metrics)

        // Keep only last 100 measurements
        if (this.metrics.length > 100) {
            this.metrics = this.metrics.slice(-100)
        }

        // Notify observers
        this.notifyObservers(metrics)

        // Log critical memory situations
        if (status === MemoryStatus.CRITICAL && process.env.NODE_ENV === 'development') {
            console.warn('🚨 Critical memory usage detected:', {
                used: `${usedMB}MB`,
                utilization: `${utilizationPercent}%`,
                limit: `${limitMB}MB`
            })
        }
    }

    private getMemoryStatus(usedMB: number): MemoryStatus {
        if (usedMB < MEMORY_THRESHOLDS.LOW) return MemoryStatus.HEALTHY
        if (usedMB < MEMORY_THRESHOLDS.MODERATE) return MemoryStatus.MODERATE
        if (usedMB < MEMORY_THRESHOLDS.HIGH) return MemoryStatus.HIGH
        return MemoryStatus.CRITICAL
    }

    private notifyObservers(metrics: MemoryMetrics): void {
        this.observers.forEach(callback => {
            try {
                callback(metrics)
            } catch (error) {
                console.error('Error in memory observer:', error)
            }
        })
    }

    // Public methods
    public getCurrentMetrics(): MemoryMetrics | null {
        return this.metrics[this.metrics.length - 1] || null
    }

    public getMetricsHistory(): MemoryMetrics[] {
        return [...this.metrics]
    }

    public getOptimizationStrategy(): MemoryOptimizationStrategy {
        const currentMetrics = this.getCurrentMetrics()

        if (!currentMetrics) {
            // Default safe strategy when no metrics available
            return {
                shouldReduceImageQuality: false,
                shouldLimitConcurrency: false,
                shouldUnloadUnusedComponents: false,
                shouldReduceAnimations: false,
                maxConcurrentOperations: 4,
                recommendedImageQuality: 'medium'
            }
        }

        const { status, utilizationPercent } = currentMetrics

        switch (status) {
            case MemoryStatus.HEALTHY:
                return {
                    shouldReduceImageQuality: false,
                    shouldLimitConcurrency: false,
                    shouldUnloadUnusedComponents: false,
                    shouldReduceAnimations: false,
                    maxConcurrentOperations: 6,
                    recommendedImageQuality: 'high'
                }

            case MemoryStatus.MODERATE:
                return {
                    shouldReduceImageQuality: false,
                    shouldLimitConcurrency: true,
                    shouldUnloadUnusedComponents: false,
                    shouldReduceAnimations: false,
                    maxConcurrentOperations: 4,
                    recommendedImageQuality: 'medium'
                }

            case MemoryStatus.HIGH:
                return {
                    shouldReduceImageQuality: true,
                    shouldLimitConcurrency: true,
                    shouldUnloadUnusedComponents: true,
                    shouldReduceAnimations: true,
                    maxConcurrentOperations: 2,
                    recommendedImageQuality: 'low'
                }

            case MemoryStatus.CRITICAL:
                return {
                    shouldReduceImageQuality: true,
                    shouldLimitConcurrency: true,
                    shouldUnloadUnusedComponents: true,
                    shouldReduceAnimations: true,
                    maxConcurrentOperations: 1,
                    recommendedImageQuality: 'low'
                }

            default:
                return {
                    shouldReduceImageQuality: false,
                    shouldLimitConcurrency: true,
                    shouldUnloadUnusedComponents: false,
                    shouldReduceAnimations: false,
                    maxConcurrentOperations: 3,
                    recommendedImageQuality: 'medium'
                }
        }
    }

    public onMemoryChange(callback: (metrics: MemoryMetrics) => void): () => void {
        this.observers.push(callback)

        // Return unsubscribe function
        return () => {
            const index = this.observers.indexOf(callback)
            if (index > -1) {
                this.observers.splice(index, 1)
            }
        }
    }

    public triggerGarbageCollection(): void {
        // Force garbage collection if available (Chrome DevTools)
        if ('gc' in window && typeof (window as any).gc === 'function') {
            (window as any).gc()
        }

        // Trigger collection through memory pressure
        try {
            // Create and release large objects to encourage GC
            const tempArrays: any[] = []
            for (let i = 0; i < 100; i++) {
                tempArrays.push(new Array(10000).fill(0))
            }
            tempArrays.length = 0 // Clear references
        } catch (error) {
            // Ignore errors during forced cleanup
        }
    }

    public destroy(): void {
        this.isMonitoring = false

        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval)
            this.monitoringInterval = null
        }

        this.observers = []
        this.metrics = []
    }
}

// Memory optimization utilities
export const MemoryUtils = {
    // Clear image caches
    clearImageCache(): void {
        // Remove cached images from DOM
        const images = document.querySelectorAll('img[data-cached="true"]')
        images.forEach(img => {
            if (img instanceof HTMLImageElement) {
                img.src = ''
                img.removeAttribute('data-cached')
            }
        })
    },

    // Cleanup unused event listeners
    cleanupEventListeners(): void {
        // This would be implemented based on your specific event tracking
        if (process.env.NODE_ENV === 'development') {
            console.log('🧹 Cleaning up unused event listeners')
        }
    },

    // Reduce animation complexity
    reduceAnimationComplexity(): void {
        // Disable expensive animations
        document.documentElement.style.setProperty('--animation-complexity', 'reduced')

        if (process.env.NODE_ENV === 'development') {
            console.log('🎭 Reduced animation complexity for memory optimization')
        }
    },

    // Get memory pressure recommendation
    getMemoryPressureRecommendation(): string {
        const monitor = getMemoryMonitor()
        const metrics = monitor.getCurrentMetrics()

        if (!metrics) return 'Monitor memory usage'

        switch (metrics.status) {
            case MemoryStatus.HEALTHY:
                return 'Memory usage is optimal'
            case MemoryStatus.MODERATE:
                return 'Consider reducing concurrent operations'
            case MemoryStatus.HIGH:
                return 'Reduce image quality and limit animations'
            case MemoryStatus.CRITICAL:
                return 'Immediate memory cleanup required'
            default:
                return 'Monitor memory usage'
        }
    }
}

// Singleton instance
let memoryMonitor: MemoryMonitor | null = null

export const getMemoryMonitor = (): MemoryMonitor => {
    if (!memoryMonitor && typeof window !== 'undefined') {
        memoryMonitor = new MemoryMonitor()
    }
    return memoryMonitor!
}

export { MemoryMonitor }
