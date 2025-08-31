/**
 * Comprehensive Jest Configuration
 * Covers all testing categories: Unit, Integration, Accessibility, Performance, Security, Cross-Browser, E2E
 */

module.exports = {
  // Extend the base Jest configuration
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/src/**/comprehensive/**/*.{ts,tsx}'
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
    '<rootDir>/src/setupComprehensiveTests.ts'
  ],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1'
  },
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.ts',
    '!src/setupTests.ts',
    '!src/setupComprehensiveTests.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Test environment configuration
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
    pretendToBeVisual: true
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Reset modules between tests
  resetModules: true,
  
  // Global test setup
  globalSetup: '<rootDir>/src/setupGlobalTests.ts',
  
  // Global test teardown
  globalTeardown: '<rootDir>/src/teardownGlobalTests.ts',
  
  // Test reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ]
  ],
  
  // Test results processor
  testResultsProcessor: 'jest-junit',
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Notify mode
  notify: true,
  
  // Notify mode configuration
  notifyMode: 'failure-change',
  
  // Test location in results
  testLocationInResults: true,
  
  // Error on deprecated calls
  errorOnDeprecated: true,
  
  // Force exit
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Maximum workers
  maxWorkers: '50%',
  
  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Cache key
  cacheKey: 'comprehensive-testing',
  
  // Projects for different test categories
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['<rootDir>/src/**/integration/**/*.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
    },
    {
      displayName: 'Accessibility Tests',
      testMatch: ['<rootDir>/src/**/accessibility/**/*.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupAccessibilityTests.ts']
    },
    {
      displayName: 'Performance Tests',
      testMatch: ['<rootDir>/src/**/performance/**/*.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupPerformanceTests.ts']
    },
    {
      displayName: 'Security Tests',
      testMatch: ['<rootDir>/src/**/security/**/*.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupSecurityTests.ts']
    },
    {
      displayName: 'Cross-Browser Tests',
      testMatch: ['<rootDir>/src/**/crossBrowser/**/*.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupCrossBrowserTests.ts']
    },
    {
      displayName: 'E2E Tests',
      testMatch: ['<rootDir>/src/**/e2e/**/*.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupE2ETests.ts']
    }
  ]
}
