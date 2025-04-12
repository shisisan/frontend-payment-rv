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
  Separator,
  useDisclosure
} from '@chakra-ui/react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useApi } from '@/lib/api'
import { useState } from 'react'
import Loading from '@/components/ui/loading'

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

  // If no user data, show loading component
  if (!user) {
    return <Loading />
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={6}>
        <Heading color="text.primary">Discord Dashboard</Heading>
      </Box>

      <Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.secondary" mb={6}>
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
              bg="bg.accent"
              mr={{ base: 0, md: 6 }}
              mb={{ base: 4, md: 0 }}
            >
              <Text fontSize="4xl" fontWeight="bold" color="text.primary">
                {user.username?.charAt(0).toUpperCase()}
              </Text>
            </Center>
          )}
          
          {/* User Details */}
          <Box>
            <Heading size="md" mb={2} color="text.primary">
              {user.displayName || user.username}
              {user.discriminator !== '0' && (
                <Text as="span" ml={1} color="text.secondary">
                  #{user.discriminator}
                </Text>
              )}
            </Heading>
            
            {user.email && <Text color="text.secondary" mb={4}>{user.email}</Text>}
            
            <Flex>
              <Button 
                colorScheme="red" 
                onClick={logout} 
                mr={2}
                bg="button.danger.bg"
                color="button.danger.text"
                _hover={{ bg: "button.danger.hover" }}
              >
                Logout
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRefreshUserData}
                isLoading={isRefreshing}
                mr={2}
                borderColor="button.primary.bg"
                color="button.primary.bg"
                _hover={{ bg: "rgba(49, 130, 206, 0.1)" }}
              >
                Refresh Data
              </Button>
              <Button
                variant="outline"
                onClick={debugAuth}
                borderColor="button.secondary.bg"
                color="text.accent"
                _hover={{ bg: "rgba(42, 55, 73, 0.6)" }}
              >
                Debug
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.secondary" mb={6}>
        <Heading size="md" mb={4} color="text.primary">User Information</Heading>
        
        <Box mb={3}>
          <Text fontWeight="bold" mb={1} color="text.accent">Username:</Text>
          <Text color="text.primary">{user.username}</Text>
        </Box>
        
        {user.displayName && (
          <Box mb={3}>
            <Text fontWeight="bold" mb={1} color="text.accent">Display Name:</Text>
            <Text color="text.primary">{user.displayName}</Text>
          </Box>
        )}
        
        <Box mb={3}>
          <Text fontWeight="bold" mb={1} color="text.accent">User ID:</Text>
          <Text color="text.primary">{user.id}</Text>
        </Box>
        
        {user.email && (
          <Box mb={3}>
            <Text fontWeight="bold" mb={1} color="text.accent">Email:</Text>
            <Text color="text.primary">{user.email}</Text>
          </Box>
        )}
      </Box>
      
      <Box p={4} borderWidth="1px" borderRadius="md" bg="bg.secondary" mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="sm" color="text.primary">Debug Information</Heading>
          <Button 
            size="sm" 
            onClick={testBackendDebug}
            isLoading={isLoadingDebug}
            bg="button.primary.bg"
            color="button.primary.text"
            _hover={{ bg: "button.primary.hover" }}
          >
            Test Backend
          </Button>
        </Flex>
        
        <Separator mb={4} borderColor="gray.600" />
        
        <Box mb={4}>
          <Text fontWeight="bold" mb={2} color="text.accent">Local Storage:</Text>
          <Box
            p={2}
            bg="bg.accent" 
            borderRadius="md"
            fontFamily="monospace"
            fontSize="xs"
            overflowY="auto"
            maxHeight="100px"
            mb={2}
          >
            <Text whiteSpace="pre-wrap" color="text.primary">
              {`User data: ${rawUserData}\n\nToken: ${rawToken?.substring(0, 20)}...`}
            </Text>
          </Box>
        </Box>
        
        {backendDebug && (
          <Box mb={4}>
            <Text fontWeight="bold" mb={2} color="text.accent">Backend Debug Response:</Text>
            <Box
              p={2}
              bg="bg.accent" 
              borderRadius="md"
              fontFamily="monospace"
              fontSize="xs"
              overflowY="auto"
              maxHeight="200px"
            >
              <Text whiteSpace="pre-wrap" color="text.primary">{backendDebug}</Text>
            </Box>
          </Box>
        )}
        
        <Box>
          <Text fontWeight="bold" mb={2} color="text.accent">Auth Context Log:</Text>
          <Box
            p={2}
            bg="bg.accent" 
            borderRadius="md"
            fontFamily="monospace"
            fontSize="xs"
            height="100px"
            overflowY="auto"
          >
            <Text whiteSpace="pre-wrap" color="text.primary">{debugInfo}</Text>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 