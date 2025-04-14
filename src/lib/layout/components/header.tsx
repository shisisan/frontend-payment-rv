'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Heading, Button, Text, Image } from '@chakra-ui/react';
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaChevronDown } from 'react-icons/fa';
import LoginModal from '@/components/ui/LoginModal';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Cek apakah saat ini berada di halaman dashboard
  const isDashboardPage = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  // Set avatar URL
  useEffect(() => {
    if (user?.avatar) {
      // Check if the avatar is already a full URL
      if (user.avatar.startsWith('http')) {
        setAvatarUrl(user.avatar);
      } else {
        // Create Discord CDN URL
        const discordAvatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        setAvatarUrl(discordAvatarUrl);
      }
    }
  }, [user]);

  const handleDiscordLogin = () => {
    // Use the backend endpoint to initiate OAuth flow
    window.location.href = 'http://localhost:3000/auth/discord';
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
    setIsOpen(false);
  };

  const navigateToHome = () => {
    router.push('/');
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <>
      <Flex as="header" width="full" align="center" justify="space-between" py={4}>
        <Heading 
          size="md" 
          color="text.accent" 
          cursor="pointer" 
          onClick={navigateToHome}
          _hover={{ color: "white" }}
        >
          Revitalize Community
        </Heading>
        
        {isAuthenticated && user ? (
          <Box position="relative" ref={menuRef}>
            <Flex 
              align="center" 
              cursor="pointer" 
              onClick={() => setIsOpen(!isOpen)} 
              p={2} 
              borderRadius="md"
              _hover={{ bg: "whiteAlpha.100" }}
            >
              {/* User Avatar */}
              {avatarUrl ? (
                <Box 
                  width="32px" 
                  height="32px" 
                  borderRadius="full" 
                  overflow="hidden" 
                  mr={2}
                >
                  <Image 
                    src={avatarUrl} 
                    alt={user.username} 
                    width="100%" 
                    height="100%" 
                    objectFit="cover" 
                  />
                </Box>
              ) : (
                <Box 
                  width="32px" 
                  height="32px" 
                  borderRadius="full" 
                  bg="#5865F2" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  mr={2}
                >
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    {user.username?.charAt(0).toUpperCase()}
                  </Text>
                </Box>
              )}
              
              <Text color="white" mr={2}>
                {user.displayName || user.username}
              </Text>
              <Box as={FaChevronDown} color="gray.400" fontSize="12px" />
            </Flex>
            
            {isOpen && (
              <Box 
                position="absolute" 
                right="0" 
                mt={2} 
                bg="#1a202c" 
                borderRadius="md" 
                boxShadow="md" 
                borderWidth="1px" 
                borderColor="gray.700" 
                width="180px" 
                zIndex={10}
                overflow="hidden"
              >
                {!isDashboardPage && (
                  <Flex 
                    p={3} 
                    align="center" 
                    cursor="pointer" 
                    _hover={{ bg: "whiteAlpha.100" }}
                    onClick={navigateToDashboard}
                  >
                    <Box as={FaTachometerAlt} color="gray.400" mr={3} />
                    <Text color="white">Dashboard</Text>
                  </Flex>
                )}
                
                <Flex 
                  p={3} 
                  align="center" 
                  cursor="pointer" 
                  _hover={{ bg: "whiteAlpha.100" }}
                  onClick={handleLogout}
                >
                  <Box as={FaSignOutAlt} color="gray.400" mr={3} />
                  <Text color="white">Logout</Text>
                </Flex>
              </Box>
            )}
          </Box>
        ) : (
          <Button
            onClick={openLoginModal}
            variant="ghost"
            color="white"
            size="sm"
            _hover={{ bg: "whiteAlpha.200" }}
            display="flex"
            alignItems="center"
          >
            <Box as={FaUser} mr={2} />
            Log In
          </Button>
        )}
      </Flex>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        onDiscordLogin={handleDiscordLogin} 
      />
    </>
  );
};
