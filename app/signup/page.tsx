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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Image Section */}
      <div className="hidden md:flex md:w-1/2 h-[80vh] bg-cover bg-center relative"
        style={{ backgroundImage: 'url("/images/signup.webp")' }}> {/* Placeholder image */}
      </div>

      {/* Sign Up Form Section */}
      <div className="w-full md:w-1/3 py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-md p-8 rounded-lg mx-auto">
          <UnifiedAuthForm onSuccess={handleAuthSuccess} isModal={false} />
        </div>
      </div>
    </div>
  );
}
