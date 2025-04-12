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
  Center,
  Spinner
} from '@chakra-ui/react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { FaDiscord } from 'react-icons/fa'

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
    return (
      <Container centerContent height="100vh">
        <Center height="100%">
          <Spinner size="xl" color="blue.500" />
        </Center>
      </Container>
    )
  }

  return (
    <Box bg="black" minH="100vh" color="white">
      <Container maxW="container.md" py={16}>
        <Stack textAlign="center" align="center">
          <Stack>
            <Heading size="xl">Welcome</Heading>
            <Text fontSize="lg">Login with Discord to continue</Text>
          </Stack>
          
          <Button
            onClick={handleLogin}
            size="lg"
            colorScheme="blue"
            bg="#5865F2"
            _hover={{ bg: "#4752C4" }}
          >
            <FaDiscord /> Login with Discord
          </Button>
          <Box position="absolute" bottom={4}>
            <Text fontSize="sm" color="gray.500">
              2025 - agustinusnathaniel.com
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
} 