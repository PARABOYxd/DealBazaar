'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { PickupRequestForm } from '@/components/forms/pickup-request-form';
import { generateSEO } from '@/lib/seo';
import { useAuth } from '@/components/providers/auth-provider';
import { LoginModal } from '@/components/common/login-modal';
import { useRouter } from 'next/navigation';

// We can't use generateSEO directly in a client component for metadata.
// This should be handled in a parent layout or page if possible.
// For now, we'll just have a static title.

export default function PickupRequestPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Only run auth check once
    if (hasCheckedAuth) return;

    if (!isAuthenticated) {
      // User not logged in - show login modal
      setIsLoginOpen(true);
      setHasCheckedAuth(true);
      return;
    }

    if (!user) {
      // User data not available - show login modal
      setIsLoginOpen(true);
      setHasCheckedAuth(true);
      return;
    }

    // Check user profile status
    const userStatus = user.status || localStorage.getItem('user_profile_status');
    
    if (userStatus === 'PENDING' || userStatus === 'INITIATED' || userStatus === 'VERIFIED' || userStatus === 'STEP1') {
      // Profile not complete - show login modal in edit mode
      setIsLoginOpen(true);
      setHasCheckedAuth(true);
      return;
    }

    // If user is authenticated and profile is complete, show the form
    console.log('User authenticated and profile complete, showing pickup form');
    setHasCheckedAuth(true);
  }, [isAuthenticated, user, hasCheckedAuth]);

  if (typeof window !== 'undefined') {
    document.title = 'Free Pickup Request - Schedule Electronics & Furniture Collection';
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Schedule Free Pickup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to request a free pickup for your electronics and furniture items.
            Our team will contact you within 24 hours to confirm the details and provide a quote.
          </p>
        </div>
        <PickupRequestForm
          whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}
          setIsLoginOpen={setIsLoginOpen}
        />
        <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      </div>
    </div>
  );
}
