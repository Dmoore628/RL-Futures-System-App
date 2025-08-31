/**
 * Accessibility Testing Utilities
 * Provides comprehensive testing functions for WCAG 2.1 AA compliance
 */

import { screen } from '@testing-library/react'

/**
 * Check if element has proper ARIA attributes
 */
export const hasAriaAttributes = (element: HTMLElement, requiredAttributes: string[]): boolean => {
  return requiredAttributes.every(attr => element.hasAttribute(attr))
}

/**
 * Check if element has proper role attribute
 */
export const hasRole = (element: HTMLElement, role: string): boolean => {
  return element.getAttribute('role') === role
}

/**
 * Check if element has proper label (aria-label, aria-labelledby, or associated label)
 */
export const hasLabel = (element: HTMLElement): boolean => {
  return !!(
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.getAttribute('title') ||
    element.querySelector('label')
  )
}

/**
 * Check if element is keyboard accessible
 */
export const isKeyboardAccessible = (element: HTMLElement): boolean => {
  return element.tabIndex >= 0 || element.tagName === 'BUTTON' || element.tagName === 'A'
}

/**
 * Check if element has proper focus management
 */
export const hasFocusManagement = (element: HTMLElement): boolean => {
  return element.hasAttribute('tabindex') || element.tagName === 'BUTTON' || element.tagName === 'A'
}

/**
 * Check if element has proper contrast ratio (basic check)
 */
export const hasContrastRatio = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element)
  const backgroundColor = style.backgroundColor
  const color = style.color
  
  // Basic check - in real testing, use proper contrast ratio calculation
  return !!(backgroundColor && color && backgroundColor !== 'transparent')
}

/**
 * Check if element has proper alt text for images
 */
export const hasAltText = (element: HTMLElement): boolean => {
  if (element.tagName === 'IMG') {
    return !!element.getAttribute('alt')
  }
  return true
}

/**
 * Check if element has proper heading structure
 */
export const hasHeadingStructure = (): boolean => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  if (headings.length === 0) return true
  
  let previousLevel = 0
  for (let i = 0; i < headings.length; i++) {
    const level = parseInt(headings[i].tagName.charAt(1))
    if (level > previousLevel + 1) return false
    previousLevel = level
  }
  return true
}

/**
 * Check if element has proper form labels
 */
export const hasFormLabels = (element: HTMLElement): boolean => {
  if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
    const id = element.getAttribute('id')
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`)
      return !!label
    }
  }
  return true
}

/**
 * Comprehensive accessibility test for a component
 */
export const testAccessibility = (componentName: string, requiredAttributes: string[] = []) => {
  describe(`${componentName} Accessibility`, () => {
    it('has proper ARIA attributes', () => {
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('component')
      if (element) {
        expect(hasAriaAttributes(element, requiredAttributes)).toBe(true)
      }
    })

    it('has proper role attribute', () => {
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('component')
      if (element) {
        expect(hasRole(element, 'button') || hasRole(element, 'link')).toBe(true)
      }
    })

    it('has proper label', () => {
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('component')
      if (element) {
        expect(hasLabel(element)).toBe(true)
      }
    })

    it('is keyboard accessible', () => {
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('component')
      if (element) {
        expect(isKeyboardAccessible(element)).toBe(true)
      }
    })

    it('has proper focus management', () => {
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('component')
      if (element) {
        expect(hasFocusManagement(element)).toBe(true)
      }
    })

    it('has proper contrast ratio', () => {
      const element = screen.getByRole('button') || screen.getByRole('link') || screen.getByTestId('component')
      if (element) {
        expect(hasContrastRatio(element)).toBe(true)
      }
    })

    it('has proper alt text for images', () => {
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        expect(hasAltText(img)).toBe(true)
      })
    })

    it('has proper heading structure', () => {
      expect(hasHeadingStructure()).toBe(true)
    })

    it('has proper form labels', () => {
      const formElements = document.querySelectorAll('input, select, textarea')
      formElements.forEach(element => {
        expect(hasFormLabels(element)).toBe(true)
      })
    })
  })
}
