/**
 * Optimization Recommendation Engine
 * Phase 3.3 Chunk 4: Intelligent optimization suggestions and actionable insights
 */

'use client'

import { useState, useEffect } from 'react'
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring'
import { useNetworkAware } from '../hooks/useNetworkAware'

interface OptimizationSuggestion {
    id: string
    priority: 'critical' | 'high' | 'medium' | 'low'
    category: 'performance' | 'bundle' | 'ux' | 'network' | 'memory'
    title: string
    description: string
    impact: string
    effort: 'low' | 'medium' | 'high'
    steps: string[]
    estimatedImprovement: string
    codeExample?: string
    learnMore?: string
}

interface OptimizationEngineProps {
    className?: string
}

const PriorityBadge = ({ priority }: { priority: string }) => {
    const getColors = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200'
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded border ${getColors(priority)}`}>
            {priority.toUpperCase()}
        </span>
    )
}

const EffortIndicator = ({ effort }: { effort: string }) => {
    const dots = effort === 'low' ? 1 : effort === 'medium' ? 2 : 3
    
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3].map(i => (
                <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                        i <= dots ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                />
            ))}
            <span className="text-xs text-gray-600 ml-1">
                {effort} effort
            </span>
        </div>
    )
}

const SuggestionCard = ({ suggestion }: { suggestion: OptimizationSuggestion }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'performance': return '⚡'
            case 'bundle': return '📦'
            case 'ux': return '👥'
            case 'network': return '🌐'
            case 'memory': return '🧠'
            default: return '🔧'
        }
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                        <h3 className="font-semibold text-sm">{suggestion.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <PriorityBadge priority={suggestion.priority} />
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                    {suggestion.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                    <EffortIndicator effort={suggestion.effort} />
                    <div className="text-xs text-green-600 font-medium">
                        {suggestion.estimatedImprovement}
                    </div>
                </div>

                <div className="text-sm text-blue-600 mb-3">
                    <strong>Impact:</strong> {suggestion.impact}
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                    {isExpanded ? '⬆️ Show Less' : '⬇️ Show Implementation'}
                </button>
            </div>

            {isExpanded && (
                <div className="border-t bg-gray-50 p-4">
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-medium text-sm mb-2">Implementation Steps:</h4>
                            <ol className="text-xs text-gray-600 space-y-1">
                                {suggestion.steps.map((step, index) => (
                                    <li key={index} className="flex gap-2">
                                        <span className="text-blue-500 font-medium">{index + 1}.</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {suggestion.codeExample && (
                            <div>
                                <h4 className="font-medium text-sm mb-2">Code Example:</h4>
                                <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs overflow-x-auto">
                                    {suggestion.codeExample}
                                </pre>
                            </div>
                        )}

                        {suggestion.learnMore && (
                            <div>
                                <a
                                    href={suggestion.learnMore}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                    📚 Learn more about this optimization
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const OptimizationSummary = ({ suggestions }: { suggestions: OptimizationSuggestion[] }) => {
    const priorityCounts = suggestions.reduce((acc, suggestion) => {
        acc[suggestion.priority] = (acc[suggestion.priority] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const totalImpact = suggestions.length * 15 // Estimated total improvement percentage

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Optimization Summary</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {suggestions.length}
                    </div>
                    <div className="text-sm text-gray-600">Suggestions</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        +{totalImpact}%
                    </div>
                    <div className="text-sm text-gray-600">Est. Improvement</div>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                {Object.entries(priorityCounts).map(([priority, count]) => (
                    <div key={priority} className="flex justify-between">
                        <span className="capitalize">{priority} Priority:</span>
                        <span className="font-mono">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const QuickWins = ({ suggestions }: { suggestions: OptimizationSuggestion[] }) => {
    const quickWins = suggestions.filter(s => s.effort === 'low' && s.priority !== 'low')

    if (quickWins.length === 0) {
        return (
            <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Great Job! 🎉</h3>
                <p className="text-sm text-green-700">
                    No quick wins available - your optimization is already excellent!
                </p>
            </div>
        )
    }

    return (
        <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-3">⚡ Quick Wins</h3>
            <div className="space-y-2">
                {quickWins.slice(0, 3).map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center justify-between">
                        <div className="text-sm">
                            <div className="font-medium">{suggestion.title}</div>
                            <div className="text-xs text-gray-600">{suggestion.estimatedImprovement}</div>
                        </div>
                        <PriorityBadge priority={suggestion.priority} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const OptimizationEngine = ({ className = '' }: OptimizationEngineProps) => {
    const { performanceScore, metrics } = usePerformanceMonitoring()
    const { isSlowConnection, networkInfo } = useNetworkAware()
    const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])

    useEffect(() => {
        // Generate optimization suggestions based on current performance data
        const generatedSuggestions: OptimizationSuggestion[] = []

        // Performance-based suggestions
        if (performanceScore < 90) {
            if (performanceScore < 70) {
                generatedSuggestions.push({
                    id: 'critical-performance',
                    priority: 'critical',
                    category: 'performance',
                    title: 'Improve Core Web Vitals',
                    description: 'Multiple Core Web Vitals metrics are below good thresholds',
                    impact: 'Major improvement in user experience and SEO rankings',
                    effort: 'high',
                    estimatedImprovement: '+25% performance score',
                    steps: [
                        'Analyze LCP elements and optimize images',
                        'Reduce JavaScript execution time for better INP',
                        'Minimize layout shifts during page load',
                        'Implement resource preloading for critical assets'
                    ],
                    codeExample: `// Preload critical resources
<link rel="preload" href="/critical-font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/hero-image.webp" as="image">`,
                    learnMore: 'https://web.dev/vitals/'
                })
            }

            generatedSuggestions.push({
                id: 'image-optimization',
                priority: 'high',
                category: 'performance',
                title: 'Optimize Image Loading',
                description: 'Images are not optimally loaded and may be impacting performance',
                impact: 'Faster page loads and better user experience',
                effort: 'medium',
                estimatedImprovement: '+15% page speed',
                steps: [
                    'Implement modern image formats (WebP, AVIF)',
                    'Add responsive image srcsets',
                    'Lazy load below-the-fold images',
                    'Optimize image compression'
                ],
                codeExample: `<img 
  src="image.webp" 
  srcSet="image-320.webp 320w, image-640.webp 640w"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  alt="Description"
/>`,
                learnMore: 'https://web.dev/optimize-lcp/'
            })
        }

        // Network-based suggestions
        if (isSlowConnection) {
            generatedSuggestions.push({
                id: 'slow-network-optimization',
                priority: 'high',
                category: 'network',
                title: 'Optimize for Slow Connections',
                description: 'User is on a slow connection - implement data-saving strategies',
                impact: 'Better experience for users on slow networks',
                effort: 'medium',
                estimatedImprovement: '+30% perceived speed',
                steps: [
                    'Enable aggressive image compression',
                    'Implement progressive loading',
                    'Reduce initial bundle size',
                    'Use service worker for caching'
                ],
                codeExample: `// Detect slow connection
if (navigator.connection?.effectiveType === '2g') {
  // Load low-quality images
  imageQuality = 'low'
}`
            })
        }

        // Bundle optimization suggestions
        generatedSuggestions.push({
            id: 'code-splitting',
            priority: 'medium',
            category: 'bundle',
            title: 'Implement Advanced Code Splitting',
            description: 'Further optimize bundle size with route-based code splitting',
            impact: 'Reduced initial bundle size and faster first load',
            effort: 'medium',
            estimatedImprovement: '+10% bundle reduction',
            steps: [
                'Implement route-based code splitting',
                'Split vendor libraries into separate chunks',
                'Use dynamic imports for heavy components',
                'Analyze and remove unused dependencies'
            ],
            codeExample: `// Dynamic import for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// Route-based splitting
const Routes = lazy(() => import('./Routes'))`
        })

        // Memory optimization
        generatedSuggestions.push({
            id: 'memory-optimization',
            priority: 'low',
            category: 'memory',
            title: 'Optimize Memory Usage',
            description: 'Implement memory management best practices',
            impact: 'Better performance on low-memory devices',
            effort: 'low',
            estimatedImprovement: '+5% on mobile devices',
            steps: [
                'Clean up event listeners on component unmount',
                'Implement virtual scrolling for long lists',
                'Use WeakMap/WeakSet for temporary references',
                'Monitor and limit concurrent operations'
            ],
            codeExample: `useEffect(() => {
  const handler = () => { /* ... */ }
  window.addEventListener('scroll', handler)
  
  return () => {
    window.removeEventListener('scroll', handler)
  }
}, [])`
        })

        // UX improvements
        generatedSuggestions.push({
            id: 'loading-states',
            priority: 'medium',
            category: 'ux',
            title: 'Improve Loading States',
            description: 'Add skeleton loaders and progress indicators',
            impact: 'Better perceived performance and user satisfaction',
            effort: 'low',
            estimatedImprovement: '+20% user satisfaction',
            steps: [
                'Add skeleton loaders for content',
                'Implement progress indicators',
                'Show loading states for async operations',
                'Use optimistic UI updates'
            ],
            codeExample: `const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  </div>
)`
        })

        setSuggestions(generatedSuggestions)
    }, [performanceScore, isSlowConnection, networkInfo])

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    const sortedSuggestions = suggestions.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    return (
        <div className={`optimization-engine bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    🚀 Optimization Engine
                </h2>
                <div className="text-sm opacity-90 mt-1">
                    Intelligent performance recommendations
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Optimization Summary */}
                <OptimizationSummary suggestions={suggestions} />

                {/* Quick Wins */}
                <QuickWins suggestions={suggestions} />

                {/* All Suggestions */}
                <div>
                    <h3 className="font-semibold text-gray-800 mb-3">All Recommendations</h3>
                    <div className="space-y-3">
                        {sortedSuggestions.map((suggestion) => (
                            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                        ))}
                    </div>
                </div>

                {/* Development Info */}
                <div className="text-xs text-gray-500 text-center pt-2 border-t">
                    🤖 AI-powered optimization suggestions • Updates based on real performance data
                </div>
            </div>
        </div>
    )
}

export default OptimizationEngine
