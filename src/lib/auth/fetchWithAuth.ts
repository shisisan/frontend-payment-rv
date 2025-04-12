/**
 * Utility function to make authenticated API requests
 * This automatically adds the auth token from localStorage to the request headers
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': token } : {}),
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Helper to handle common API response patterns
 */
export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetchWithAuth(url, options)
  
  if (!response.ok) {
    const error = new Error(`API Error: ${response.status}`)
    try {
      const errorData = await response.json()
      throw Object.assign(error, { status: response.status, data: errorData })
    } catch {
      throw Object.assign(error, { status: response.status })
    }
  }
  
  return response.json()
} 