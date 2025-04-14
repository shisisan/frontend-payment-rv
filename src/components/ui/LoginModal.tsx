'use client';

import {
  Box,
  Button,
  Input,
  Text,
  Link,
  Stack,
  Portal,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaDiscord, FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscordLogin: () => void;
}

export const LoginModal = ({ isOpen, onClose, onDiscordLogin }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  // Form submission is not functional yet
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted with:', { email, password });
    // No actual login functionality for now
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.700"
        backdropFilter="blur(5px)"
        zIndex={1000}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={onClose}
      >
        <Box
          bg="#101826"
          borderRadius="20px"
          boxShadow="lg"
          maxW="md"
          w="90%"
          overflow="hidden"
          onClick={(e) => e.stopPropagation()}
          p={0}
        >
          <Box
            p={4}
            borderBottomWidth="0"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              color="white"
              fontWeight="bold"
              fontSize="lg"
              textAlign="center"
              width="100%"
            >
              Log In
            </Text>
            <Button
              size="sm"
              onClick={onClose}
              variant="ghost"
              color="white"
              position="absolute"
              right={4}
              top={4}
              p={0}
              minW="auto"
              h="auto"
              _hover={{ bg: "transparent", color: "gray.300" }}
            >
              ✕
            </Button>
          </Box>

          <Box p={6}>
            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                <Box>
                  <Text color="gray.300" fontSize="sm" mb={2}>User</Text>
                  <Input
                    placeholder="email or username"
                    bg="#1a202c"
                    border="none"
                    color="white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    _focus={{ boxShadow: "0 0 0 1px #5865F2" }}
                    borderRadius="10px"
                  />
                </Box>
                
                <Box>
                  <Text color="gray.300" fontSize="sm" mb={2}>Password</Text>
                  <Box position="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      bg="#1a202c"
                      border="none"
                      color="white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      _focus={{ boxShadow: "0 0 0 1px #5865F2" }}
                      pr={10}
                      borderRadius="10px"
                    />
                    <Button
                      variant="ghost"
                      color="gray.400"
                      size="sm"
                      onClick={handleTogglePassword}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      _hover={{ bg: "transparent", color: "white" }}
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      p={0}
                      minW="auto"
                      h="auto"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </Box>
                  <Text color="gray.400" fontSize="xs" mt={1} textAlign="right">
                    <Link _hover={{ color: "blue.300", textDecoration: "none" }}>
                      Reset my password
                    </Link>
                  </Text>
                </Box>
                
                <Button 
                  type="submit" 
                  width="100%"
                  bg="#5865F2" 
                  color="white" 
                  _hover={{ bg: "#4752C4" }}
                  mt={2}
                  borderRadius="10px"
                >
                  Log In
                </Button>

                <Box 
                  borderTopWidth="1px" 
                  borderColor="gray.600" 
                  my={2} 
                  pt={2}
                />
                
                <Button
                  onClick={onDiscordLogin}
                  width="100%"
                  variant="outline"
                  borderColor="#5865F2"
                  color="#5865F2"
                  _hover={{ bg: "#5865F220" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="10px"
                >
                  <Box as={FaDiscord} mr={2} />
                  Login with Discord
                </Button>
                
                <Box textAlign="center" mt={2}>
                  <Text color="gray.400" fontSize="sm">
                    Create New Account
                  </Text>
                </Box>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
};

export default LoginModal; 