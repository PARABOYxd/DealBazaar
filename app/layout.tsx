import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/components/providers/query-provider';
import { Navbar } from '@/components/common/navbar';
import { Footer } from '@/components/common/footer';
import { FloatingActions } from '@/components/common/floating-actions';
import { Schema } from '@/components/ui/schema';
import { generateLocalBusinessSchema } from '@/lib/seo';

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
        url: '/images/og-default.jpg',
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
    images: ['/images/og-default.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// Static contact info - in production, this would come from your Java backend
const contactInfo = {
  phone: '+919876543210',
  whatsapp: '919876543210',
  email: 'info@electrofurni.com',
  address: '123 Business Street, Andheri East',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400093',
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
          <div className="min-h-screen bg-gray-50">
            <Navbar
              whatsappNumber={contactInfo.whatsapp}
              phoneNumber={contactInfo.phone}
            />
            
            <main className="pt-16">
              {children}
            </main>
            
            <Footer contactInfo={contactInfo} />
            
            <FloatingActions
              whatsappNumber={contactInfo.whatsapp}
              phoneNumber={contactInfo.phone}
            />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}