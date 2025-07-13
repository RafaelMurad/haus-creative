/**
 * Network-aware Resource Loading
 * Phase 3.2 Chunk 1: Adaptive loading based on network conditions
 */

// Network connection types and their characteristics
export interface NetworkInfo {
    effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'
    downlink: number // Mbps
    rtt: number // Round trip time in ms
    saveData: boolean // User preference for reduced data usage
}

// Loading strategies based on network conditions
export enum LoadingStrategy {
    AGGRESSIVE = 'aggressive',    // Fast networks: preload everything
    MODERATE = 'moderate',        // Good networks: selective preloading
    CONSERVATIVE = 'conservative', // Slow networks: minimal loading
    MINIMAL = 'minimal'           // Very slow/save-data: only critical
}

// Resource priority levels
export enum ResourcePriority {
    CRITICAL = 'critical',   // Must load immediately
    HIGH = 'high',          // Load as soon as possible
    MEDIUM = 'medium',      // Load when bandwidth available
    LOW = 'low'             // Load only when requested
}

class NetworkAwareLoader {
    private networkInfo: NetworkInfo | null = null
    private strategy: LoadingStrategy = LoadingStrategy.MODERATE
    private observers: (() => void)[] = []

    constructor() {
        this.detectNetworkConditions()
        this.setupNetworkMonitoring()
    }

    private detectNetworkConditions(): void {
        if (typeof navigator !== 'undefined' && 'connection' in navigator) {
            const connection = (navigator as any).connection ||
                (navigator as any).mozConnection ||
                (navigator as any).webkitConnection

            if (connection) {
                this.networkInfo = {
                    effectiveType: connection.effectiveType || 'unknown',
                    downlink: connection.downlink || 1,
                    rtt: connection.rtt || 1000,
                    saveData: connection.saveData || false
                }

                this.updateLoadingStrategy()
            }
        }

        // Fallback: assume moderate network if no connection API
        if (!this.networkInfo) {
            this.networkInfo = {
                effectiveType: 'unknown',
                downlink: 1.5,
                rtt: 500,
                saveData: false
            }
        }
    }

    private updateLoadingStrategy(): void {
        if (!this.networkInfo) return

        const { effectiveType, downlink, saveData } = this.networkInfo

        // Determine strategy based on network conditions
        if (saveData) {
            this.strategy = LoadingStrategy.MINIMAL
        } else if (effectiveType === '4g' && downlink > 2) {
            this.strategy = LoadingStrategy.AGGRESSIVE
        } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 1)) {
            this.strategy = LoadingStrategy.MODERATE
        } else if (effectiveType === '3g' || effectiveType === '2g') {
            this.strategy = LoadingStrategy.CONSERVATIVE
        } else {
            this.strategy = LoadingStrategy.MINIMAL
        }

        // Notify observers of strategy change
        this.notifyObservers()

        if (process.env.NODE_ENV === 'development') {
            console.log('🌐 Network-aware loading strategy:', {
                effectiveType,
                downlink: `${downlink} Mbps`,
                strategy: this.strategy,
                saveData
            })
        }
    }

    private setupNetworkMonitoring(): void {
        if (typeof navigator !== 'undefined' && 'connection' in navigator) {
            const connection = (navigator as any).connection

            if (connection) {
                // Monitor network changes
                connection.addEventListener('change', () => {
                    this.detectNetworkConditions()
                })
            }
        }
    }

    private notifyObservers(): void {
        this.observers.forEach(callback => callback())
    }

    // Public methods
    public getNetworkInfo(): NetworkInfo | null {
        return this.networkInfo
    }

    public getLoadingStrategy(): LoadingStrategy {
        return this.strategy
    }

    public shouldLoadResource(priority: ResourcePriority): boolean {
        switch (this.strategy) {
            case LoadingStrategy.AGGRESSIVE:
                return true // Load everything

            case LoadingStrategy.MODERATE:
                return priority !== ResourcePriority.LOW

            case LoadingStrategy.CONSERVATIVE:
                return priority === ResourcePriority.CRITICAL || priority === ResourcePriority.HIGH

            case LoadingStrategy.MINIMAL:
                return priority === ResourcePriority.CRITICAL

            default:
                return priority === ResourcePriority.CRITICAL
        }
    }

    public getOptimalImageQuality(): 'high' | 'medium' | 'low' {
        switch (this.strategy) {
            case LoadingStrategy.AGGRESSIVE:
                return 'high'
            case LoadingStrategy.MODERATE:
                return 'medium'
            case LoadingStrategy.CONSERVATIVE:
            case LoadingStrategy.MINIMAL:
                return 'low'
            default:
                return 'medium'
        }
    }

    public getOptimalBundleStrategy(): 'preload' | 'lazy' | 'minimal' {
        switch (this.strategy) {
            case LoadingStrategy.AGGRESSIVE:
                return 'preload'
            case LoadingStrategy.MODERATE:
                return 'lazy'
            case LoadingStrategy.CONSERVATIVE:
            case LoadingStrategy.MINIMAL:
                return 'minimal'
            default:
                return 'lazy'
        }
    }

    public onStrategyChange(callback: () => void): () => void {
        this.observers.push(callback)

        // Return unsubscribe function
        return () => {
            const index = this.observers.indexOf(callback)
            if (index > -1) {
                this.observers.splice(index, 1)
            }
        }
    }
}

// Singleton instance
let networkAwareLoader: NetworkAwareLoader | null = null

export const getNetworkAwareLoader = (): NetworkAwareLoader => {
    if (!networkAwareLoader && typeof window !== 'undefined') {
        networkAwareLoader = new NetworkAwareLoader()
    }
    return networkAwareLoader!
}

export { NetworkAwareLoader }
