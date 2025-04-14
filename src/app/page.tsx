'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Button
} from '@chakra-ui/react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import Loading from '@/components/ui/loading'
import { FaArrowRight } from 'react-icons/fa'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Fungsi untuk navigasi ke dashboard
  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Loading />
  }

  return (
    <Box minH="calc(100vh - 80px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Container maxW="container.md" py={16} px={8} textAlign="center">
        <Flex direction="column" gap={8} align="center">
          <Box width="80px" height="80px" borderRadius="20px" bg="#5865F2" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="2xl" fontWeight="bold" color="white">D</Text>
          </Box>
          
          <Flex direction="column" gap={4}>
            <Heading size="xl" color="white">Welcome to REVITALIZE!</Heading>
            <Text fontSize="lg" color="gray.300">
                a dashbord to manage account and shop item ingame via website.
            </Text>
          </Flex>
          
          {isAuthenticated ? (
            <Button 
              colorScheme="blue" 
              size="lg" 
              onClick={navigateToDashboard}
              bg="#5865F2"
              _hover={{ bg: "#4752C4" }}
              mt={4}
            >
              Go to Dashboard <Box as={FaArrowRight} display="inline-block" ml={2} />
            </Button>
          ) : (
            <Text fontSize="md" color="gray.400" maxW="md">
              Click the Login button in the top-right corner to get started with your Discord account
            </Text>
          )}
        </Flex>
      </Container>
      
      <Box textAlign="center" mt="auto" pb={4}>
        <Text fontSize="sm" color="gray.500">
          {new Date().getFullYear()} - Revitalize Community Present
        </Text>
      </Box>
    </Box>
  )
} 