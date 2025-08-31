import React from 'react'
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  it('provides default light theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    expect(result.current.theme).toBe('light')
  })

  it('loads theme from localStorage on initialization', () => {
    localStorageMock.getItem.mockReturnValue('"dark"')
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    expect(result.current.theme).toBe('dark')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
  })

  it('toggles theme from light to dark', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    expect(result.current.theme).toBe('light')
    
    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', '"dark"')
  })

  it('toggles theme from dark to light', () => {
    localStorageMock.getItem.mockReturnValue('"dark"')
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    expect(result.current.theme).toBe('dark')
    
    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', '"light"')
  })

  it('persists theme changes to localStorage', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    act(() => {
      result.current.toggleTheme()
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', '"dark"')
  })

  it('handles invalid localStorage values gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    expect(result.current.theme).toBe('light') // Default fallback
  })

  it('handles missing localStorage gracefully', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    expect(result.current.theme).toBe('light') // Default fallback
  })

  it('provides theme context to child components', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
  })

  it('allows child components to toggle theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const toggleButton = screen.getByTestId('toggle-theme')
    const themeDisplay = screen.getByTestId('current-theme')

    expect(themeDisplay).toHaveTextContent('light')

    fireEvent.click(toggleButton)

    expect(themeDisplay).toHaveTextContent('dark')
  })

  it('maintains theme state across re-renders', () => {
    const { result, rerender } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')

    rerender()

    expect(result.current.theme).toBe('dark')
  })

  it('handles multiple theme toggles correctly', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme() // light -> dark
    })
    expect(result.current.theme).toBe('dark')

    act(() => {
      result.current.toggleTheme() // dark -> light
    })
    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme() // light -> dark
    })
    expect(result.current.theme).toBe('dark')
  })

  it('provides consistent theme object reference', () => {
    const { result, rerender } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    const initialThemeObject = result.current
    rerender()

    expect(result.current).toBe(initialThemeObject)
  })

  it('handles localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    // Should not crash when localStorage fails
    expect(() => {
      act(() => {
        result.current.toggleTheme()
      })
    }).not.toThrow()

    expect(result.current.theme).toBe('dark')
  })
})
