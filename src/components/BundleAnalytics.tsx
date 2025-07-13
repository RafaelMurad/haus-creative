/**
 * Bundle Analytics Component
 * Phase 3.3 Chunk 2: Bundle size tracking and optimization insights
 */

'use client'

import { useState, useEffect } from 'react'

interface BundleData {
    name: string
    size: number
    parsed: number
    gzipped: number
    chunks: string[]
    modules: number
    percentage: number
}

interface BundleAnalyticsProps {
    className?: string
}

const BundleCard = ({ bundle }: { bundle: BundleData }) => {
    const getSizeColor = (percentage: number) => {
        if (percentage < 60) return 'text-green-600 bg-green-50'
        if (percentage < 80) return 'text-yellow-600 bg-yellow-50'
        return 'text-red-600 bg-red-50'
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return (
        <div className={`p-4 rounded-lg border ${getSizeColor(bundle.percentage)}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm truncate">{bundle.name}</h3>
                <span className="text-xs bg-white px-2 py-1 rounded">
                    {bundle.percentage.toFixed(1)}%
                </span>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Parsed:</span>
                    <span className="font-mono">{formatBytes(bundle.parsed)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Gzipped:</span>
                    <span className="font-mono">{formatBytes(bundle.gzipped)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Modules:</span>
                    <span className="font-mono">{bundle.modules}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full ${
                            bundle.percentage < 60 ? 'bg-green-500' :
                            bundle.percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(bundle.percentage, 100)}%` }}
                    ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Bundle size utilization
                </div>
            </div>
        </div>
    )
}

const BundleSummary = ({ bundles }: { bundles: BundleData[] }) => {
    const totalSize = bundles.reduce((sum, bundle) => sum + bundle.parsed, 0)
    const totalGzipped = bundles.reduce((sum, bundle) => sum + bundle.gzipped, 0)
    const totalModules = bundles.reduce((sum, bundle) => sum + bundle.modules, 0)

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    // Performance budget thresholds
    const budgets = {
        firstLoad: 128 * 1024, // 128KB
        totalJS: 244 * 1024,   // 244KB
        vendor: 300 * 1024,    // 300KB
    }

    const getBudgetStatus = (current: number, budget: number) => {
        const percentage = (current / budget) * 100
        if (percentage < 70) return { color: 'text-green-600', status: 'Good' }
        if (percentage < 90) return { color: 'text-yellow-600', status: 'Warning' }
        return { color: 'text-red-600', status: 'Over Budget' }
    }

    const firstLoadBudget = getBudgetStatus(totalGzipped, budgets.firstLoad)

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Bundle Summary</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                        {formatBytes(totalSize)}
                    </div>
                    <div className="text-sm text-gray-600">Total Parsed</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                        {formatBytes(totalGzipped)}
                    </div>
                    <div className="text-sm text-gray-600">Total Gzipped</div>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>First Load Budget:</span>
                    <span className={firstLoadBudget.color}>
                        {formatBytes(totalGzipped)} / {formatBytes(budgets.firstLoad)}
                        <span className="ml-1 text-xs">({firstLoadBudget.status})</span>
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Total Modules:</span>
                    <span className="font-mono">{totalModules}</span>
                </div>
                <div className="flex justify-between">
                    <span>Bundle Count:</span>
                    <span className="font-mono">{bundles.length}</span>
                </div>
            </div>
        </div>
    )
}

interface OptimizationTip {
    type: 'error' | 'warning' | 'info' | 'success'
    title: string
    description: string
    action: string
}

const BundleOptimizationTips = ({ bundles }: { bundles: BundleData[] }) => {
    const largeBundles = bundles.filter(b => b.percentage > 80)
    const tips: OptimizationTip[] = []

    if (largeBundles.length > 0) {
        tips.push({
            type: 'warning',
            title: 'Large Bundles Detected',
            description: `${largeBundles.length} bundle(s) are over 80% of recommended size`,
            action: 'Consider code splitting or lazy loading'
        })
    }

    if (bundles.some(b => b.name.includes('vendor') && b.parsed > 300 * 1024)) {
        tips.push({
            type: 'error',
            title: 'Vendor Bundle Too Large',
            description: 'Vendor bundle exceeds 300KB recommendation',
            action: 'Review dependencies and implement tree shaking'
        })
    }

    if (bundles.some(b => b.name.includes('gsap'))) {
        tips.push({
            type: 'info',
            title: 'GSAP Bundle Detected',
            description: 'GSAP is being loaded',
            action: 'Ensure dynamic loading is working correctly'
        })
    }

    if (tips.length === 0) {
        tips.push({
            type: 'success',
            title: 'Bundle Optimization Good',
            description: 'All bundles are within recommended sizes',
            action: 'Continue monitoring for regressions'
        })
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Optimization Insights</h3>
            {tips.map((tip, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    tip.type === 'error' ? 'bg-red-50 border-red-400' :
                    tip.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    tip.type === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                }`}>
                    <div className="font-medium text-sm">{tip.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{tip.description}</div>
                    <div className="text-xs text-gray-500 mt-1 italic">{tip.action}</div>
                </div>
            ))}
        </div>
    )
}

export const BundleAnalytics = ({ className = '' }: BundleAnalyticsProps) => {
    const [bundleData, setBundleData] = useState<BundleData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Simulate bundle analysis data
        // In a real implementation, this would fetch from webpack-bundle-analyzer output
        const mockBundleData: BundleData[] = [
            {
                name: 'framework',
                size: 8192, // 8KB
                parsed: 8192,
                gzipped: 3072, // ~3KB gzipped
                chunks: ['framework'],
                modules: 12,
                percentage: 20 // 20% of 40KB budget
            },
            {
                name: 'main',
                size: 51200, // 50KB
                parsed: 51200,
                gzipped: 15360, // ~15KB gzipped
                chunks: ['main'],
                modules: 45,
                percentage: 62 // 62% of budget
            },
            {
                name: 'pages/index',
                size: 12288, // 12KB
                parsed: 12288,
                gzipped: 4096, // ~4KB gzipped
                chunks: ['pages/index'],
                modules: 8,
                percentage: 30
            },
            {
                name: 'commons',
                size: 25600, // 25KB
                parsed: 25600,
                gzipped: 8192, // ~8KB gzipped
                chunks: ['commons'],
                modules: 28,
                percentage: 35
            }
        ]

        // Simulate loading delay
        setTimeout(() => {
            setBundleData(mockBundleData)
            setLoading(false)
        }, 1000)

    }, [])

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className={`bundle-analytics bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    📦 Bundle Analytics
                    {loading && <span className="text-sm">Loading...</span>}
                </h2>
                <div className="text-sm opacity-90 mt-1">
                    Bundle size tracking and optimization insights
                </div>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                        <div className="text-sm text-gray-500 mt-2">Analyzing bundles...</div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">
                        <div className="text-sm">Error loading bundle data</div>
                        <div className="text-xs mt-1">{error}</div>
                    </div>
                ) : (
                    <>
                        {/* Bundle Summary */}
                        <BundleSummary bundles={bundleData} />

                        {/* Bundle Cards */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Individual Bundles</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {bundleData.map((bundle) => (
                                    <BundleCard key={bundle.name} bundle={bundle} />
                                ))}
                            </div>
                        </div>

                        {/* Optimization Tips */}
                        <BundleOptimizationTips bundles={bundleData} />

                        {/* Development Info */}
                        <div className="text-xs text-gray-500 text-center pt-2 border-t">
                            📊 Mock data shown in development • Real bundle analysis coming in production builds
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default BundleAnalytics
