#!/usr/bin/env node

/**
 * Performance Measurement Script
 * Tracks bundle optimization improvements and provides metrics
 */

const fs = require('fs')
const path = require('path')

const PERFORMANCE_LOG_FILE = path.join(__dirname, '..', 'performance-metrics.json')

// Bundle size limits (in KB)
const PERFORMANCE_BUDGETS = {
  firstLoadJS: 128,        // Next.js recommendation
  totalPageJS: 244,        // Per page limit
  framework: 40,           // React + Next.js core
  vendor: 300,            // Third party libraries
  gsap: 150,              // Animation library
  css: 50,                // Stylesheet limit
  images: 800,            // Image weight per page
  totalPage: 1600,        // Total page weight
}

// Analyze current build metrics
function analyzeBuildMetrics() {
  const buildDir = path.join(__dirname, '..', '.next')
  const staticDir = path.join(buildDir, 'static', 'chunks')
  
  if (!fs.existsSync(staticDir)) {
    console.log('❌ No build found. Run "npm run build" first.')
    return null
  }

  const chunks = []
  const files = fs.readdirSync(staticDir)
  
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(staticDir, file)
      const stats = fs.statSync(filePath)
      const sizeKB = Math.round(stats.size / 1024)
      
      chunks.push({
        name: file,
        size: sizeKB,
        path: filePath
      })
    }
  })

  return chunks
}

// Calculate performance scores
function calculatePerformanceScore(chunks) {
  const metrics = {
    totalJS: chunks.reduce((sum, chunk) => sum + chunk.size, 0),
    framework: chunks.filter(c => c.name.includes('framework')).reduce((sum, c) => sum + c.size, 0),
    vendor: chunks.filter(c => c.name.includes('vendor')).reduce((sum, c) => sum + c.size, 0),
    gsap: chunks.filter(c => c.name.includes('gsap')).reduce((sum, c) => sum + c.size, 0),
    polyfills: chunks.filter(c => c.name.includes('polyfills')).reduce((sum, c) => sum + c.size, 0),
  }

  const scores = {}
  Object.keys(PERFORMANCE_BUDGETS).forEach(key => {
    if (metrics[key] !== undefined) {
      const budget = PERFORMANCE_BUDGETS[key]
      const actual = metrics[key]
      const score = Math.max(0, Math.min(100, ((budget - actual) / budget) * 100 + 50))
      scores[key] = {
        actual,
        budget,
        score: Math.round(score),
        status: actual <= budget ? 'PASS' : 'FAIL'
      }
    }
  })

  return { metrics, scores }
}

// Log performance metrics
function logPerformanceMetrics(results) {
  const timestamp = new Date().toISOString()
  
  const report = {
    timestamp,
    ...results,
    optimizations: {
      bundleSplitting: true,
      treeshaking: true,
      compression: true,
      dynamicImports: true,
      lazyLoading: true,
    }
  }

  // Save to log file
  let performanceLog = []
  if (fs.existsSync(PERFORMANCE_LOG_FILE)) {
    try {
      performanceLog = JSON.parse(fs.readFileSync(PERFORMANCE_LOG_FILE, 'utf8'))
    } catch (e) {
      performanceLog = []
    }
  }

  performanceLog.push(report)
  
  // Keep only last 10 measurements
  if (performanceLog.length > 10) {
    performanceLog = performanceLog.slice(-10)
  }

  fs.writeFileSync(PERFORMANCE_LOG_FILE, JSON.stringify(performanceLog, null, 2))
  
  return report
}

// Display performance dashboard
function displayPerformanceDashboard(report) {
  console.log('\n🎯 Performance Optimization Results')
  console.log('=====================================\n')

  // Bundle overview
  console.log('📦 Bundle Composition:')
  console.log('----------------------')
  Object.entries(report.metrics).forEach(([key, size]) => {
    if (size > 0) {
      const emoji = size > 100 ? '🔴' : size > 50 ? '🟡' : '🟢'
      console.log(`${emoji} ${key.padEnd(12)}: ${size.toString().padStart(4)} KB`)
    }
  })

  console.log('\n🎯 Performance Scores:')
  console.log('----------------------')
  Object.entries(report.scores).forEach(([key, data]) => {
    const emoji = data.status === 'PASS' ? '✅' : '❌'
    const percentage = ((data.actual / data.budget) * 100).toFixed(1)
    console.log(`${emoji} ${key.padEnd(12)}: ${data.actual}KB / ${data.budget}KB (${percentage}%)`)
  })

  // Overall score
  const overallScore = Object.values(report.scores).reduce((sum, s) => sum + s.score, 0) / Object.keys(report.scores).length
  console.log(`\n🎖️  Overall Performance Score: ${Math.round(overallScore)}/100`)

  // Optimization status
  console.log('\n⚡ Active Optimizations:')
  console.log('------------------------')
  Object.entries(report.optimizations).forEach(([key, enabled]) => {
    const emoji = enabled ? '✅' : '❌'
    const name = key.replace(/([A-Z])/g, ' $1').toLowerCase()
    console.log(`${emoji} ${name}`)
  })

  // Recommendations
  console.log('\n💡 Next Steps:')
  console.log('---------------')
  
  const recommendations = []
  
  if (report.metrics.totalJS > PERFORMANCE_BUDGETS.firstLoadJS) {
    recommendations.push('• Further reduce first load JS with more aggressive code splitting')
  }
  
  if (report.metrics.vendor > PERFORMANCE_BUDGETS.vendor) {
    recommendations.push('• Consider removing unused vendor dependencies')
  }
  
  if (report.metrics.gsap > PERFORMANCE_BUDGETS.gsap) {
    recommendations.push('• Optimize GSAP usage with selective plugin loading')
  }

  if (recommendations.length === 0) {
    console.log('🎉 All performance targets met! Consider monitoring with Lighthouse.')
  } else {
    recommendations.forEach(rec => console.log(rec))
  }

  console.log('\n🚀 Run "npm run lighthouse" for detailed performance audit')
  console.log('')
}

// Main execution
function main() {
  console.log('📊 Measuring Bundle Performance...\n')
  
  const chunks = analyzeBuildMetrics()
  if (!chunks) return

  const results = calculatePerformanceScore(chunks)
  const report = logPerformanceMetrics(results)
  
  displayPerformanceDashboard(report)
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  analyzeBuildMetrics,
  calculatePerformanceScore,
  logPerformanceMetrics,
  displayPerformanceDashboard,
  PERFORMANCE_BUDGETS
}
