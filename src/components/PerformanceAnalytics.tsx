/**
 * Performance Analytics Dashboard
 * Phase 3.3 Chunk 1: Performance metrics visualization component
 */

'use client'

import { useState, useEffect } from 'react'
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring'
import { PerformanceMetric } from '../utils/webVitalsMonitoring'

interface PerformanceAnalyticsProps {
    className?: string
    showDetails?: boolean
}

interface MetricCardProps {
    metric: PerformanceMetric
    threshold: { good: number; needsImprovement: number }
}

const MetricCard = ({ metric, threshold }: MetricCardProps) => {
    const getStatusColor = (rating: string) => {
        switch (rating) {
            case 'good': return 'text-green-600 bg-green-50'
            case 'needs-improvement': return 'text-yellow-600 bg-yellow-50'
            case 'poor': return 'text-red-600 bg-red-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getStatusIcon = (rating: string) => {
        switch (rating) {
            case 'good': return '✅'
            case 'needs-improvement': return '⚠️'
            case 'poor': return '❌'
            default: return '⚪'
        }
    }

    const formatValue = (name: string, value: number) => {
        switch (name) {
            case 'CLS':
                return value.toFixed(3)
            case 'LCP':
            case 'INP':
            case 'FCP':
            case 'TTFB':
                return `${Math.round(value)}ms`
            default:
                return Math.round(value).toString()
        }
    }

    return (
        <div className={`p-4 rounded-lg border ${getStatusColor(metric.rating)}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{metric.name}</h3>
                <span className="text-lg">{getStatusIcon(metric.rating)}</span>
            </div>
            <div className="text-2xl font-bold mb-1">
                {formatValue(metric.name, metric.value)}
            </div>
            <div className="text-xs opacity-75">
                Target: {formatValue(metric.name, threshold.good)} (Good)
            </div>
            <div className="text-xs opacity-60 mt-1">
                {new Date(metric.timestamp).toLocaleTimeString()}
            </div>
        </div>
    )
}

const PerformanceScore = ({ score }: { score: number }) => {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600'
        if (score >= 70) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreBackground = (score: number) => {
        if (score >= 90) return 'bg-green-100'
        if (score >= 70) return 'bg-yellow-100'
        return 'bg-red-100'
    }

    return (
        <div className={`p-6 rounded-lg border ${getScoreBackground(score)}`}>
            <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">
                    Overall Performance Score
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                    {score}
                </div>
                <div className="text-sm text-gray-500 mt-1">out of 100</div>
            </div>
        </div>
    )
}

const RecentMetrics = ({ metrics }: { metrics: PerformanceMetric[] }) => {
    const recentMetrics = metrics.slice(-5).reverse() // Last 5 metrics, newest first

    if (recentMetrics.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                <div className="text-sm">No performance data available yet</div>
                <div className="text-xs mt-1">Metrics will appear as you interact with the page</div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Recent Metrics</h3>
            {recentMetrics.map((metric, index) => (
                <div key={`${metric.name}-${metric.timestamp}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span className="font-medium">{metric.name}</span>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                            metric.rating === 'good' ? 'bg-green-100 text-green-700' :
                            metric.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {metric.rating}
                        </span>
                        <span className="text-gray-600">
                            {metric.name === 'CLS' ? metric.value.toFixed(3) : `${Math.round(metric.value)}ms`}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export const PerformanceAnalytics = ({ 
    className = '', 
    showDetails = false 
}: PerformanceAnalyticsProps) => {
    const { performanceScore, metrics } = usePerformanceMonitoring()
    const [isExpanded, setIsExpanded] = useState(showDetails)

    // Core Web Vitals thresholds
    const thresholds = {
        LCP: { good: 2500, needsImprovement: 4000 },
        INP: { good: 200, needsImprovement: 500 },
        CLS: { good: 0.1, needsImprovement: 0.25 },
        FCP: { good: 1800, needsImprovement: 3000 },
        TTFB: { good: 800, needsImprovement: 1800 },
    }

    // Get latest metric for each type
    const latestMetrics = Object.keys(thresholds).map(metricName => {
        const metricsOfType = metrics.filter(m => m.name === metricName)
        return metricsOfType[metricsOfType.length - 1] // Get latest
    }).filter(Boolean)

    if (process.env.NODE_ENV === 'development') {
        return (
            <div className={`performance-analytics bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Performance Analytics</h2>
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-white hover:text-blue-100 transition-colors"
                        >
                            {isExpanded ? '⬆️ Collapse' : '⬇️ Expand'}
                        </button>
                    </div>
                </div>

                {/* Performance Score */}
                <div className="p-4">
                    <PerformanceScore score={performanceScore} />
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <>
                        {/* Core Web Vitals Grid */}
                        {latestMetrics.length > 0 && (
                            <div className="p-4 border-t">
                                <h3 className="font-semibold text-sm text-gray-700 mb-3">Core Web Vitals</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {latestMetrics.map((metric) => (
                                        <MetricCard 
                                            key={metric.name}
                                            metric={metric}
                                            threshold={thresholds[metric.name as keyof typeof thresholds]}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Metrics */}
                        <div className="p-4 border-t">
                            <RecentMetrics metrics={metrics} />
                        </div>

                        {/* Development Info */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="text-xs text-gray-600">
                                <div>📊 Monitoring: {metrics.length} metrics collected</div>
                                <div>🔄 Updates: Real-time</div>
                                <div>💡 This dashboard is only visible in development mode</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    }

    // In production, return minimal or null component
    return null
}

export default PerformanceAnalytics
