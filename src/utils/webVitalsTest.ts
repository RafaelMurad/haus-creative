/**
 * Web Vitals Monitoring Test
 * Phase 3.1 Chunk 4: Validation and testing script
 */

// Simple test to verify Web Vitals monitoring is working
export const testWebVitalsMonitoring = () => {
  if (typeof window === 'undefined') {
    console.log('❌ Web Vitals monitoring test can only run in browser')
    return
  }

  console.log('🧪 Testing Web Vitals Monitoring...')
  
  // Check if monitoring is initialized
  import('../utils/webVitalsMonitoring').then(({ getPerformanceMonitor }) => {
    const monitor = getPerformanceMonitor()
    
    if (monitor) {
      console.log('✅ Performance monitor initialized')
      
      // Check if metrics are being collected
      setTimeout(() => {
        const metrics = monitor.getMetrics()
        const score = monitor.getPerformanceScore()
        
        console.log('📊 Current metrics:', metrics.length)
        console.log('🎯 Performance score:', score)
        
        if (metrics.length > 0) {
          console.log('✅ Web Vitals monitoring is working!')
          console.log('📈 Latest metrics:', metrics.slice(-3))
        } else {
          console.log('⏳ Waiting for Web Vitals data...')
        }
      }, 3000)
      
    } else {
      console.log('❌ Performance monitor not initialized')
    }
  })
}

// Auto-run test in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Wait for page load
  if (document.readyState === 'complete') {
    testWebVitalsMonitoring()
  } else {
    window.addEventListener('load', testWebVitalsMonitoring)
  }
}
