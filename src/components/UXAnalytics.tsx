/**
 * User Experience Analytics Component
 * Phase 3.3 Chunk 3: User experience impact analysis and insights
 */

'use client'

import { useState, useEffect } from 'react'
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring'
import { useNetworkAware } from '../hooks/useNetworkAware'

interface UserSession {
    sessionId: string
    startTime: number
    interactions: number
    bounceRisk: 'low' | 'medium' | 'high'
    deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown'
    connectionType: string
    performanceImpact: 'positive' | 'neutral' | 'negative'
}

interface UXMetric {
    name: string
    value: number
    impact: 'positive' | 'neutral' | 'negative'
    description: string
    userFeedback?: string
}

interface UXAnalyticsProps {
    className?: string
}

const UXImpactCard = ({ metric }: { metric: UXMetric }) => {
    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'positive': return 'text-green-600 bg-green-50 border-green-200'
            case 'negative': return 'text-red-600 bg-red-50 border-red-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const getImpactIcon = (impact: string) => {
        switch (impact) {
            case 'positive': return '😊'
            case 'negative': return '😞'
            default: return '😐'
        }
    }

    return (
        <div className={`p-3 rounded-lg border ${getImpactColor(metric.impact)}`}>
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{metric.name}</h4>
                <span className="text-lg">{getImpactIcon(metric.impact)}</span>
            </div>
            <div className="text-lg font-bold mb-1">
                {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
            </div>
            <div className="text-xs opacity-75 mb-2">
                {metric.description}
            </div>
            {metric.userFeedback && (
                <div className="text-xs italic opacity-60">
                    "{metric.userFeedback}"
                </div>
            )}
        </div>
    )
}

