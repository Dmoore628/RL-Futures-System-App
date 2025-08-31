import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

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
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null)
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  it('initializes with default value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    
    expect(result.current[0]).toBe('default-value')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key')
  })

  it('retrieves stored value when it exists', () => {
    localStorageMock.getItem.mockReturnValue('"stored-value"')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    
    expect(result.current[0]).toBe('stored-value')
  })

  it('updates stored value when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"')
  })

  it('handles complex objects correctly', () => {
    const complexObject = { name: 'test', value: 42, nested: { data: 'nested' } }
    
    const { result } = renderHook(() => useLocalStorage('complex-key', complexObject))
    
    act(() => {
      result.current[1](complexObject)
    })
    
    expect(result.current[0]).toEqual(complexObject)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('complex-key', JSON.stringify(complexObject))
  })

  it('handles arrays correctly', () => {
    const arrayValue = ['item1', 'item2', 'item3']
    
    const { result } = renderHook(() => useLocalStorage('array-key', arrayValue))
    
    act(() => {
      result.current[1](arrayValue)
    })
    
    expect(result.current[0]).toEqual(arrayValue)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('array-key', JSON.stringify(arrayValue))
  })

  it('handles null values', () => {
    const { result } = renderHook(() => useLocalStorage('null-key', null))
    
    act(() => {
      result.current[1](null)
    })
    
    expect(result.current[0]).toBeNull()
    expect(localStorageMock.setItem).toHaveBeenCalledWith('null-key', 'null')
  })

  it('handles undefined values', () => {
    const { result } = renderHook(() => useLocalStorage('undefined-key', undefined))
    
    act(() => {
      result.current[1](undefined)
    })
    
    expect(result.current[0]).toBeUndefined()
    expect(localStorageMock.setItem).toHaveBeenCalledWith('undefined-key', 'undefined')
  })

  it('handles boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('bool-key', false))
    
    act(() => {
      result.current[1](true)
    })
    
    expect(result.current[0]).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('bool-key', 'true')
  })

  it('handles number values', () => {
    const { result } = renderHook(() => useLocalStorage('number-key', 0))
    
    act(() => {
      result.current[1](42)
    })
    
    expect(result.current[0]).toBe(42)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('number-key', '42')
  })

  it('handles invalid JSON gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => useLocalStorage('invalid-key', 'default'))
    
    expect(result.current[0]).toBe('default')
  })

  it('handles empty string values', () => {
    const { result } = renderHook(() => useLocalStorage('empty-key', ''))
    
    act(() => {
      result.current[1]('')
    })
    
    expect(result.current[0]).toBe('')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('empty-key', '""')
  })

  it('maintains value across re-renders', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('persistent-key', 'initial'))
    
    act(() => {
      result.current[1]('updated')
    })
    
    rerender()
    
    expect(result.current[0]).toBe('updated')
  })

  it('handles multiple keys independently', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'default1'))
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'default2'))
    
    act(() => {
      result1.current[1]('value1')
      result2.current[1]('value2')
    })
    
    expect(result1.current[0]).toBe('value1')
    expect(result2.current[0]).toBe('value2')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('key1', '"value1"')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('key2', '"value2"')
  })

  it('handles function updates', () => {
    const { result } = renderHook(() => useLocalStorage('function-key', 0))
    
    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('function-key', '1')
  })

  it('handles function updates with current value', () => {
    const { result } = renderHook(() => useLocalStorage('function-key', 10))
    
    act(() => {
      result.current[1]((prev: number) => prev * 2)
    })
    
    expect(result.current[0]).toBe(20)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('function-key', '20')
  })
})
