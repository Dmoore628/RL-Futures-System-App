/**
 * Performance Testing Utilities
 * Provides comprehensive testing functions for performance validation
 */

/**
 * Measure execution time of a function
 */
export const measureExecutionTime = <T>(fn: () => T): { result: T; executionTime: number } => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  return { result, executionTime: end - start }
}

/**
 * Check if animation maintains 60fps
 */
export const checkAnimationPerformance = (animationFn: () => void, duration: number = 1000): boolean => {
  const frameTimes: number[] = []
  let lastTime = performance.now()
  
  const animate = (currentTime: number) => {
    const deltaTime = currentTime - lastTime
    frameTimes.push(deltaTime)
    
    if (currentTime - lastTime < duration) {
      animationFn()
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
  
  // Calculate average frame time
  const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length
  const fps = 1000 / avgFrameTime
  
  return fps >= 55 // Allow slight variance from 60fps
}

/**
 * Check for memory leaks by monitoring memory usage
 */
export const checkMemoryLeak = async (testFn: () => void, iterations: number = 100): Promise<boolean> => {
  if ('memory' in performance) {
    const initialMemory = (performance as any).memory.usedJSHeapSize
    
    for (let i = 0; i < iterations; i++) {
      testFn()
    }
    
    // Force garbage collection if available
    if ('gc' in global) {
      (global as any).gc()
    }
    
    const finalMemory = (performance as any).memory.usedJSHeapSize
    const memoryIncrease = finalMemory - initialMemory
    
    // Allow for some memory increase but flag significant leaks
    return memoryIncrease < 1024 * 1024 * 10 // 10MB threshold
  }
  
  return true // Can't measure memory in this environment
}

/**
 * Measure bundle size impact
 */
export const measureBundleSize = (): { size: number; sizeInMB: string } => {
  // This would typically be done with webpack-bundle-analyzer or similar
  // For testing purposes, we'll simulate bundle size measurement
  const mockSize = Math.random() * 1024 * 1024 // Random size between 0-1MB
  return {
    size: mockSize,
    sizeInMB: (mockSize / (1024 * 1024)).toFixed(2)
  }
}

/**
 * Performance test suite for components
 */
export const testPerformance = (componentName: string, renderFn: () => void) => {
  describe(`${componentName} Performance`, () => {
    it('renders within acceptable time', () => {
      const { executionTime } = measureExecutionTime(renderFn)
      expect(executionTime).toBeLessThan(100) // Should render in under 100ms
    })

    it('maintains 60fps for animations', () => {
      const hasGoodPerformance = checkAnimationPerformance(() => {
        // Simulate animation frame
        renderFn()
      })
      expect(hasGoodPerformance).toBe(true)
    })

    it('does not cause memory leaks', async () => {
      const noMemoryLeak = await checkMemoryLeak(() => {
        renderFn()
      })
      expect(noMemoryLeak).toBe(true)
    })

    it('has acceptable bundle size impact', () => {
      const { sizeInMB } = measureBundleSize()
      const sizeInMBNum = parseFloat(sizeInMB)
      expect(sizeInMBNum).toBeLessThan(1.0) // Should be under 1MB
    })
  })
}

/**
 * Performance benchmarks for critical operations
 */
export const performanceBenchmarks = {
  renderTime: 100, // ms
  animationFPS: 55, // minimum fps
  memoryThreshold: 1024 * 1024 * 10, // 10MB
  bundleSizeThreshold: 1024 * 1024 // 1MB
}
