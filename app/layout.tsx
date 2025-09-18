import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/components/providers/query-provider';
import { Navbar } from '@/components/common/navbar';
import { Footer } from '@/components/common/footer';
import { FloatingActions } from '@/components/common/floating-actions';
import { Schema } from '@/components/ui/schema';
import { generateLocalBusinessSchema } from '@/lib/seo';
import { LayoutWrapper } from '@/components/common/layout-wrapper';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ElectroFurni Pickup - Best Prices for Electronics & Furniture | Mumbai',
  description: 'Get the best prices for your old electronics and furniture. Free doorstep pickup service in Mumbai. Instant quotes, hassle-free process. Contact us today!',
  keywords: 'electronics pickup, furniture pickup, sell old electronics, sell furniture, Mumbai, best prices, doorstep pickup, instant quotes',
  authors: [{ name: 'ElectroFurni Pickup' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'ElectroFurni Pickup',
    title: 'ElectroFurni Pickup - Best Prices for Electronics & Furniture',
    description: 'Get the best prices for your old electronics and furniture with free doorstep pickup service in Mumbai.',
    images: [
      {
        url: 'https://placehold.co/1200x630/png?text=ElectroFurni+Pickup',
        width: 1200,
        height: 630,
        alt: 'ElectroFurni Pickup - Electronics and Furniture Pickup Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElectroFurni Pickup - Best Prices for Electronics & Furniture',
    description: 'Get the best prices for your old electronics and furniture with free doorstep pickup service in Mumbai.',
    images: ['https://placehold.co/1200x630/png?text=ElectroFurni+Pickup'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'your-google-verification-code',
  },
};

// Static contact info - in production, this would come from your Java backend
const contactInfo = {
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+919876543210',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@electrofurni.com',
  address: process.env.NEXT_PUBLIC_ADDRESS || '123 Business Street, Andheri East',
  city: process.env.NEXT_PUBLIC_CITY || 'Mumbai',
  state: process.env.NEXT_PUBLIC_STATE || 'Maharashtra',
  pincode: process.env.NEXT_PUBLIC_PINCODE || '400093',
};

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
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <LayoutWrapper contactInfo={contactInfo}>
                {children}
              </LayoutWrapper>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}