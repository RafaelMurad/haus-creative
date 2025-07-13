/**
 * Device Capability Detection
 * Phase 3.2 Chunk 3: Hardware and browser capability assessment
 */

// Device performance categories
export enum DeviceClass {
    HIGH_END = 'high-end',     // Powerful devices (8GB+ RAM, modern CPU)
    MIDDLE = 'middle',         // Standard devices (4-8GB RAM, decent CPU) 
    LOW_END = 'low-end',       // Budget devices (2-4GB RAM, older CPU)
    UNKNOWN = 'unknown'        // Cannot determine capabilities
}

// Browser capability levels
export interface BrowserCapabilities {
    supportsWebP: boolean
    supportsAVIF: boolean
    supportsIntersectionObserver: boolean
    supportsServiceWorker: boolean
    supportsWebGL: boolean
    supportsES6: boolean
    supportsModules: boolean
    hasHardwareConcurrency: boolean
    supportsTouchEvents: boolean
}

// Device specifications
export interface DeviceSpecs {
    deviceClass: DeviceClass
    estimatedRAM: number // GB
    hardwareConcurrency: number // CPU cores
    devicePixelRatio: number
    screenWidth: number
    screenHeight: number
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    hasLimitedBandwidth: boolean
    browserCapabilities: BrowserCapabilities
}

class DeviceDetector {
    private deviceSpecs: DeviceSpecs | null = null

    constructor() {
        this.detectDeviceCapabilities()
    }

    private detectDeviceCapabilities(): void {
        if (typeof window === 'undefined') return

        // Detect browser capabilities
        const browserCapabilities = this.detectBrowserCapabilities()

        // Get device memory (if available)
        const estimatedRAM = this.estimateDeviceRAM()

        // Get hardware concurrency
        const hardwareConcurrency = navigator.hardwareConcurrency || 2

        // Detect device type
        const { isMobile, isTablet, isDesktop } = this.detectDeviceType()

        // Screen information
        const screenWidth = window.screen.width
        const screenHeight = window.screen.height
        const devicePixelRatio = window.devicePixelRatio || 1

        // Determine device class based on available information
        const deviceClass = this.classifyDevice(estimatedRAM, hardwareConcurrency, isMobile)

        // Check for limited bandwidth scenarios
        const hasLimitedBandwidth = this.detectLimitedBandwidth()

        this.deviceSpecs = {
            deviceClass,
            estimatedRAM,
            hardwareConcurrency,
            devicePixelRatio,
            screenWidth,
            screenHeight,
            isMobile,
            isTablet,
            isDesktop,
            hasLimitedBandwidth,
            browserCapabilities
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('📱 Device capabilities detected:', this.deviceSpecs)
        }
    }

    private detectBrowserCapabilities(): BrowserCapabilities {
        const canvas = document.createElement('canvas')
        const webglContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

        return {
            supportsWebP: this.checkWebPSupport(),
            supportsAVIF: this.checkAVIFSupport(),
            supportsIntersectionObserver: 'IntersectionObserver' in window,
            supportsServiceWorker: 'serviceWorker' in navigator,
            supportsWebGL: !!webglContext,
            supportsES6: this.checkES6Support(),
            supportsModules: 'noModule' in HTMLScriptElement.prototype,
            hasHardwareConcurrency: 'hardwareConcurrency' in navigator,
            supportsTouchEvents: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        }
    }

    private checkWebPSupport(): boolean {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }

    private checkAVIFSupport(): boolean {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
    }

    private checkES6Support(): boolean {
        try {
            new Function('(a = 0) => a')
            return true
        } catch (err) {
            return false
        }
    }

