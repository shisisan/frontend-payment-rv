'use client';

import { Box, Center } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// Define keyframes for cube animation
const rotateKeyframes = keyframes`
  0% { transform: rotateX(-30deg) rotateY(0deg); }
  100% { transform: rotateX(-30deg) rotateY(360deg); }
`;

const pulseKeyframes = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

export const Loading = () => {
  const bgColor = '#101826'; // Match the app background color
  const primaryColor = '#5865F2'; // Discord primary color
  const secondaryColor = '#4752C4'; // Darker shade for contrast
  const tertiaryColor = '#7289DA'; // Another Discord color

  const rotateAnimation = `${rotateKeyframes} 3s infinite linear`;
  const pulseAnimation = `${pulseKeyframes} 1.5s infinite ease-in-out`;

  return (
    <Box 
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="9999"
      bg={bgColor}
      margin="0"
      padding="0"
      overflow="hidden"
    >
      <Center 
        w="100%" 
        h="100%"
      >
        <Box position="relative" w="100px" h="100px" transform="perspective(800px)">
          {/* Top */}
          <Box
            position="absolute"
            top="0"
            left="20px"
            width="60px"
            height="60px"
            bg={primaryColor}
            transform="rotateX(90deg) translateZ(30px)"
            animation={rotateAnimation}
            opacity={0.9}
          />
          
          {/* Bottom */}
          <Box
            position="absolute"
            bottom="0"
            left="20px"
            width="60px"
            height="60px"
            bg={secondaryColor}
            transform="rotateX(90deg) translateZ(-30px)"
            animation={rotateAnimation}
            opacity={0.9}
          />
          
          {/* Front */}
          <Box
            position="absolute"
            top="20px"
            left="20px"
            width="60px"
            height="60px"
            bg={tertiaryColor}
            transform="translateZ(30px)"
            animation={rotateAnimation}
            opacity={0.8}
          />
          
          {/* Back */}
          <Box
            position="absolute"
            top="20px"
            left="20px"
            width="60px"
            height="60px"
            bg={tertiaryColor}
            transform="translateZ(-30px)"
            animation={rotateAnimation}
            opacity={0.8}
          />
          
          {/* Left */}
          <Box
            position="absolute"
            top="20px"
            left="0"
            width="60px"
            height="60px"
            bg={primaryColor}
            transform="rotateY(90deg) translateZ(30px)"
            animation={rotateAnimation}
            opacity={0.8}
          />
          
          {/* Right */}
          <Box
            position="absolute"
            top="20px"
            right="0"
            width="60px"
            height="60px"
            bg={secondaryColor}
            transform="rotateY(90deg) translateZ(-30px)"
            animation={rotateAnimation}
            opacity={0.8}
          />
          
          {/* Center Core */}
          <Box
            position="absolute"
            top="35px"
            left="35px"
            width="30px"
            height="30px"
            borderRadius="50%"
            bg="white"
            animation={pulseAnimation}
            zIndex={10}
          />
        </Box>
      </Center>
    </Box>
  );
};

export default Loading; 