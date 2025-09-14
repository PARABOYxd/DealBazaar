'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { FloatingActions } from './floating-actions';
import React from 'react';

interface LayoutWrapperProps {
  children: React.ReactNode;
  contactInfo: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export function LayoutWrapper({ children, contactInfo }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isSignupRoute = pathname.startsWith('/signup');

  return (
    <>
      {!isSignupRoute && (
        <Navbar
          whatsappNumber={contactInfo.whatsapp}
          phoneNumber={contactInfo.phone}
        />
      )}

      <main className={!isSignupRoute ? "pt-16" : ""}>
        {children}
      </main>

      {!isSignupRoute && (
        <>
          <Footer contactInfo={contactInfo} />
          <FloatingActions
            whatsappNumber={contactInfo.whatsapp}
            phoneNumber={contactInfo.phone}
          />
        </>
      )}
    </>
  );
}
