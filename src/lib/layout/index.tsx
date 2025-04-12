'use client';

import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { Footer } from './components/footer';
import { Header } from './components/header';
import { Toaster } from '@/components/ui/toaster';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box margin="0 auto" maxWidth={900} transition="0.5s ease-out" bg="#101826" color="white">
      <Box px={6} py={4}>
        <Header />
        <Toaster />
        <Box as="main" marginY={8}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};
