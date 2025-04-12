import { useAuth } from '@/lib/auth/AuthContext'

/**
 * Base URL for API requests
 * 
 * Using absolute URL to connect to backend on port 3000
 */
export const API_BASE_URL = 'http://localhost:3000'

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number
  
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Helper function to make authorized API requests
 * 
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Promise with the response data
 */
export async function fetchWithAuth<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // NOTE: This cannot use useAuth here because custom hooks 
  // can only be used inside components. This needs to be called directly
  // from components that have access to useAuth.
  
  try {
    // Construct the full URL
    const apiUrl = url.startsWith('http') 
      ? url 
      : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
    
    // Make the request with merged headers
    const response = await fetch(apiUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    // Handle unauthorized responses
    if (response.status === 401) {
      console.error('Unauthorized API request, redirecting to login')
      if (typeof window !== 'undefined') {
        // Clear auth data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        
        // Redirect to login
        window.location.href = '/'
      }
      throw new ApiError('Unauthorized. Please log in again.', 401)
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || 'API Error'
      throw new ApiError(errorMessage, response.status)
    }
    
    // Return the response data
    const contentType = response.headers.get('Content-Type') || ''
    if (contentType.includes('application/json')) {
      return await response.json()
    } else {
      return await response.text() as unknown as T
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      500
    )
  }
}

/**
 * React hook for making authorized API requests within components
 */
export function useApi() {
  const { getAuthHeader } = useAuth()
  
  /**
   * Make an authorized API request
   * 
   * @param url The URL to fetch
   * @param options Fetch options
   * @returns Promise with the response data
   */
  const fetchApi = async <T = any>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    const authHeader = getAuthHeader()
    
    return fetchWithAuth<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        ...authHeader,
      },
    })
  }
  
  /**
   * Make a GET request
   */
  const get = <T = any>(url: string): Promise<T> => {
    return fetchApi(url, { method: 'GET' })
  }
  
  /**
   * Make a POST request
   */
  const post = <T = any>(url: string, data: any): Promise<T> => {
    return fetchApi(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
  /**
   * Make a PUT request
   */
  const put = <T = any>(url: string, data: any): Promise<T> => {
    return fetchApi(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  
  /**
   * Make a DELETE request
   */
  const del = <T = any>(url: string): Promise<T> => {
    return fetchApi(url, { method: 'DELETE' })
  }
  
  return {
    fetchApi,
    get,
    post,
    put,
    del,
  }
} 