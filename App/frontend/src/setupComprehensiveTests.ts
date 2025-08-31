/**
 * Comprehensive Test Setup
 * Configures testing environment for all testing categories
 */

import '@testing-library/jest-dom'
import 'jest-extended'

// Mock performance API for performance testing
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 1024 * 1024 * 10, // 10MB
      totalJSHeapSize: 1024 * 1024 * 100, // 100MB
      jsHeapSizeLimit: 1024 * 1024 * 1000 // 1GB
    }
  }
})

// Mock requestAnimationFrame for animation testing
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn((callback) => {
    setTimeout(callback, 16) // 60fps simulation
    return 1
  })
})

// Mock cancelAnimationFrame
Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn()
})

// Mock ResizeObserver for responsive testing
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock IntersectionObserver for performance testing
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

// Mock localStorage for storage testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.sessionStorage = sessionStorageMock

// Mock FileReader for file upload testing
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsText: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  readAsDataURL: jest.fn(),
  onload: null,
  onerror: null,
  result: null
}))

// Mock URL.createObjectURL for file testing
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// Mock fetch for API testing
global.fetch = jest.fn()

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn()
})

// Mock window.scrollBy
Object.defineProperty(window, 'scrollBy', {
  writable: true,
  value: jest.fn()
})

// Mock window.scroll
Object.defineProperty(window, 'scroll', {
  writable: true,
  value: jest.fn()
})

// Mock Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

// Mock Element.prototype.getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100
}))

// Mock Element.prototype.getClientRects
Element.prototype.getClientRects = jest.fn(() => [{
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100
}])

// Mock CSS.supports for feature detection testing
Object.defineProperty(window, 'CSS', {
  writable: true,
  value: {
    supports: jest.fn(() => true)
  }
})

// Mock getComputedStyle for styling tests
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: jest.fn(() => ({
    getPropertyValue: jest.fn(() => ''),
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgb(0, 0, 0)',
    transform: 'none',
    transition: 'none',
    animation: 'none'
  }))
})

// Mock MutationObserver for DOM change testing
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => [])
}))

// Mock PerformanceObserver for performance testing
global.PerformanceObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => [])
}))

// Mock navigator for device testing
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    platform: 'Win32',
    language: 'en-US',
    languages: ['en-US', 'en'],
    cookieEnabled: true,
    onLine: true,
    hardwareConcurrency: 8,
    maxTouchPoints: 0,
    vendor: 'Google Inc.',
    product: 'Gecko'
  }
})

// Mock screen for responsive testing
Object.defineProperty(window, 'screen', {
  writable: true,
  value: {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
    pixelDepth: 24
  }
})

// Mock devicePixelRatio for high-DPI testing
Object.defineProperty(window, 'devicePixelRatio', {
  writable: true,
  value: 1
})

// Mock visualViewport for viewport testing
Object.defineProperty(window, 'visualViewport', {
  writable: true,
  value: {
    width: 1920,
    height: 1080,
    scale: 1,
    offsetLeft: 0,
    offsetTop: 0
  }
})

// Mock window.open for popup testing
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(() => ({
    close: jest.fn(),
    postMessage: jest.fn()
  }))
})

// Mock window.postMessage for communication testing
Object.defineProperty(window, 'postMessage', {
  writable: true,
  value: jest.fn()
})

// Mock window.addEventListener for event testing
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: jest.fn(originalAddEventListener)
})

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: jest.fn(originalRemoveEventListener)
})

// Mock document.createRange for selection testing
Object.defineProperty(document, 'createRange', {
  writable: true,
  value: jest.fn(() => ({
    setStart: jest.fn(),
    setEnd: jest.fn(),
    getBoundingClientRect: jest.fn(() => ({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }))
  }))
})

// Mock document.getSelection for selection testing
Object.defineProperty(document, 'getSelection', {
  writable: true,
  value: jest.fn(() => ({
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
    toString: jest.fn(() => '')
  }))
})

// Setup test environment variables
process.env.NODE_ENV = 'test'
process.env.REACT_APP_TESTING = 'true'

// Global test timeout
jest.setTimeout(30000)

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
  
  // Reset DOM
  document.body.innerHTML = ''
  
  // Reset localStorage and sessionStorage
  localStorageMock.clear()
  sessionStorageMock.clear()
  
  // Reset fetch mock
  if (global.fetch) {
    (global.fetch as jest.Mock).mockClear()
  }
})

// Global test teardown
afterEach(() => {
  // Clean up any remaining timers
  jest.clearAllTimers()
  
  // Clean up any remaining intervals
  jest.clearAllIntervals()
  
  // Clean up any remaining timeouts
  jest.clearAllTimeouts()
})

// Export test utilities for use in tests
export const testUtils = {
  mockPerformance: () => {
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: {
        now: jest.fn(() => Date.now()),
        memory: {
          usedJSHeapSize: 1024 * 1024 * 10,
          totalJSHeapSize: 1024 * 1024 * 100,
          jsHeapSizeLimit: 1024 * 1024 * 1000
        }
      }
    })
  },
  
  mockViewport: (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width
    })
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height
    })
    
    window.dispatchEvent(new Event('resize'))
  },
  
  mockTouchDevice: () => {
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      value: jest.fn()
    })
  },
  
  mockNetworkError: () => {
    if (global.fetch) {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))
    }
  }
}
