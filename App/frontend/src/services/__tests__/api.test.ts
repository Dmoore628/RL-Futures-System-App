import { apiClient } from '../api'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  describe('GET requests', () => {
    it('makes successful GET request', async () => {
      const mockResponse = { data: 'test data', status: 200 }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      })

      const result = await apiClient.get('/test-endpoint')

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/test-endpoint')
      expect(result).toEqual({
        data: mockResponse,
        status: 200
      })
    })

    it('handles HTTP error responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' })
      })

      await expect(apiClient.get('/not-found')).rejects.toThrow('HTTP error! status: 404')
    })

    it('handles network errors', async () => {
      const networkError = new Error('Network error')
      ;(fetch as jest.Mock).mockRejectedValueOnce(networkError)

      await expect(apiClient.get('/test')).rejects.toThrow('API request failed: Network error')
    })

    it('handles JSON parsing errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      await expect(apiClient.get('/test')).rejects.toThrow('API request failed: Invalid JSON')
    })
  })

  describe('POST requests', () => {
    it('makes successful POST request', async () => {
      const mockResponse = { success: true, id: 123 }
      const postData = { name: 'test', value: 42 }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse
      })

      const result = await apiClient.post('/create', postData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
      expect(result).toEqual({
        data: mockResponse,
        status: 201
      })
    })

    it('handles POST request errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad request' })
      })

      await expect(apiClient.post('/create', {})).rejects.toThrow('HTTP error! status: 400')
    })

    it('handles POST network errors', async () => {
      const networkError = new Error('Network error')
      ;(fetch as jest.Mock).mockRejectedValueOnce(networkError)

      await expect(apiClient.post('/create', {})).rejects.toThrow('API request failed: Network error')
    })
  })

  describe('Environment configuration', () => {
    it('uses default base URL when VITE_API_URL is not set', () => {
      // Temporarily remove VITE_API_URL
      const originalEnv = process.env.VITE_API_URL
      delete process.env.VITE_API_URL

      // Recreate client to test default URL
      const { apiClient: newClient } = require('../api')
      
      expect(newClient.baseURL).toBe('http://localhost:8000')

      // Restore environment
      if (originalEnv) {
        process.env.VITE_API_URL = originalEnv
      }
    })

    it('uses custom base URL when VITE_API_URL is set', () => {
      const customUrl = 'https://api.example.com'
      process.env.VITE_API_URL = customUrl

      // Recreate client to test custom URL
      const { apiClient: newClient } = require('../api')
      
      expect(newClient.baseURL).toBe(customUrl)
    })
  })

  describe('Error handling', () => {
    it('provides meaningful error messages', async () => {
      const customError = new Error('Custom error message')
      ;(fetch as jest.Mock).mockRejectedValueOnce(customError)

      try {
        await apiClient.get('/test')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('API request failed: Custom error message')
      }
    })

    it('handles unknown error types', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce('String error')

      await expect(apiClient.get('/test')).rejects.toThrow('API request failed: Unknown error')
    })
  })

  describe('Request formatting', () => {
    it('properly formats request URLs', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({})
      })

      await apiClient.get('/users/123/profile')

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/users/123/profile')
    })

    it('handles empty endpoints', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({})
      })

      await apiClient.get('')

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000')
    })
  })
})
