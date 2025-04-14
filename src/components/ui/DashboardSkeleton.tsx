'use client';

import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack
} from '@chakra-ui/react';

export const DashboardSkeleton = () => {
  // Custom properties for skeleton to make it more visible
  const skeletonProps = {
    startColor: "#2D3748",  // Darker start color
    endColor: "#4A5568",    // Lighter end color
    speed: 1.5,            // Slower animation for more visibility
  };

  return (
    <Container maxW="container.xl" py={10}>
      {/* Header Skeleton */}
      <Box mb={6}>
        <Skeleton height="36px" width="250px" {...skeletonProps} />
      </Box>

      {/* Search Bar Skeleton */}
      <Box mb={8}>
        <Skeleton height="40px" width="full" borderRadius="md" {...skeletonProps} />
      </Box>

      {/* Main Content - Grid Layout */}
      <Grid 
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={6}
        mb={10}
      >
        {/* Grid Items - Card Skeletons */}
        {Array.from({ length: 6 }).map((_, i) => (
          <GridItem key={i}>
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="lg" 
              bg="#0a0e18"
              height="100%"
              display="flex"
              flexDirection="column"
            >
              {/* Card Image/Header */}
              <Skeleton height="150px" mb={4} borderRadius="md" {...skeletonProps} />
              
              {/* Card Title */}
              <Skeleton height="24px" width="80%" mb={3} {...skeletonProps} />
              
              {/* Card Description */}
              <SkeletonText 
                mt={2} 
                noOfLines={3} 
                gap="3" 
                mb={4}
                {...skeletonProps}
              />
              
              {/* Card Footer - Stats or Actions */}
              <Flex mt="auto" justify="space-between">
                <Skeleton height="20px" width="30%" {...skeletonProps} />
                <Skeleton height="20px" width="30%" {...skeletonProps} />
              </Flex>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* User Profile Section (Reduced size but kept for continuity) */}
      <Box p={6} borderWidth="1px" borderRadius="lg" bg="#0a0e18" mb={6}>
        <Flex direction={{ base: 'column', md: 'row' }} align="center">
          {/* Avatar skeleton */}
          <SkeletonCircle 
            size="80px" 
            mr={{ base: 0, md: 6 }}
            mb={{ base: 4, md: 0 }}
            {...skeletonProps}
          />
          
          {/* User details skeleton */}
          <Box width="full">
            <Skeleton height="24px" width="200px" mb={2} {...skeletonProps} />
            <Skeleton height="18px" width="150px" mb={4} {...skeletonProps} />
            
            <Flex>
              <Skeleton height="32px" width="80px" mr={2} {...skeletonProps} />
              <Skeleton height="32px" width="80px" {...skeletonProps} />
            </Flex>
          </Box>
        </Flex>
      </Box>
      
      {/* Stats Section */}
      <Grid 
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={4}
        mb={6}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <GridItem key={i}>
            <Box p={4} borderWidth="1px" borderRadius="md" bg="#0a0e18">
              <Skeleton height="20px" width="60%" mb={2} {...skeletonProps} />
              <Skeleton height="32px" width="40%" {...skeletonProps} />
            </Box>
          </GridItem>
        ))}
      </Grid>
      
      {/* Activity Feed Section */}
      <Box p={4} borderWidth="1px" borderRadius="md" bg="#0a0e18" mb={6}>
        <Skeleton height="24px" width="180px" mb={4} {...skeletonProps} />
        
        {Array.from({ length: 3 }).map((_, i) => (
          <Flex key={i} mb={4} align="center">
            <SkeletonCircle size="40px" mr={4} {...skeletonProps} />
            <Box flex="1">
              <Skeleton height="18px" width="60%" mb={2} {...skeletonProps} />
              <Skeleton height="14px" width="80%" {...skeletonProps} />
            </Box>
            <Skeleton height="16px" width="60px" {...skeletonProps} />
          </Flex>
        ))}
      </Box>
    </Container>
  );
};

export default DashboardSkeleton; 