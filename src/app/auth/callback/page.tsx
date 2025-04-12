'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'

export default function AuthCallback() {
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<string>('')
  const bgColor = useColorModeValue('gray.50', 'gray.700')

  const addDebugInfo = (info: string) => {
    console.log(`[AuthCallback] ${info}`)
    setDebugInfo(prev => prev + `\n${info}`)
  }

  useEffect(() => {
    // Extract token and user data from URL if passed as query parameters
    const checkUrl = () => {
      const hash = window.location.hash
      const query = new URLSearchParams(window.location.search)
      
      // Check for token in hash (Discord sometimes uses this format)
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1))
        const token = params.get('access_token')
        if (token) {
          addDebugInfo(`Found token in URL hash: ${token.substring(0, 10)}...`)
          localStorage.setItem('auth_token', `Bearer ${token}`)
          Cookies.set('auth_token', token, { path: '/' })
        }
      }
      
      // Check for token in query params
      if (query.has('token')) {
        const token = query.get('token')
        if (token) {
          addDebugInfo(`Found token in URL query: ${token.substring(0, 10)}...`)
          const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
          localStorage.setItem('auth_token', bearerToken)
          Cookies.set('auth_token', token, { path: '/' })
        }
      }
      
      // Check for user data in query params
      if (query.has('user_data')) {
        try {
          const userData = query.get('user_data')
          if (userData) {
            // If user_data is a JSON string, parse and store it
            const parsedUserData = JSON.parse(userData)
            addDebugInfo(`Found user data in URL query: ${JSON.stringify(parsedUserData).substring(0, 50)}...`)
            localStorage.setItem('user', userData)
            Cookies.set('user', userData, { path: '/' })
            Cookies.set('user_data', userData, { path: '/' })
          }
        } catch (error) {
          addDebugInfo(`Error parsing user data from URL: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    }
    
    // Check URL immediately
    checkUrl()
    
    // Check if token exists, which should be set by the backend in the HTML response
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('user')
      
      // Update debug info
      addDebugInfo(`Checking auth...\nToken: ${token ? 'Found' : 'Missing'}\nUser: ${user ? 'Found' : 'Missing'}`)
      
      if (token) {
        addDebugInfo(`Token format: ${token.substring(0, 20)}...`)
      }
      
      // If both token and user data exist, sync to cookies and redirect to dashboard
      if (token && user) {
        try {
          // Ensure token is also in cookies for middleware
          const plainToken = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token
          Cookies.set('auth_token', plainToken, { path: '/' })
          addDebugInfo('Token set in cookies')
          
          // Also save user data in cookies
          Cookies.set('user', user, { path: '/' })
          Cookies.set('user_data', user, { path: '/' })
          addDebugInfo('User data set in cookies')
          
          // Parse user data to verify it's valid
          const userData = JSON.parse(user)
          addDebugInfo(`User data valid: ${userData.username}`)
          
          // Log all user data for debugging
          if (userData) {
            addDebugInfo(`User ID: ${userData.id || 'not found'}`)
            addDebugInfo(`Username: ${userData.username || 'not found'}`)
            addDebugInfo(`Avatar: ${userData.avatar || 'not found'}`)
            addDebugInfo(`Discriminator: ${userData.discriminator || 'not found'}`)
            addDebugInfo(`Display Name: ${userData.displayName || 'not found'}`)
          }
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        } catch (error) {
          addDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`)
          
          // Clear any invalid data
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          Cookies.remove('auth_token')
          Cookies.remove('user')
          Cookies.remove('user_data')
          addDebugInfo('Cleared invalid authentication data')
          
          // Redirect to login page after error
          setTimeout(() => {
            router.push('/')
          }, 3000)
        }
      } else if (token) {
        addDebugInfo('Token found but no user data. Will wait for user data or try to fetch it.')
        // If we have token but no user, wait a bit longer as user data might be coming or direct to dashboard
        // which will handle fetching user data
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        // If there's no token after a certain time, redirect to login
        setTimeout(() => {
          if (!localStorage.getItem('auth_token') || !localStorage.getItem('user')) {
            addDebugInfo('No auth after timeout, redirecting to login')
            router.push('/')
          }
        }, 5000)
      }
    }

    checkAuthAndRedirect()
    // Check again after a delay in case the backend takes time to set the values
    const timer = setTimeout(checkAuthAndRedirect, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={6} width="100%">
        <Box textAlign="center">
          <Spinner size="xl" colorScheme="blue" />
        </Box>
        <Heading size="lg" textAlign="center">Authentication in progress</Heading>
        <Text textAlign="center">
          Please wait while we complete the authentication process...
        </Text>
        
        <Box p={4} borderWidth="1px" borderRadius="md" bg={bgColor} w="full">
          <Text fontWeight="bold" mb={2}>Debug Information:</Text>
          <Box
            p={3}
            width="100%"
            borderRadius="md"
            bg="gray.900"
            color="white"
            fontFamily="mono"
            fontSize="xs"
            whiteSpace="pre-wrap"
            overflowX="auto"
            maxHeight="300px"
            overflowY="auto"
          >
            {debugInfo || 'Initializing...'}
          </Box>
        </Box>
      </VStack>
    </Container>
  )
} 