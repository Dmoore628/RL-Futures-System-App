import { renderHook, waitFor } from '@testing-library/react'
import { useContent } from '../useContent'

// Mock fetch globally
global.fetch = jest.fn()

describe('useContent Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it('loads content successfully', async () => {
    const mockContent = {
      brand: 'RL Futures Trading System',
      title: 'Welcome to RL Trading',
      subtitle: 'Advanced AI-powered trading system',
      sections: [
        {
          heading: 'What This Application Does',
          paragraph: 'This is a professional RL trading system.'
        }
      ]
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContent
    })

    const { result } = renderHook(() => useContent())

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.content).toBeNull()

    // Wait for content to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.content).toEqual(mockContent)
    expect(result.current.content).toBeDefined()
  })

  it('handles fetch errors gracefully', async () => {
    const networkError = new Error('Network error')
    ;(fetch as jest.Mock).mockRejectedValueOnce(networkError)

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.content).toBeDefined()
    expect(result.current.content?.brand).toBe('Moore Tech')
  })

  it('handles HTTP error responses', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.content).toBeDefined()
    expect(result.current.content?.brand).toBe('Moore Tech')
  })

  it('handles JSON parsing errors', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON')
      }
    })

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.content).toBeDefined()
    expect(result.current.content?.brand).toBe('Moore Tech')
  })

  it('loads content from correct URL', async () => {
    const mockContent = { brand: 'Test Brand' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContent
    })

    renderHook(() => useContent())

    expect(fetch).toHaveBeenCalledWith('/content/welcomeContent.json')
  })

  it('handles empty content gracefully', async () => {
    const emptyContent = {}
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyContent
    })

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.content).toEqual(emptyContent)
    expect(result.current.content).toBeDefined()
  })

  it('handles content with missing properties', async () => {
    const incompleteContent = {
      brand: 'Test Brand'
      // Missing title, subtitle, sections
    }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => incompleteContent
    })

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.content).toEqual(incompleteContent)
    expect(result.current.content).toBeDefined()
  })

  it('maintains loading state during fetch', async () => {
    let resolveFetch: (value: any) => void
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve
    })

    ;(fetch as jest.Mock).mockReturnValueOnce(fetchPromise)

    const { result } = renderHook(() => useContent())

    // Should be loading initially
    expect(result.current.loading).toBe(true)

    // Resolve the fetch
    resolveFetch!({
      ok: true,
      json: async () => ({ brand: 'Test' })
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('handles multiple hook instances independently', async () => {
    const mockContent1 = { brand: 'Brand 1' }
    const mockContent2 = { brand: 'Brand 2' }

    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContent1
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContent2
      })

    const { result: result1 } = renderHook(() => useContent())
    const { result: result2 } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
      expect(result2.current.loading).toBe(false)
    })

    expect(result1.current.content).toEqual(mockContent1)
    expect(result2.current.content).toEqual(mockContent2)
  })

  it('retries content loading on error', async () => {
    // First attempt fails
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    // Second attempt succeeds
    const mockContent = { brand: 'Success Brand' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContent
    })

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.content).toEqual(mockContent)
    expect(result.current.content).toBeDefined()
  })
})
