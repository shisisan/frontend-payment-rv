import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';

import { Provider } from '@/components/ui/provider';
import { Layout } from '@/lib/layout';

type RootLayoutProps = {
  children: React.ReactNode;
};

const APP_NAME = 'nextarter-chakra';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discord Login Dashboard',
  description: 'A simple Discord login dashboard example',
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    url: 'https://nextarter-chakra.sznm.dev',
    title: 'nextarter-chakra',
    description: 'Next.js + chakra-ui + TypeScript template',
    images: {
      url: 'https://og-image.sznm.dev/**nextarter-chakra**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250',
      alt: 'nextarter-chakra.sznm.dev og-image',
    },
  },
  twitter: {
    creator: '@agstnsnathaniel',
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Provider>
            <Layout>{children}</Layout>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
