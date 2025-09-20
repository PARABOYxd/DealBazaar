'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedAuthForm } from '@/components/signup/unified-auth-form';
import Image from 'next/image';

export default function SignUpPage() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push('/'); // Redirect to home page on success
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white">
      {/* Image Section */}
      <div className="hidden md:flex md:w-1/2 h-[80vh] bg-cover bg-center relative"
        style={{ backgroundImage: 'url("/images/signup.webp")' }}> {/* Placeholder image */}
      </div>

      {/* Sign Up Form Section */}
      <div className="w-full md:w-1/2 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 rounded-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
            <p className="text-gray-700">Join ELECTRONICPICKUP for the best prices</p>
          </div>
          <UnifiedAuthForm onSuccess={handleAuthSuccess} isModal={false} />
        </div>
      </div>
    </div>
  );
}
