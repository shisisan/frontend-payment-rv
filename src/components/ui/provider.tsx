'use client';

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { useEffect } from 'react';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        background: { value: '#101826' },
        panel: { value: '#0a0e18' },
        primary: { value: '#5865F2' },
        'primary.hover': { value: '#4752C4' },
        'text.primary': { value: 'white' },
        'text.secondary': { value: '#CBD5E0' },
        // Skeleton colors
        'skeleton.startColor': { value: '#2D3748' },
        'skeleton.endColor': { value: '#4A5568' }
      },
      fonts: {
        heading: { value: 'system-ui, sans-serif' },
        body: { value: 'system-ui, sans-serif' },
      }
    },
    semanticTokens: {
      colors: {
        'chakra-body-bg': { 
          _light: { value: '#101826' }, 
          _dark: { value: '#101826' } 
        },
        'chakra-skeleton-startColor': {
          _light: { value: '#2D3748' },
          _dark: { value: '#2D3748' }
        },
        'chakra-skeleton-endColor': {
          _light: { value: '#4A5568' },
          _dark: { value: '#4A5568' }
        }
      }
    },
  },
  cssVarsPrefix: 'rv'
});

export function Provider(props: React.PropsWithChildren) {
  useEffect(() => {
    // Apply global styles
    const globalStyles = document.createElement('style');
    globalStyles.innerHTML = `
      body {
        background-color: #101826;
        color: white;
        min-height: 100vh;
      }
      html {
        min-height: 100vh;
      }
    `;
    document.head.appendChild(globalStyles);

    return () => {
      document.head.removeChild(globalStyles);
    };
  }, []);

  return (
    <ChakraProvider value={system}>
      {props.children}
    </ChakraProvider>
  );
}

