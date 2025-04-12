import { Box, Flex, Heading } from '@chakra-ui/react';

export const Header = () => {
  return (
    <Flex as="header" width="full" align="center" justify="space-between" py={4}>
      <Heading size="md" color="text.accent">Discord Dashboard</Heading>
    </Flex>
  );
};