    private estimateDeviceRAM(): number {
        // Use Device Memory API if available
        if ('deviceMemory' in navigator) {
            return (navigator as any).deviceMemory
        }

        // Fallback estimation based on other factors
        const hardwareConcurrency = navigator.hardwareConcurrency || 2
        const userAgent = navigator.userAgent.toLowerCase()

        // Mobile device estimation
        if (/mobile|android|iphone|ipad/.test(userAgent)) {
            if (hardwareConcurrency >= 8) return 8 // High-end mobile
            if (hardwareConcurrency >= 6) return 6 // Mid-high mobile
            if (hardwareConcurrency >= 4) return 4 // Mid mobile
            return 2 // Budget mobile
        }

        // Desktop estimation
        if (hardwareConcurrency >= 16) return 16 // High-end desktop
        if (hardwareConcurrency >= 8) return 8   // Mid-high desktop
        if (hardwareConcurrency >= 4) return 4   // Standard desktop
        return 2 // Budget desktop
    }

    private detectDeviceType(): { isMobile: boolean; isTablet: boolean; isDesktop: boolean } {
        const userAgent = navigator.userAgent.toLowerCase()
        const screenWidth = window.screen.width

        const isMobile = /mobile|android|iphone/.test(userAgent) && screenWidth < 768
        const isTablet = /tablet|ipad/.test(userAgent) || (screenWidth >= 768 && screenWidth < 1024)
        const isDesktop = !isMobile && !isTablet

        return { isMobile, isTablet, isDesktop }
    }

    private classifyDevice(ram: number, cores: number, isMobile: boolean): DeviceClass {
        if (isMobile) {
            // Mobile device classification
            if (ram >= 6 && cores >= 8) return DeviceClass.HIGH_END
            if (ram >= 4 && cores >= 6) return DeviceClass.MIDDLE
            if (ram >= 2 && cores >= 4) return DeviceClass.LOW_END
            return DeviceClass.LOW_END
        } else {
            // Desktop device classification
            if (ram >= 8 && cores >= 8) return DeviceClass.HIGH_END
            if (ram >= 4 && cores >= 4) return DeviceClass.MIDDLE
            if (ram >= 2 && cores >= 2) return DeviceClass.LOW_END
            return DeviceClass.UNKNOWN
        }
    }

    private detectLimitedBandwidth(): boolean {
        // Check for mobile device with potential data limitations
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobile = /mobile|android|iphone/.test(userAgent)

        // Check for save-data preference
        const connection = (navigator as any).connection
        const saveData = connection?.saveData || false

        return isMobile || saveData
    }

    // Public methods
    public getDeviceSpecs(): DeviceSpecs | null {
        return this.deviceSpecs
    }

    public getDeviceClass(): DeviceClass {
        return this.deviceSpecs?.deviceClass || DeviceClass.UNKNOWN
    }

    public canHandleHeavyAnimations(): boolean {
        const deviceClass = this.getDeviceClass()
        return deviceClass === DeviceClass.HIGH_END || deviceClass === DeviceClass.MIDDLE
    }

    public getRecommendedImageFormat(): 'avif' | 'webp' | 'jpeg' {
        if (!this.deviceSpecs) return 'jpeg'

        if (this.deviceSpecs.browserCapabilities.supportsAVIF) return 'avif'
        if (this.deviceSpecs.browserCapabilities.supportsWebP) return 'webp'
        return 'jpeg'
    }

    public getOptimalConcurrency(): number {
        const specs = this.deviceSpecs
        if (!specs) return 2

        // Conservative approach: use half of available cores
        return Math.max(1, Math.floor(specs.hardwareConcurrency / 2))
    }

    public shouldUseReducedMotion(): boolean {
        // Check user preference first
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return true
        }

        // Check device capability
        const deviceClass = this.getDeviceClass()
        return deviceClass === DeviceClass.LOW_END
    }
}

// Singleton instance
let deviceDetector: DeviceDetector | null = null

export const getDeviceDetector = (): DeviceDetector => {
    if (!deviceDetector && typeof window !== 'undefined') {
        deviceDetector = new DeviceDetector()
    }
    return deviceDetector!
}

export { DeviceDetector }
