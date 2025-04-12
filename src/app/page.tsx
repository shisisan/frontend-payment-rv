'use client'

import { useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Center
} from '@chakra-ui/react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { FaDiscord } from 'react-icons/fa'
import Loading from '@/components/ui/loading'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogin = () => {
    // Use the backend endpoint to initiate OAuth flow
    window.location.href = 'http://localhost:3000/auth/discord'
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Loading />
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Container 
        maxW="container.md" 
        py={16}
        px={8}
        bg="#0a0e18" 
        borderRadius="lg" 
        boxShadow="lg"
        textAlign="center"
      >
        <Stack spacing={8} align="center">
          <Stack spacing={4}>
            <Heading size="xl">Welcome</Heading>
            <Text fontSize="lg">Login with Discord to continue</Text>
          </Stack>
          
          <Button
            onClick={handleLogin}
            size="lg"
            colorScheme="blue"
            bg="#5865F2"
            _hover={{ bg: "#4752C4" }}
            leftIcon={<FaDiscord />}
            px={8}
          >
            Login with Discord
          </Button>
        </Stack>
      </Container>
      
      <Text fontSize="sm" color="gray.500" mt={8}>
        {new Date().getFullYear()} - agustinusnathaniel.com
      </Text>
    </Box>
  )
} 