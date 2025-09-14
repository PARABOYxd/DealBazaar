'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import step components
import { PhoneInput } from '@/components/signup/phone-input';
import { OtpInput } from '@/components/signup/otp-input';
import { LocationInput } from '@/components/signup/location-input';
import { UserDetailsForm } from '@/components/signup/user-details-form';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the overall schema for the signup form
const signUpSchema = z.object({
  phoneNumber: z.string()
    .min(1, 'Phone number is required') // Explicitly for required
    .refine(val => val.length === 0 || val.length >= 10, { // Only apply min length if not empty
      message: 'Phone number must be at least 10 digits',
    })
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
  otp: z.string().min(4, 'OTP is required').max(6, 'OTP must not exceed 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits').regex(/^\d+$/, 'Pincode must be numeric').optional().or(z.literal('')),
  currentLocation: z.string().optional(),
  name: z.string().min(2, 'Name is required').max(50, 'Name must not exceed 50 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  referralCode: z.string().max(20, 'Referral code must not exceed 20 characters').optional().or(z.literal('')),
}).refine(data => data.pincode || data.currentLocation, {
  message: "Either Pincode or Current Location is required",
  path: ["pincode"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const steps = [
  { id: 'phone', name: 'Phone Number', description: 'Enter your phone number' },
  { id: 'otp', name: 'Verify OTP', description: 'Enter the OTP sent to your phone' },
  { id: 'location', name: 'Location', description: 'Provide your location' },
  { id: 'details', name: 'Your Details', description: 'Enter your name and email' },
]; // Referral code is part of details form, so no separate step

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      phoneNumber: '',
      otp: '',
      pincode: '',
      currentLocation: '',
      name: '',
      email: '',
      referralCode: '',
    },
    mode: "onBlur", // Validate on blur
  });

  const { trigger, getValues, formState: { errors } } = methods;

  const handleNext = async () => {
    let isValid = false;
    switch (steps[currentStep].id) {
      case 'phone':
        isValid = await trigger('phoneNumber');
        break;
      case 'otp':
        isValid = await trigger('otp');
        break;
      case 'location':
        isValid = await trigger(['pincode', 'currentLocation']);
        break;
      case 'details':
        isValid = await trigger(['name', 'email', 'referralCode']);
        break;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      console.log("Validation errors:", errors);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (data: SignUpFormValues) => {
    // This is the final submission logic
    console.log('Final Form Data:', data);
    alert('Sign up complete! (This is a placeholder for API submission)');
    // In a real application, you would send this data to your backend API
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'phone':
        return <PhoneInput onNext={() => handleNext()} />;
      case 'otp':
        return <OtpInput onNext={() => handleNext()} onBack={handleBack} />;
      case 'location':
        return <LocationInput onNext={() => handleNext()} onBack={handleBack} />;
      case 'details':
        return <UserDetailsForm onNext={() => methods.handleSubmit(handleSubmit)()} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Image Section */}
      <div className="hidden md:flex md:w-2/3 h-screen bg-cover bg-center relative"
        style={{ backgroundImage: 'url("https://picsum.photos/seed/signup/1920/1080")' }}> {/* Placeholder image */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold text-center px-8">
            Sell Your Electronics & Furniture
          </h1>
        </div>
      </div>

      {/* Sign Up Form Section */}
      <div className="w-full md:w-1/3 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 rounded-lg"> {/* Removed bg-white */}
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">Sign Up</h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}