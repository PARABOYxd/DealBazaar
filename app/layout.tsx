import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/components/providers/query-provider';
import { Navbar } from '@/components/common/navbar';
import { Footer } from '@/components/common/footer';
import { FloatingActions } from '@/components/common/floating-actions';
import { Schema } from '@/components/ui/schema';
import { generateLocalBusinessSchema } from '@/lib/seo';
import contactConfig from '@/lib/config';
import { LayoutWrapper } from '@/components/common/layout-wrapper';
import { AuthProvider } from '@/components/providers/auth-provider';
import { PerformanceMonitor } from '@/components/common/performance-monitor';
import { ErrorBoundary } from '@/components/common/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bhej Do - Schedule Free Pickup for Electronics & Furniture',
  description: 'Bhej Do - schedule free doorstep pickup for your electronics and furniture. Get instant quotes and hassle-free collection.',
  keywords: 'bhej do, pickup, electronics pickup, furniture pickup, schedule pickup',
  authors: [{ name: 'Bhej Do' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Bhej Do',
    title: 'Bhej Do - Free Pickup for Electronics & Furniture',
    description: 'Schedule free doorstep pickup for electronics and furniture with Bhej Do.',
    images: [
      {
        url: 'https://placehold.co/1200x630/png?text=Bhej+Do',
        width: 1200,
        height: 630,
        alt: 'Bhej Do - Free Pickup Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  title: 'Bhej Do - Free Pickup for Electronics & Furniture',
  description: 'Schedule free doorstep pickup for electronics and furniture with Bhej Do.',
  images: ['https://placehold.co/1200x630/png?text=Bhej+Do'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'your-google-verification-code',
  },
};

// Centralized contact info
const contactInfo = contactConfig;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Schema data={generateLocalBusinessSchema()} />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL} />
        <meta name="theme-color" content="#1e40af" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                <LayoutWrapper contactInfo={contactInfo}>
                  {children}
                </LayoutWrapper>
              </div>
              <PerformanceMonitor />
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}