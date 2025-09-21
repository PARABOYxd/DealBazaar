'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { PickupRequestForm } from '@/components/forms/pickup-request-form';
import { generateSEO } from '@/lib/seo';
import { useAuth } from '@/components/providers/auth-provider';
import { LoginModal } from '@/components/common/login-modal';

// We can't use generateSEO directly in a client component for metadata.
// This should be handled in a parent layout or page if possible.
// For now, we'll just have a static title.

export default function PickupRequestPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  if (typeof window !== 'undefined') {
    document.title = 'Free Pickup Request - Schedule Electronics & Furniture Collection';
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
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
