'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Center,
  useDisclosure
} from '@chakra-ui/react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useApi } from '@/lib/api'
import { useState } from 'react'

export default function Dashboard() {
  const { user, logout, debugInfo, refreshUserData, debugAuth } = useAuth()
  const api = useApi()
  const [backendDebug, setBackendDebug] = useState<string>('')
  const [isLoadingDebug, setIsLoadingDebug] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get data from localStorage for debugging
  const rawUserData = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const rawToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  // Function to test the backend debug endpoint
  const testBackendDebug = async () => {
    setIsLoadingDebug(true)
    try {
      const response = await api.get('/auth/debug')
      console.log('Backend debug response:', response)
      setBackendDebug(JSON.stringify(response, null, 2))
    } catch (error) {
      console.error('Error testing backend debug:', error)
      setBackendDebug(error instanceof Error ? error.message : String(error))
    } finally {
      setIsLoadingDebug(false)
    }
  }

  // Function to manually refresh user data
  const handleRefreshUserData = async () => {
    setIsRefreshing(true)
    try {
      await refreshUserData()
    } catch (error) {
      console.error('Error refreshing user data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // If no user data, show loading state
  if (!user) {
    return (
      <Container maxW="container.xl" py={10}>
        <Box mb={6}>
          <Heading mb={4}>Loading...</Heading>
          <Text>Checking authentication status...</Text>
        </Box>
        
        <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Heading size="md" mb={4}>Debug Information</Heading>
          
          <Text mb={2}>Token: {rawToken ? 'EXISTS' : 'NOT FOUND'}</Text>
          <Text mb={2}>User data: {rawUserData ? 'EXISTS' : 'NOT FOUND'}</Text>
          
          {rawUserData && (
            <Box p={2} bg="gray.100" borderRadius="md" my={4}>
              <Text fontFamily="monospace" fontSize="sm" whiteSpace="pre-wrap">
                {rawUserData}
              </Text>
            </Box>
          )}
          
          <Box my={4} borderTopWidth="1px" />
          
          <Heading size="sm" mb={2}>Debug Log</Heading>
          <Box
            p={2}
            bg="gray.100"
            borderRadius="md"
            fontFamily="monospace"
            fontSize="xs"
            height="200px"
            overflowY="auto"
          >
            <Text whiteSpace="pre-wrap">{debugInfo}</Text>
          </Box>
          
          <Flex mt={4} gap={2}>
            {rawToken && (
              <Button 
                colorScheme="blue" 
                onClick={handleRefreshUserData}
                isLoading={isRefreshing}
                size="sm"
              >
                Fetch User Data
              </Button>
            )}
            <Button 
              colorScheme="purple" 
              size="sm" 
              onClick={debugAuth}
              variant="outline"
            >
              Run Auth Debug
            </Button>
          </Flex>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={6}>
        <Heading>Discord Dashboard</Heading>
      </Box>

      <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" mb={6}>
        <Flex direction={{ base: 'column', md: 'row' }} align="center" mb={6}>
          {/* User Avatar */}
          {user.avatar ? (
            <Box 
              mr={{ base: 0, md: 6 }}
              mb={{ base: 4, md: 0 }}
              borderRadius="full"
              overflow="hidden"
              width="128px"
              height="128px"
            >
              <Image
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt="Discord Avatar"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </Box>
          ) : (
            <Center
              width="128px"
              height="128px"
              borderRadius="full"
              bg="gray.200"
              mr={{ base: 0, md: 6 }}
              mb={{ base: 4, md: 0 }}
            >
              <Text fontSize="4xl" fontWeight="bold" color="gray.500">
                {user.username?.charAt(0).toUpperCase()}
              </Text>
            </Center>
          )}
          
          {/* User Details */}
          <Box>
            <Heading size="md" mb={2}>
              {user.displayName || user.username}
              {user.discriminator !== '0' && (
                <Text as="span" ml={1} color="gray.500">
                  #{user.discriminator}
                </Text>
              )}
            </Heading>
            
            {user.email && <Text color="gray.500" mb={4}>{user.email}</Text>}
            
            <Flex>
              <Button colorScheme="red" onClick={logout} mr={2}>
                Logout
              </Button>
              <Button 
                colorScheme="blue" 
                variant="outline" 
                onClick={handleRefreshUserData}
                isLoading={isRefreshing}
                mr={2}
              >
                Refresh Data
              </Button>
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={debugAuth}
              >
                Debug
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" mb={6}>
        <Heading size="md" mb={4}>User Information</Heading>
        
        <Box mb={3}>
          <Text fontWeight="bold" mb={1}>Username:</Text>
          <Text>{user.username}</Text>
        </Box>
        
        {user.displayName && (
          <Box mb={3}>
            <Text fontWeight="bold" mb={1}>Display Name:</Text>
            <Text>{user.displayName}</Text>
          </Box>
        )}
        
        <Box mb={3}>
          <Text fontWeight="bold" mb={1}>User ID:</Text>
          <Text>{user.id}</Text>
        </Box>
        
        {user.email && (
          <Box mb={3}>
            <Text fontWeight="bold" mb={1}>Email:</Text>
            <Text>{user.email}</Text>
          </Box>
        )}
      </Box>
      
      <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="sm">Debug Information</Heading>
          <Button 
            colorScheme="blue" 
            size="sm" 
            onClick={testBackendDebug}
            isLoading={isLoadingDebug}
          >
            Test Backend
          </Button>
        </Flex>
        
        <Box mb={4}>
          <Text fontWeight="bold" mb={2}>Local Storage:</Text>
          <Box
            p={2}
            bg="gray.100" 
            borderRadius="md"
            fontFamily="monospace"
            fontSize="xs"
            overflowY="auto"
            maxHeight="100px"
            mb={2}
          >
            <Text whiteSpace="pre-wrap">
              {`User data: ${rawUserData}\n\nToken: ${rawToken?.substring(0, 20)}...`}
            </Text>
          </Box>
        </Box>
        
        {backendDebug && (
          <Box mb={4}>
            <Text fontWeight="bold" mb={2}>Backend Debug Response:</Text>
            <Box
              p={2}
              bg="gray.100" 
              borderRadius="md"
              fontFamily="monospace"
              fontSize="xs"
              overflowY="auto"
              maxHeight="200px"
            >
              <Text whiteSpace="pre-wrap">{backendDebug}</Text>
            </Box>
          </Box>
        )}
        
        <Box>
          <Text fontWeight="bold" mb={2}>Auth Context Log:</Text>
          <Box
            p={2}
            bg="gray.100" 
            borderRadius="md"
            fontFamily="monospace"
            fontSize="xs"
            height="100px"
            overflowY="auto"
          >
            <Text whiteSpace="pre-wrap">{debugInfo}</Text>
          </Box>
        </Box>
      </Box>

      <Text textAlign="center" fontSize="sm" color="gray.500">
        © 2025 - agustinusnathaniel.com
      </Text>
    </Container>
  );
} 