const SessionOverview = ({ session }: { session: UserSession }) => {
    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'text-green-600 bg-green-100'
            case 'high': return 'text-red-600 bg-red-100'
            default: return 'text-yellow-600 bg-yellow-100'
        }
    }

    const getPerformanceColor = (impact: string) => {
        switch (impact) {
            case 'positive': return 'text-green-600'
            case 'negative': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    const sessionDuration = Math.round((Date.now() - session.startTime) / 1000)

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Current Session</h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <div className="text-gray-600">Duration</div>
                    <div className="font-mono text-lg">
                        {Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s
                    </div>
                </div>
                <div>
                    <div className="text-gray-600">Interactions</div>
                    <div className="font-mono text-lg">{session.interactions}</div>
                </div>
                <div>
                    <div className="text-gray-600">Device</div>
                    <div className="capitalize">{session.deviceType}</div>
                </div>
                <div>
                    <div className="text-gray-600">Connection</div>
                    <div className="uppercase text-xs">{session.connectionType}</div>
                </div>
            </div>

            <div className="flex gap-2 mt-3">
                <span className={`px-2 py-1 rounded text-xs ${getRiskColor(session.bounceRisk)}`}>
                    Bounce Risk: {session.bounceRisk}
                </span>
                <span className={`px-2 py-1 rounded text-xs bg-gray-100 ${getPerformanceColor(session.performanceImpact)}`}>
                    Performance: {session.performanceImpact}
                </span>
            </div>
        </div>
    )
}

const UserJourneySteps = () => {
    const steps = [
        { name: 'Page Load', status: 'completed', time: '1.2s', impact: 'positive' },
        { name: 'First Paint', status: 'completed', time: '0.8s', impact: 'positive' },
        { name: 'Interactive', status: 'completed', time: '2.1s', impact: 'neutral' },
        { name: 'Gallery Load', status: 'in-progress', time: '3.2s', impact: 'neutral' },
        { name: 'Full Experience', status: 'pending', time: '—', impact: 'unknown' },
    ]

    const getStepColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800'
            case 'in-progress': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

    const getImpactIcon = (impact: string) => {
        switch (impact) {
            case 'positive': return '✅'
            case 'neutral': return '⚪'
            case 'negative': return '❌'
            default: return '⏳'
        }
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">User Journey</h3>
            <div className="space-y-2">
                {steps.map((step, index) => (
                    <div key={step.name} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-200">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{step.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono">{step.time}</span>
                                    <span>{getImpactIcon(step.impact)}</span>
                                </div>
                            </div>
                            <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${getStepColor(step.status)}`}>
                                {step.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

interface UXRecommendation {
    priority: 'high' | 'medium' | 'low' | 'success'
    title: string
    description: string
    action: string
}

const UXRecommendations = ({ uxMetrics }: { uxMetrics: UXMetric[] }) => {
    const negativeMetrics = uxMetrics.filter(m => m.impact === 'negative')
    const recommendations: UXRecommendation[] = []

    if (negativeMetrics.length === 0) {
        recommendations.push({
            priority: 'success',
            title: 'Great User Experience!',
            description: 'All UX metrics are performing well',
            action: 'Continue monitoring for regressions'
        })
    } else {
        negativeMetrics.forEach(metric => {
            if (metric.name === 'Perceived Load Time') {
                recommendations.push({
                    priority: 'high',
                    title: 'Improve Load Perception',
                    description: 'Users perceive loading as slow',
                    action: 'Add loading skeletons and progress indicators'
                })
            }
            if (metric.name === 'Interaction Delay') {
                recommendations.push({
                    priority: 'medium',
                    title: 'Reduce Interaction Lag',
                    description: 'Users experiencing delayed interactions',
                    action: 'Optimize JavaScript execution and reduce main thread blocking'
                })
            }
        })
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">UX Recommendations</h3>
            {recommendations.map((rec, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'bg-red-50 border-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    rec.priority === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                }`}>
                    <div className="font-medium text-sm">{rec.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                    <div className="text-xs text-gray-500 mt-1 italic">{rec.action}</div>
                </div>
            ))}
        </div>
    )
}

export const UXAnalytics = ({ className = '' }: UXAnalyticsProps) => {
    const { performanceScore, metrics } = usePerformanceMonitoring()
    const { networkInfo, isSlowConnection } = useNetworkAware()
    const [session, setSession] = useState<UserSession>({
        sessionId: `session_${Date.now()}`,
        startTime: Date.now() - (Math.random() * 300000), // Random start time within last 5 minutes
        interactions: Math.floor(Math.random() * 20) + 1,
        bounceRisk: 'low',
        deviceType: 'desktop',
        connectionType: networkInfo?.effectiveType || 'unknown',
        performanceImpact: 'positive'
    })

    const [uxMetrics, setUxMetrics] = useState<UXMetric[]>([])

    useEffect(() => {
        // Generate UX metrics based on performance data
        const generatedMetrics: UXMetric[] = [
            {
                name: 'User Satisfaction',
                value: performanceScore >= 90 ? 9.2 : performanceScore >= 70 ? 7.5 : 5.8,
                impact: performanceScore >= 90 ? 'positive' : performanceScore >= 70 ? 'neutral' : 'negative',
                description: 'Overall user satisfaction score based on performance',
                userFeedback: performanceScore >= 90 ? 'Fast and smooth!' : 'Could be faster'
            },
            {
                name: 'Perceived Load Time',
                value: isSlowConnection ? 4.2 : 2.1,
                impact: isSlowConnection ? 'negative' : 'positive',
                description: 'How fast the page feels to users',
                userFeedback: isSlowConnection ? 'Feels slow to load' : 'Loads quickly'
            },
            {
                name: 'Interaction Delay',
                value: Math.random() * 300 + 50, // Random delay between 50-350ms
                impact: Math.random() > 0.7 ? 'negative' : 'positive',
                description: 'Average delay between user input and response'
            },
            {
                name: 'Content Visibility',
                value: 95,
                impact: 'positive',
                description: 'Percentage of content visible without scrolling'
            },
            {
                name: 'Error Rate',
                value: Math.random() * 2, // 0-2% error rate
                impact: Math.random() > 0.8 ? 'negative' : 'positive',
                description: 'Percentage of failed interactions or resources'
            }
        ]

        setUxMetrics(generatedMetrics)

        // Update session data
        setSession(prev => ({
            ...prev,
            bounceRisk: performanceScore < 70 ? 'high' : performanceScore < 85 ? 'medium' : 'low',
            performanceImpact: performanceScore >= 90 ? 'positive' : performanceScore >= 70 ? 'neutral' : 'negative',
            connectionType: networkInfo?.effectiveType || 'unknown'
        }))

    }, [performanceScore, isSlowConnection, networkInfo])

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className={`ux-analytics bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    👥 UX Analytics
                </h2>
                <div className="text-sm opacity-90 mt-1">
                    User experience impact analysis
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Session Overview */}
                <SessionOverview session={session} />

                {/* UX Metrics Grid */}
                <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Experience Metrics</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {uxMetrics.slice(0, 3).map((metric) => (
                            <UXImpactCard key={metric.name} metric={metric} />
                        ))}
                    </div>
                </div>

                {/* User Journey */}
                <UserJourneySteps />

                {/* UX Recommendations */}
                <UXRecommendations uxMetrics={uxMetrics} />

                {/* Development Info */}
                <div className="text-xs text-gray-500 text-center pt-2 border-t">
                    📊 Simulated UX data • Real user analytics integration coming soon
                </div>
            </div>
        </div>
    )
}

export default UXAnalytics
