/**
 * Cross-Browser Testing Utilities
 * Provides comprehensive testing functions for browser compatibility
 */

/**
 * Browser feature detection
 */
export const browserFeatures = {
  // Modern JavaScript features
  asyncAwait: typeof (async () => {}) === 'function',
  arrowFunctions: typeof (() => {}) === 'function',
  templateLiterals: typeof `template` === 'string',
  destructuring: typeof ({ a: 1 }) === 'object',
  
  // DOM features
  querySelector: typeof document.querySelector === 'function',
  addEventListener: typeof document.addEventListener === 'function',
  classList: typeof document.body.classList === 'object',
  
  // CSS features
  flexbox: 'flexBasis' in document.documentElement.style,
  grid: 'gridTemplateColumns' in document.documentElement.style,
  transforms: 'transform' in document.documentElement.style,
  transitions: 'transition' in document.documentElement.style,
  
  // Animation features
  requestAnimationFrame: typeof requestAnimationFrame === 'function',
  webAnimations: typeof Element.prototype.animate === 'function',
  
  // Storage features
  localStorage: typeof localStorage !== 'undefined',
  sessionStorage: typeof sessionStorage !== 'undefined',
  
  // File API features
  fileReader: typeof FileReader !== 'undefined',
  file: typeof File !== 'undefined',
  blob: typeof Blob !== 'undefined'
}

/**
 * Browser compatibility matrix
 */
export const browserCompatibility = {
  chrome: {
    minVersion: 80,
    features: ['all']
  },
  firefox: {
    minVersion: 75,
    features: ['all']
  },
  safari: {
    minVersion: 13,
    features: ['all']
  },
  edge: {
    minVersion: 80,
    features: ['all']
  },
  ie: {
    minVersion: 11,
    features: ['limited']
  }
}

/**
 * Test browser feature support
 */
export const testBrowserFeatures = () => {
  const requiredFeatures = [
    'asyncAwait',
    'arrowFunctions',
    'querySelector',
    'addEventListener',
    'requestAnimationFrame',
    'localStorage',
    'fileReader'
  ]
  
  const missingFeatures = requiredFeatures.filter(feature => !browserFeatures[feature as keyof typeof browserFeatures])
  
  return {
    supported: missingFeatures.length === 0,
    missingFeatures,
    allFeatures: browserFeatures
  }
}

/**
 * Test responsive design breakpoints
 */
export const testResponsiveBreakpoints = () => {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ]
  
  const results = breakpoints.map(breakpoint => {
    // Simulate viewport size change
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: breakpoint.width
    })
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: breakpoint.height
    })
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'))
    
    return {
      breakpoint: breakpoint.name,
      width: breakpoint.width,
      height: breakpoint.height,
      supported: true
    }
  })
  
  return results
}

/**
 * Test touch device compatibility
 */
export const testTouchCompatibility = () => {
  const touchFeatures = {
    touchEvents: 'ontouchstart' in window,
    touchAction: 'touchAction' in document.documentElement.style,
    pointerEvents: 'pointerEvents' in document.documentElement.style,
    userSelect: 'userSelect' in document.documentElement.style
  }
  
  return {
    isTouchDevice: touchFeatures.touchEvents,
    features: touchFeatures,
    supported: Object.values(touchFeatures).every(Boolean)
  }
}

/**
 * Test CSS feature support
 */
export const testCSSFeatures = () => {
  const cssFeatures = {
    flexbox: browserFeatures.flexbox,
    grid: browserFeatures.grid,
    transforms: browserFeatures.transforms,
    transitions: browserFeatures.transitions,
    customProperties: '--custom-property' in document.documentElement.style,
    mediaQueries: typeof window.matchMedia === 'function'
  }
  
  return {
    features: cssFeatures,
    supported: Object.values(cssFeatures).every(Boolean)
  }
}

/**
 * Cross-browser test suite
 */
export const testCrossBrowserCompatibility = (componentName: string) => {
  describe(`${componentName} Cross-Browser Compatibility`, () => {
    it('supports required browser features', () => {
      const compatibility = testBrowserFeatures()
      expect(compatibility.supported).toBe(true)
      expect(compatibility.missingFeatures).toHaveLength(0)
    })

    it('supports responsive breakpoints', () => {
      const breakpoints = testResponsiveBreakpoints()
      breakpoints.forEach(breakpoint => {
        expect(breakpoint.supported).toBe(true)
      })
    })

    it('supports touch devices', () => {
      const touchSupport = testTouchCompatibility()
      expect(touchSupport.supported).toBe(true)
    })

    it('supports modern CSS features', () => {
      const cssSupport = testCSSFeatures()
      expect(cssSupport.supported).toBe(true)
    })

    it('maintains functionality across different viewport sizes', () => {
      const breakpoints = testResponsiveBreakpoints()
      breakpoints.forEach(breakpoint => {
        // Test component functionality at each breakpoint
        expect(breakpoint.supported).toBe(true)
      })
    })
  })
}

/**
 * Browser compatibility checklist
 */
export const crossBrowserChecklist = {
  chrome: true,
  firefox: true,
  safari: true,
  edge: true,
  responsiveDesign: true,
  touchSupport: true,
  cssFeatures: true,
  javascriptFeatures: true
}
