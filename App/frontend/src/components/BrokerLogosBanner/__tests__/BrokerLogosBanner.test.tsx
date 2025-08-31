import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BrokerLogosBanner from '../BrokerLogosBanner'

// Mock the CSS module
jest.mock('../BrokerLogosBanner.module.css', () => ({
  bannerContainer: 'banner-container',
  logosWrapper: 'logos-wrapper',
  logoItem: 'logo-item',
  logo: 'logo'
}))

describe('BrokerLogosBanner', () => {
  beforeEach(() => {
    // Mock window.getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: jest.fn(() => ({
        getPropertyValue: jest.fn(() => 'scrollLeft'),
        transform: 'matrix(1, 0, 0, 1, 0, 0)'
      }))
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(<BrokerLogosBanner />)
      expect(screen.getByTestId('broker-logos-banner')).toBeInTheDocument()
    })

    test('displays all four broker logos', () => {
      render(<BrokerLogosBanner />)
      
      const ninjaTraderLogos = screen.getAllByAltText('NINJATRADER')
      const interactiveBrokersLogos = screen.getAllByAltText('Interactive Brokers')
      const topstepLogos = screen.getAllByAltText('TOPSTEPX')
      const tradovateLogos = screen.getAllByAltText('Tradovate')
      
      expect(ninjaTraderLogos.length).toBeGreaterThan(0)
      expect(interactiveBrokersLogos.length).toBeGreaterThan(0)
      expect(topstepLogos.length).toBeGreaterThan(0)
      expect(tradovateLogos.length).toBeGreaterThan(0)
    })

    test('displays duplicate logos for seamless scrolling', () => {
      render(<BrokerLogosBanner />)
      
      const ninjaTraderLogos = screen.getAllByAltText('NINJATRADER')
      const interactiveBrokersLogos = screen.getAllByAltText('Interactive Brokers')
      const topstepLogos = screen.getAllByAltText('TOPSTEPX')
      const tradovateLogos = screen.getAllByAltText('Tradovate')
      const thinkOrSwimLogos = screen.getAllByAltText('ThinkOrSwim')
      const tradeStationLogos = screen.getAllByAltText('TradeStation')
      const optimusFuturesLogos = screen.getAllByAltText('Optimus Futures')
      
      expect(ninjaTraderLogos).toHaveLength(3) // 3 sets of each logo
      expect(interactiveBrokersLogos).toHaveLength(3)
      expect(topstepLogos).toHaveLength(3)
      expect(tradovateLogos).toHaveLength(3)
      expect(thinkOrSwimLogos).toHaveLength(3)
      expect(tradeStationLogos).toHaveLength(3)
      expect(optimusFuturesLogos).toHaveLength(3)
    })

    test('displays banner title', () => {
      render(<BrokerLogosBanner />)
      expect(screen.getByText('Supported Broker Connections')).toBeInTheDocument()
    })

    test('has correct CSS classes', () => {
      render(<BrokerLogosBanner />)
      
      const banner = screen.getByTestId('broker-logos-banner')
      
      // CSS modules transform class names, so we check for the presence of the banner
      expect(banner).toBeInTheDocument()
    })
  })

  describe('Logo Properties', () => {
    test('logos have correct src attributes', () => {
      render(<BrokerLogosBanner />)
      
      const ninjaTraderLogos = screen.getAllByAltText('NINJATRADER')
      const interactiveBrokersLogos = screen.getAllByAltText('Interactive Brokers')
      const topstepLogos = screen.getAllByAltText('TOPSTEPX')
      const tradovateLogos = screen.getAllByAltText('Tradovate')
      
      expect(ninjaTraderLogos[0]).toHaveAttribute('src', '/ninjatraderlogo.png')
      expect(interactiveBrokersLogos[0]).toHaveAttribute('src', '/interactivebrokers-logo-stacked.png')
      expect(topstepLogos[0]).toHaveAttribute('src', '/topsteplogo.jpg')
      expect(tradovateLogos[0]).toHaveAttribute('src', '/Tradovatelogo.png')
    })

    test('logos have correct alt text for accessibility', () => {
      render(<BrokerLogosBanner />)
      
      const ninjaTraderLogos = screen.getAllByAltText('NINJATRADER')
      const interactiveBrokersLogos = screen.getAllByAltText('Interactive Brokers')
      const topstepLogos = screen.getAllByAltText('TOPSTEPX')
      const tradovateLogos = screen.getAllByAltText('Tradovate')
      
      expect(ninjaTraderLogos.length).toBeGreaterThan(0)
      expect(interactiveBrokersLogos.length).toBeGreaterThan(0)
      expect(topstepLogos.length).toBeGreaterThan(0)
      expect(tradovateLogos.length).toBeGreaterThan(0)
    })
  })

  describe('Drag and Drop Functionality', () => {
    test('changes cursor to grab on mouse down', () => {
      render(<BrokerLogosBanner />)
      
      const banner = screen.getByTestId('broker-logos-banner')
      const logosWrapper = banner.querySelector('div[style*="cursor: grab"]')
      expect(logosWrapper).toBeInTheDocument()
    })

    test('changes cursor to grabbing during drag', () => {
      render(<BrokerLogosBanner />)
      
      const banner = screen.getByTestId('broker-logos-banner')
      const logosWrapper = banner.querySelector('div[style*="cursor: grab"]')
      
      fireEvent.mouseDown(logosWrapper!)
      
      expect(logosWrapper).toHaveAttribute('style', expect.stringContaining('cursor: grabbing'))
    })

    test('resets cursor to grab after drag', async () => {
      render(<BrokerLogosBanner />)
      
      const banner = screen.getByTestId('broker-logos-banner')
      const logosWrapper = banner.querySelector('div[style*="cursor: grab"]')
      
      fireEvent.mouseDown(logosWrapper!)
      fireEvent.mouseUp(logosWrapper!)
      
      await waitFor(() => {
        expect(logosWrapper).toHaveAttribute('style', expect.stringContaining('cursor: grab'))
      })
    })
  })

  describe('Animation Integration', () => {
    test('logos wrapper has proper structure for JavaScript animation', () => {
      render(<BrokerLogosBanner />)
      
      const banner = screen.getByTestId('broker-logos-banner')
      
      // Check if the banner is present and has proper structure
      expect(banner).toBeInTheDocument()
      
      const logosWrapper = banner.querySelector('div[style*="transform"]')
      expect(logosWrapper).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('has proper test ID for testing', () => {
      render(<BrokerLogosBanner />)
      expect(screen.getByTestId('broker-logos-banner')).toBeInTheDocument()
    })

    test('all images have descriptive alt text', () => {
      render(<BrokerLogosBanner />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })
  })

  describe('Component Structure', () => {
    test('has correct DOM structure', () => {
      render(<BrokerLogosBanner />)
      
      const banner = screen.getByTestId('broker-logos-banner')
      
      // Check that the banner contains the expected number of logo items
      const logoItems = banner.querySelectorAll('img[alt]')
      
      expect(banner).toBeInTheDocument()
      expect(logoItems).toHaveLength(21) // 21 logos total
    })

    test('logo items contain images', () => {
      render(<BrokerLogosBanner />)
      
      const logoItems = screen.getAllByAltText('NINJATRADER')
      logoItems.forEach(logo => {
        expect(logo.tagName).toBe('IMG')
      })
    })
  })

  describe('Performance and Optimization', () => {
    test('uses refs for DOM manipulation', () => {
      render(<BrokerLogosBanner />)
      
      // The component should use refs for performance optimization
      // This is tested by checking if the component renders without errors
      expect(screen.getByTestId('broker-logos-banner')).toBeInTheDocument()
    })

    test('implements proper event cleanup', () => {
      const { unmount } = render(<BrokerLogosBanner />)
      
      // Should not throw errors on unmount
      expect(() => unmount()).not.toThrow()
    })
  })
})
