/**
 * Combined Analytics Dashboard
 * Phase 3.3: Unified performance, bundle, and UX analytics
 */

'use client'

import { useState } from 'react'
import PerformanceAnalytics from './PerformanceAnalytics'
import BundleAnalytics from './BundleAnalytics'
import UXAnalytics from './UXAnalytics'
import OptimizationEngine from './OptimizationEngine'

interface AnalyticsDashboardProps {
    className?: string
}

type DashboardTab = 'performance' | 'bundle' | 'ux' | 'optimization' | 'overview'

export const AnalyticsDashboard = ({ className = '' }: AnalyticsDashboardProps) => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
    const [isMinimized, setIsMinimized] = useState(false)

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    const tabs = [
        { id: 'overview', label: '📊 Overview', color: 'bg-blue-500' },
        { id: 'performance', label: '⚡ Performance', color: 'bg-green-500' },
        { id: 'bundle', label: '📦 Bundle', color: 'bg-purple-500' },
        { id: 'ux', label: '👥 UX', color: 'bg-teal-500' },
        { id: 'optimization', label: '🚀 Optimize', color: 'bg-orange-500' },
    ]

    if (isMinimized) {
        return (
            <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                    📊 Analytics
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {process.env.NODE_ENV}
                    </span>
                </button>
            </div>
        )
    }

    return (
        <div className={`fixed bottom-4 right-4 w-96 max-h-[80vh] bg-white shadow-2xl rounded-lg overflow-hidden z-50 ${className}`}>
            {/* Header */}
            <div className="bg-gray-800 text-white p-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Analytics Dashboard</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                            DEV
                        </span>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="text-gray-300 hover:text-white"
                        >
                            ➖
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as DashboardTab)}
                        className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-white text-gray-800 border-b-2 border-blue-500'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="max-h-[60vh] overflow-y-auto">
                {activeTab === 'overview' && (
                    <div className="p-4 space-y-4">
                        <div className="text-center">
                            <h3 className="font-semibold text-gray-800 mb-2">Performance Overview</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                                Dashboard Active
                            </div>
                            <div className="text-sm text-gray-600">
                                Real-time analytics for development
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-green-50 p-3 rounded">
                                <div className="text-lg font-bold text-green-600">⚡</div>
                                <div className="text-xs text-gray-600">Performance</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded">
                                <div className="text-lg font-bold text-purple-600">📦</div>
                                <div className="text-xs text-gray-600">Bundle</div>
                            </div>
                            <div className="bg-teal-50 p-3 rounded">
                                <div className="text-lg font-bold text-teal-600">👥</div>
                                <div className="text-xs text-gray-600">UX</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-center">
                            <div className="text-sm text-gray-600 mb-2">
                                📊 Monitoring Features
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                                <div>✅ Core Web Vitals Tracking</div>
                                <div>✅ Bundle Size Analysis</div>
                                <div>✅ User Experience Metrics</div>
                                <div>✅ Real-time Performance Data</div>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 text-center border-t pt-3">
                            Phase 3.3: Performance Analytics Dashboard
                        </div>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="p-0">
                        <PerformanceAnalytics className="border-0 shadow-none" showDetails={true} />
                    </div>
                )}

                {activeTab === 'bundle' && (
                    <div className="p-0">
                        <BundleAnalytics className="border-0 shadow-none" />
                    </div>
                )}

                {activeTab === 'ux' && (
                    <div className="p-0">
                        <UXAnalytics className="border-0 shadow-none" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnalyticsDashboard
