'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toaster } from "@/components/ui/toaster"

interface User {
  username: string
  avatar: string
  id: string
  discriminator: string
  email?: string
  displayName?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  debugInfo: string
  getAuthHeader: () => { Authorization: string } | {}
  refreshUserData: () => Promise<void>
  debugAuth: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  debugInfo: '',
  getAuthHeader: () => ({}),
  refreshUserData: async () => {},
  debugAuth: () => {}
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Start in loading state to show skeleton immediately
  const [debugInfo, setDebugInfo] = useState<string>('')
  const router = useRouter()

  const addDebugInfo = (info: string) => {
    console.log(`[AuthContext] ${info}`)
    setDebugInfo(prev => `${prev}\n[${new Date().toISOString()}] ${info}`)
  }

  // Function to check if token has expired (for JWT tokens)
  const isTokenExpired = (token: string): boolean => {
    try {
      // JWT tokens are in format: header.payload.signature
      const payload = token.split('.')[1]
      if (!payload) return true

      const decodedPayload = JSON.parse(atob(payload))
      const exp = decodedPayload.exp
      
      if (!exp) return false // No expiration
      
      // Check if token has expired
      const now = Math.floor(Date.now() / 1000)
      return exp < now
    } catch (error) {
      console.error('[AuthContext] Error checking token expiration:', error)
      return true // Assume expired on error
    }
  }

  // Function to fetch user data from backend
  const fetchUserData = async (authToken: string): Promise<User | null> => {
    addDebugInfo('Fetching user data from server...')
    try {
      const headers: HeadersInit = {}
      
      // Add authorization header with correct format
      if (authToken.startsWith('Bearer ')) {
        headers.Authorization = authToken
      } else {
        headers.Authorization = `Bearer ${authToken}`
      }

      // Fetch user data from the server
      const response = await fetch('http://localhost:3000/auth/user', {
        method: 'GET',
        headers,
        credentials: 'include' // For cookies support
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`)
      }

      // Parse the response body
      const responseData = await response.json()
      addDebugInfo(`Raw response from server: ${JSON.stringify(responseData)}`)
      
      // Extract user data from response - handle different response formats
      let userData;
      
      // Handle case where response might be { data: { user: {...} } }
      if (responseData.data && responseData.data.user) {
        userData = responseData.data.user;
        addDebugInfo('Found user data in response.data.user');
      } 
      // Handle case where response might be { user: {...} }
      else if (responseData.user) {
        userData = responseData.user;
        addDebugInfo('Found user data in response.user');
      }
      // Handle case where response might be { data: {...} }
      else if (responseData.data && typeof responseData.data === 'object') {
        userData = responseData.data;
        addDebugInfo('Found user data in response.data');
      }
      // Handle case where response is the user object directly
      else if (responseData.username || responseData.id) {
        userData = responseData;
        addDebugInfo('Response itself appears to be user data');
      } else {
        // Try to find any object with user-like properties
        for (const key in responseData) {
          const value = responseData[key];
          if (value && typeof value === 'object' && (value.username || value.id)) {
            userData = value;
            addDebugInfo(`Found user-like data in response.${key}`);
            break;
          }
        }
        
        // If still not found, use the response as is
        if (!userData) {
          userData = responseData;
          addDebugInfo('Using entire response as user data');
        }
      }
      
      addDebugInfo(`User data keys from server: ${Object.keys(userData).join(', ')}`)
      
      // Normalize the user data
      const normalizedUser = {
        id: userData.id || userData.user_id || userData.userId || userData.discord_id || 'unknown',
        username: userData.username || userData.user_name || userData.userName || userData.name || 'unknown',
        avatar: userData.avatar || userData.avatarURL || userData.avatar_url || userData.avatarUrl || null,
        discriminator: userData.discriminator || userData.discrim || '0',
        displayName: userData.displayName || userData.display_name || userData.global_name || userData.globalName || userData.username || null,
        email: userData.email || null
      };
      
      // Handle missing fields with fallbacks
      if (!normalizedUser.username || normalizedUser.username === 'unknown') {
        addDebugInfo('User data from server missing username field, creating fallback')
        
        if (normalizedUser.id && normalizedUser.id !== 'unknown') {
          normalizedUser.username = `User_${normalizedUser.id.substring(0, 8)}`
          addDebugInfo(`Using generated username from ID: ${normalizedUser.username}`)
        } else {
          normalizedUser.username = 'Discord User'
          addDebugInfo(`Using default username: Discord User`)
        }
      }
      
      if (!normalizedUser.id || normalizedUser.id === 'unknown') {
        addDebugInfo('User data from server missing ID field, creating fallback')
        normalizedUser.id = `generated_${Math.random().toString(36).substring(2, 15)}`
        addDebugInfo(`Using generated ID: ${normalizedUser.id}`)
      }
      
      addDebugInfo(`User data from server normalized: username=${normalizedUser.username}, id=${normalizedUser.id}`)
      
      // Save normalized user data to localStorage and cookies
      const normalizedUserJson = JSON.stringify(normalizedUser);
      localStorage.setItem('user', normalizedUserJson);
      Cookies.set('user', normalizedUserJson, { path: '/' });
      Cookies.set('user_data', normalizedUserJson, { path: '/' });
      
      return normalizedUser;
    } catch (error) {
      addDebugInfo(`Error fetching user data: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  // Function to debug auth status
  const debugAuth = () => {
    addDebugInfo('-------- AUTH DEBUG --------')
    addDebugInfo(`Token in localStorage: ${localStorage.getItem('auth_token') ? 'YES' : 'NO'}`)
    addDebugInfo(`User in localStorage: ${localStorage.getItem('user') ? 'YES' : 'NO'}`)
    
    if (localStorage.getItem('auth_token')) {
      const token = localStorage.getItem('auth_token')
      addDebugInfo(`Token format: ${token?.substring(0, 20)}...`)
    }
    
    if (localStorage.getItem('user')) {
      const rawUser = localStorage.getItem('user')
      addDebugInfo(`Raw user data: ${rawUser}`)
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        addDebugInfo(`User data keys: ${Object.keys(userData).join(', ')}`)
        addDebugInfo(`User data: ${JSON.stringify(userData).substring(0, 100)}...`)
      } catch (error) {
        addDebugInfo(`Error parsing user data: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    
    addDebugInfo(`user cookie: ${Cookies.get('user') ? 'YES' : 'NO'}`)
    addDebugInfo(`user_data cookie: ${Cookies.get('user_data') ? 'YES' : 'NO'}`)
    addDebugInfo(`auth_token cookie: ${Cookies.get('auth_token') ? 'YES' : 'NO'}`)
    
    // Make debug API request if token exists
    if (token) {
      // Create headers manually to avoid type issues
      const headers: Record<string, string> = {}
      if (token) {
        if (token.startsWith('Bearer ')) {
          headers.Authorization = token
        } else {
          headers.Authorization = `Bearer ${token}`
        }
      }
      
      fetch('http://localhost:3000/auth/debug', {
        headers,
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          addDebugInfo(`Auth debug API response: ${JSON.stringify(data)}`)
        })
        .catch(err => {
          addDebugInfo(`Auth debug API error: ${err instanceof Error ? err.message : String(err)}`)
        })
    }
    
    addDebugInfo('---------------------------')
  }

  // Function exposed to components to refresh user data
  const refreshUserData = async (): Promise<void> => {
    if (!token) {
      addDebugInfo('Cannot refresh user data: No token available')
      return
    }
    
    addDebugInfo('Manually refreshing user data')
    const userData = await fetchUserData(token)
    
    if (userData) {
      setUser(userData)
      addDebugInfo('User data refreshed successfully')
    } else {
      addDebugInfo('Failed to refresh user data')
    }
  }

  useEffect(() => {
    // Check if user is authenticated on initial load
    addDebugInfo('Initializing AuthContext')
    
    // IMPORTANT: Keep isLoading true until we've actually completed authentication check
    // This ensures the skeleton is shown immediately during initial load
    
    // First check cookies (server-side compatible)
    const cookieToken = Cookies.get('auth_token')
    const cookieUser = Cookies.get('user') || Cookies.get('user_data')  // Try both cookie names
    
    // Then check localStorage (client-side only)
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null

    addDebugInfo(`Token in cookie: ${cookieToken ? 'YES' : 'NO'}`)
    addDebugInfo(`User data in cookie: ${cookieUser ? 'YES' : 'NO'}`)
    addDebugInfo(`Token in localStorage: ${storedToken ? 'YES' : 'NO'}`)
    addDebugInfo(`User data in localStorage: ${storedUser ? 'YES' : 'NO'}`)
    
    // Determine which sources to use, preferring cookies first
    const tokenToUse = cookieToken || storedToken
    const userDataToUse = cookieUser || storedUser
    
    // Check if token has expired
    if (tokenToUse && tokenToUse.startsWith('Bearer ')) {
      const actualToken = tokenToUse.replace('Bearer ', '')
      if (isTokenExpired(actualToken)) {
        addDebugInfo('Token has expired, logging out')
        logout()
        return
      }
    }
    
    // Sync between localStorage and cookies
    if (storedToken && !cookieToken) {
      addDebugInfo('Syncing token from localStorage to cookie')
      // Store plain token in cookie (without Bearer prefix)
      const plainToken = storedToken.startsWith('Bearer ') 
        ? storedToken.replace('Bearer ', '') 
        : storedToken
      Cookies.set('auth_token', plainToken, { path: '/' })
    }
    
    if (!storedToken && cookieToken) {
      addDebugInfo('Syncing token from cookie to localStorage')
      // Add Bearer prefix if not present
      const bearerToken = cookieToken.startsWith('Bearer ') 
        ? cookieToken 
        : `Bearer ${cookieToken}`
      localStorage.setItem('auth_token', bearerToken)
    }
    
    if (storedUser && !cookieUser) {
      addDebugInfo('Syncing user data from localStorage to cookies')
      Cookies.set('user', storedUser, { path: '/' })
      Cookies.set('user_data', storedUser, { path: '/' })
    }
    
    if (!storedUser && cookieUser) {
      addDebugInfo('Syncing user data from cookie to localStorage')
      localStorage.setItem('user', cookieUser)
    }

    // Process auth data - execute immediately to show skeleton faster
    if (tokenToUse && userDataToUse) {
      try {
        addDebugInfo('Attempting to parse user data')
        addDebugInfo(`Raw user data: ${userDataToUse}`)
        let userData;
        
        try {
          userData = JSON.parse(userDataToUse)
        } catch (parseError) {
          addDebugInfo(`JSON parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
          addDebugInfo('Trying to handle non-JSON user data')
          
          // Fallback if not valid JSON - might be a different format
          if (typeof userDataToUse === 'string') {
            // Check if it's a URL-encoded string or other format
            try {
              // Try to decode as URI component
              const decoded = decodeURIComponent(userDataToUse)
              userData = JSON.parse(decoded)
              addDebugInfo('Successfully parsed URL-decoded user data')
            } catch (decodeError) {
              addDebugInfo(`Decode error: ${decodeError instanceof Error ? decodeError.message : String(decodeError)}`)
              // If not JSON or URL-encoded, treat as plain object with name
              userData = { username: userDataToUse, id: 'unknown' }
              addDebugInfo('Using user data as plain username string')
            }
          } else {
            throw new Error('Cannot parse user data in unknown format')
          }
        }
        
        addDebugInfo(`User data keys: ${Object.keys(userData).join(', ')}`)
        
        // Try to accommodate different property naming conventions
        // Map common Discord user fields with fallbacks
        const normalizedUser = {
          id: userData.id || userData.user_id || userData.userId || userData.discord_id || 'unknown',
          username: userData.username || userData.user_name || userData.userName || userData.name || 'unknown',
          avatar: userData.avatar || userData.avatarURL || userData.avatar_url || userData.avatarUrl || null,
          discriminator: userData.discriminator || userData.discrim || '0',
          displayName: userData.displayName || userData.display_name || userData.global_name || userData.globalName || userData.username || null,
          email: userData.email || null
        }
        
        // Validate user data has required fields
        if (!normalizedUser.username || normalizedUser.username === 'unknown') {
          addDebugInfo('User data missing username field, trying to create fallback username')
          // Try to extract username from other fields
          if (userData.user && typeof userData.user === 'object' && userData.user.username) {
            normalizedUser.username = userData.user.username
            addDebugInfo(`Found username in nested user object: ${normalizedUser.username}`)
          } else if (userData.discord && typeof userData.discord === 'object' && userData.discord.username) {
            normalizedUser.username = userData.discord.username
            addDebugInfo(`Found username in discord object: ${normalizedUser.username}`)
          } else {
            // If still no username, look for name in any field
            for (const [key, value] of Object.entries(userData)) {
              if ((key.includes('name') || key.includes('user')) && typeof value === 'string') {
                normalizedUser.username = value
                addDebugInfo(`Using ${key}: ${value} as username`)
                break
              }
            }
            
            // Last resort: use ID or a default value
            if (!normalizedUser.username || normalizedUser.username === 'unknown') {
              if (normalizedUser.id && normalizedUser.id !== 'unknown') {
                normalizedUser.username = `User_${normalizedUser.id.substring(0, 8)}`
                addDebugInfo(`Using generated username from ID: ${normalizedUser.username}`)
              } else {
                normalizedUser.username = 'Discord User'
                addDebugInfo('Using default username: Discord User')
              }
            }
          }
        }
        
        if (!normalizedUser.id || normalizedUser.id === 'unknown') {
          addDebugInfo('User data missing id field, trying to create fallback ID')
          // Try to extract id from other fields
          if (userData.user && typeof userData.user === 'object' && userData.user.id) {
            normalizedUser.id = userData.user.id
            addDebugInfo(`Found ID in nested user object: ${normalizedUser.id}`)
          } else if (userData.discord && typeof userData.discord === 'object' && userData.discord.id) {
            normalizedUser.id = userData.discord.id
            addDebugInfo(`Found ID in discord object: ${normalizedUser.id}`)
          } else {
            // If still no id, look for id or _id in any field
            for (const [key, value] of Object.entries(userData)) {
              if ((key.includes('id') || key === '_id') && typeof value === 'string') {
                normalizedUser.id = value
                addDebugInfo(`Using ${key}: ${value} as id`)
                break
              }
            }
            
            // Last resort: generate a random ID
            if (!normalizedUser.id || normalizedUser.id === 'unknown') {
              normalizedUser.id = `generated_${Math.random().toString(36).substring(2, 15)}`
              addDebugInfo(`Using generated ID: ${normalizedUser.id}`)
            }
          }
        }
        
        // Final validation - much more lenient now
        // We now always have at least fallback values for required fields
        addDebugInfo(`Final normalized user data: username=${normalizedUser.username}, id=${normalizedUser.id}`)
        
        // Log all user data fields
        addDebugInfo(`username: ${normalizedUser.username}`)
        addDebugInfo(`id: ${normalizedUser.id}`)
        addDebugInfo(`avatar: ${normalizedUser.avatar || 'not set'}`)
        addDebugInfo(`discriminator: ${normalizedUser.discriminator || 'not set'}`)
        addDebugInfo(`displayName: ${normalizedUser.displayName || 'not set'}`)
        
        // Save the normalized user data for future use
        const normalizedUserJson = JSON.stringify(normalizedUser)
        localStorage.setItem('user', normalizedUserJson)
        Cookies.set('user', normalizedUserJson, { path: '/' })
        Cookies.set('user_data', normalizedUserJson, { path: '/' })
        
        // Set user state
        setUser(normalizedUser)
        setToken(tokenToUse)
        addDebugInfo('User state updated')
        
        // Now that user data is available, end loading state
        setIsLoading(false);
        addDebugInfo('Finished loading');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        addDebugInfo(`Failed to parse user data: ${errorMessage}`)
        console.error('[AuthContext] Failed to parse user data:', error)
        
        // Clean up invalid data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        Cookies.remove('auth_token')
        Cookies.remove('user')
        Cookies.remove('user_data')
        addDebugInfo('Cleared invalid authentication data')
        
        toaster.create({
          title: "Authentication Error",
          description: "Failed to load user data. Please try logging in again.",
          type: "error",
          duration: 5000,
          closable: true,
        })
        
        // End loading even if there was an error
        setIsLoading(false);
        addDebugInfo('Finished loading after error');
      }
    } else if (tokenToUse) {
      // We have a token but no user data, try to fetch user data from server
      addDebugInfo('Token found but no user data, fetching from server')
      setToken(tokenToUse) // Set token immediately for API calls
      
      // Fetch user data from the server
      fetchUserData(tokenToUse).then(userData => {
        if (userData) {
          setUser(userData)
          addDebugInfo('User data fetched and set successfully')
        } else {
          // If we couldn't get user data, logout
          addDebugInfo('Could not fetch user data, logging out')
          logout()
        }
        
        // End loading state once user data has been processed
        setIsLoading(false);
        addDebugInfo('Finished loading after server fetch');
      }).catch(error => {
        addDebugInfo(`Error during user data fetch: ${error instanceof Error ? error.message : String(error)}`);
        setIsLoading(false);
        addDebugInfo('Finished loading after fetch error');
      })
      
      // Don't set isLoading to false yet, we're still loading data
      return;
    } else {
      addDebugInfo('No authentication data found')
      // No auth data, end loading immediately
      setIsLoading(false);
      addDebugInfo('Finished initialization - no auth data');
    }
  }, []);

  const getAuthHeader = () => {
    if (!token) return {}
    
    // If token already has Bearer prefix, use it as is
    if (token.startsWith('Bearer ')) {
      return { Authorization: token }
    }
    
    // Otherwise, add the Bearer prefix
    return { Authorization: `Bearer ${token}` }
  }

  const logout = () => {
    addDebugInfo('Logging out')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    Cookies.remove('auth_token')
    Cookies.remove('user')
    Cookies.remove('user_data')
    setUser(null)
    setToken(null)
    router.push('/')
    addDebugInfo('Logged out successfully')
    
    toaster.create({
      title: "Logged out",
      description: "You have been successfully logged out.",
      type: "success",
      duration: 3000,
      closable: true,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        logout,
        debugInfo,
        getAuthHeader,
        refreshUserData,
        debugAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 