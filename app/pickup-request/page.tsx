'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { PickupRequestForm } from '@/components/forms/pickup-request-form';
import { generateSEO } from '@/lib/seo';
import { useAuth } from '@/components/providers/auth-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UnifiedAuthForm } from '@/components/signup/unified-auth-form';
import { Button } from '@/components/ui/button';

// We can't use generateSEO directly in a client component for metadata.
// This should be handled in a parent layout or page if possible.
// For now, we'll just have a static title.

export default function PickupRequestPage() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This is a workaround for the metadata. In a real app, you'd handle this differently.
  if (typeof window !== 'undefined') {
    document.title = 'Free Pickup Request - Schedule Electronics & Furniture Collection';
  }

  const handleAuthSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Schedule Free Pickup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to request a free pickup for your electronics and furniture items. 
            Our team will contact you within 24 hours to confirm the details and provide a quote.
          </p>
        </div>
        
        {isAuthenticated ? (
          <PickupRequestForm whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"} />
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">Please sign up or log in to request a pickup.</p>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg">Sign Up / Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Authentication</DialogTitle>
                </DialogHeader>
                <UnifiedAuthForm onSuccess={handleAuthSuccess} isModal={true} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}