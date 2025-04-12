import { Flex, Link, Text } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center" py={6} borderTopWidth="1px" borderColor="gray.700">
      <Text fontSize="sm" color="text.secondary">
        {new Date().getFullYear()} -{' '}
        <Link
          href="https://agustinusnathaniel.com"
          target="_blank"
          rel="noopener noreferrer"
          color="text.accent"
          _hover={{ textDecoration: 'underline' }}
        >
          agustinusnathaniel.com
        </Link>
      </Text>
    </Flex>
  );
};
