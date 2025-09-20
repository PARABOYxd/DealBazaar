'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { PickupRequestForm } from '@/components/forms/pickup-request-form';
import { generateSEO } from '@/lib/seo';
import { useAuth } from '@/components/providers/auth-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// We can't use generateSEO directly in a client component for metadata.
// This should be handled in a parent layout or page if possible.
// For now, we'll just have a static title.

export default function PickupRequestPage() {
  const { isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ phone: '', otp: '', name: '', email: '', location: '' });
  const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: OTP, 3: Details

  const handlePhoneSubmit = () => {
    if (loginData.phone.length === 10) {
      setLoginStep(2);
      // Here you would typically send OTP
    }
  };
  const handleOTPSubmit = () => {
    if (loginData.otp.length === 6) {
      setLoginStep(3);
    }
  };
  const handleDetailsSubmit = () => {
    setIsLoginOpen(false);
    setLoginStep(1);
    setLoginData({ phone: '', otp: '', name: '', email: '', location: '' });
  };

  if (typeof window !== 'undefined') {
    document.title = 'Free Pickup Request - Schedule Electronics & Furniture Collection';
  }

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
            <Button size="lg" onClick={() => setIsLoginOpen(true)}>Sign Up / Login</Button>
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogContent className="sm:max-w-md w-full mx-4">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-bold text-black">
                    {loginStep === 1 && "Login to Your Account"}
                    {loginStep === 2 && "Verify OTP"}
                    {loginStep === 3 && "Complete Your Profile"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {loginStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your 10-digit phone number"
                          value={loginData.phone}
                          onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                          className="mt-1"
                          maxLength={10}
                        />
                      </div>
                      <Button
                        onClick={handlePhoneSubmit}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                        disabled={loginData.phone.length !== 10}
                      >
                        Send OTP
                      </Button>
                    </div>
                  )}
                  {loginStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                          Enter OTP
                        </Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={loginData.otp}
                          onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                          className="mt-1 text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                      <div className="text-center">
                        <Button
                          variant="link"
                          className="text-teal-500 text-sm"
                          onClick={() => setLoginStep(1)}
                        >
                          Resend OTP
                        </Button>
                      </div>
                      <Button
                        onClick={handleOTPSubmit}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                        disabled={loginData.otp.length !== 6}
                      >
                        Verify OTP
                      </Button>
                    </div>
                  )}
                  {loginStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={loginData.name}
                          onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email (Optional)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                          Location
                        </Label>
                        <Input
                          id="location"
                          type="text"
                          placeholder="Enter your city"
                          value={loginData.location}
                          onChange={(e) => setLoginData({ ...loginData, location: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <Button
                        onClick={handleDetailsSubmit}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                        disabled={!loginData.name || !loginData.location}
                      >
                        Complete Registration
                      </Button>
                    </div>
                  )}
                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-gray-500 text-sm"
                      onClick={() => {
                        setIsLoginOpen(false);
                        setLoginStep(1);
                        setLoginData({ phone: '', otp: '', name: '', email: '', location: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}