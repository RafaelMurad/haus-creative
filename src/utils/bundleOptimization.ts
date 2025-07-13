/**
 * Dependency Optimization Utility
 * Analyzes and optimizes import statements for better tree shaking
 */

// Tree-shakeable GSAP imports
export const loadGSAPCore = async () => {
    const { gsap } = await import('gsap/dist/gsap')
    return gsap
}

export const loadGSAPScrollTrigger = async () => {
    const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger')
    return ScrollTrigger
}

export const loadGSAPTextPlugin = async () => {
    const { TextPlugin } = await import('gsap/dist/TextPlugin')
    return TextPlugin
}

export const loadGSAPMorphSVGPlugin = async () => {
    const { MorphSVGPlugin } = await import('gsap/dist/MorphSVGPlugin')
    return MorphSVGPlugin
}

// Utility function to dynamically load GSAP with only needed plugins
export const loadGSAPWithPlugins = async (plugins: string[] = []) => {
    const gsap = await loadGSAPCore()

    const pluginLoaders: { [key: string]: () => Promise<any> } = {
        ScrollTrigger: loadGSAPScrollTrigger,
        TextPlugin: loadGSAPTextPlugin,
        MorphSVGPlugin: loadGSAPMorphSVGPlugin,
    }

    for (const plugin of plugins) {
        if (pluginLoaders[plugin]) {
            const loadedPlugin = await pluginLoaders[plugin]()
            gsap.registerPlugin(loadedPlugin)
        }
    }

    return gsap
}

// Optimized React imports
export const loadReactLazy = async () => {
    const { lazy } = await import('react')
    return lazy
}

export const loadReactSuspense = async () => {
    const { Suspense } = await import('react')
    return Suspense
}

// Next.js dynamic imports optimization
export const createOptimizedDynamic = () => {
    return import('next/dynamic').then(({ default: dynamic }) => dynamic)
}

// Bundle size constants for monitoring
export const BUNDLE_SIZE_LIMITS = {
    // First Load JS shared by all pages
    FIRST_LOAD_JS_MAX: 128, // KB

    // Individual page bundles
    PAGE_BUNDLE_MAX: 244, // KB

    // Vendor chunks
    VENDOR_CHUNK_MAX: 300, // KB

    // GSAP chunk (since it's large)
    GSAP_CHUNK_MAX: 150, // KB

    // CSS bundles
    CSS_BUNDLE_MAX: 50, // KB
}

// Performance monitoring
export const logBundleMetrics = (metrics: {
    bundleName: string
    size: number
    limit: number
}) => {
    const { bundleName, size, limit } = metrics
    const percentage = (size / limit) * 100

    if (process.env.NODE_ENV === 'development') {
        const status = size > limit ? '🔴' : size > limit * 0.8 ? '🟡' : '🟢'
        console.log(
            `[Bundle] ${status} ${bundleName}: ${size}KB / ${limit}KB (${percentage.toFixed(1)}%)`
        )
    }
}

// Webpack bundle analysis helpers
export const analyzeBundleChunk = (chunkName: string, chunkSize: number) => {
    const limits = BUNDLE_SIZE_LIMITS
    let limit = limits.PAGE_BUNDLE_MAX

    if (chunkName.includes('vendor')) {
        limit = limits.VENDOR_CHUNK_MAX
    } else if (chunkName.includes('gsap')) {
        limit = limits.GSAP_CHUNK_MAX
    } else if (chunkName.includes('framework')) {
        limit = limits.FIRST_LOAD_JS_MAX
    }

    logBundleMetrics({
        bundleName: chunkName,
        size: Math.round(chunkSize / 1024), // Convert to KB
        limit
    })
}

// Tree shaking verification
export const verifyTreeShaking = () => {
    if (process.env.NODE_ENV === 'production') {
        // These should be removed in production builds
        const testImports = {
            unusedFunction: () => console.log('This should be tree-shaken'),
            unusedConstant: 'UNUSED_VALUE',
            unusedClass: class UnusedClass { }
        }

        // This code should be eliminated by tree shaking
        return testImports
    }
}

// Critical resource identification
export const CRITICAL_RESOURCES = {
    // Must load immediately
    critical: [
        'framework', // React/Next.js core
        'main', // Main application bundle
        'commons', // Shared utilities
    ],

    // Can be loaded on interaction
    interactive: [
        'gsap', // Animation library
        'gallery-row', // Gallery components
        'media-item', // Media components
    ],

    // Can be loaded on viewport entry
    lazy: [
        'admin', // Admin components
        'analytics', // Analytics scripts
        'optional-features', // Optional functionality
    ]
}

// Resource prioritization helper
export const prioritizeResource = (resourceName: string): 'critical' | 'interactive' | 'lazy' => {
    const { critical, interactive, lazy } = CRITICAL_RESOURCES

    if (critical.some(name => resourceName.includes(name))) {
        return 'critical'
    }

    if (interactive.some(name => resourceName.includes(name))) {
        return 'interactive'
    }

    return 'lazy'
}

// Performance budget checker
export const checkPerformanceBudget = (metrics: {
    firstLoadJS: number
    totalPageWeight: number
    imageWeight: number
}) => {
    const budget = {
        firstLoadJS: 128, // KB
        totalPageWeight: 1600, // KB (1.6MB)
        imageWeight: 800, // KB
    }

    const results = {
        firstLoadJS: {
            current: metrics.firstLoadJS,
            budget: budget.firstLoadJS,
            passed: metrics.firstLoadJS <= budget.firstLoadJS
        },
        totalPageWeight: {
            current: metrics.totalPageWeight,
            budget: budget.totalPageWeight,
            passed: metrics.totalPageWeight <= budget.totalPageWeight
        },
        imageWeight: {
            current: metrics.imageWeight,
            budget: budget.imageWeight,
            passed: metrics.imageWeight <= budget.imageWeight
        }
    }

    if (process.env.NODE_ENV === 'development') {
        console.table(results)
    }

    return results
}
