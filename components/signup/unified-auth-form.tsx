'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PhoneInput } from './phone-input';
import { OtpInput } from './otp-input';
import { LocationInput } from './location-input';
import { UserDetailsForm } from './user-details-form';

interface UnifiedAuthFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isModal?: boolean;
}

// Optimized validation schemas
const authSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number required').regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'Invalid OTP'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode').optional().or(z.literal('')),
  currentLocation: z.string().optional(),
  name: z.string().min(2, 'Name required').max(50).regex(/^[a-zA-Z\s]+$/, 'Letters only'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  referralCode: z.string().max(20).optional().or(z.literal(''))
}).refine(data => data.pincode || data.currentLocation, {
  message: "Location required", path: ["pincode"]
});

type FormData = z.infer<typeof authSchema>;

const STEPS = {
  login: [
    { id: 'phone', title: 'Enter Phone Number', component: PhoneInput, fields: ['phoneNumber'] },
    { id: 'otp', title: 'Verify OTP', component: OtpInput, fields: ['otp'] }
  ],
  signup: [
    { id: 'phone', title: 'Enter Phone Number', component: PhoneInput, fields: ['phoneNumber'] },
    { id: 'otp', title: 'Verify OTP', component: OtpInput, fields: ['otp'] },
    { id: 'location', title: 'Add Location', component: LocationInput, fields: ['pincode', 'currentLocation'] },
    { id: 'details', title: 'Complete Profile', component: UserDetailsForm, fields: ['name', 'email', 'referralCode'] }
  ]
} as const;

export function UnifiedAuthForm({ onSuccess, onError, isModal }: UnifiedAuthFormProps) {
  const [authType, setAuthType] = useState<'login' | 'signup' | null>(isModal ? 'signup' : null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      phoneNumber: '', otp: '', pincode: '', currentLocation: '',
      name: '', email: '', referralCode: ''
    }
  });

  const currentStep = authType ? STEPS[authType][step] : null;
  const totalSteps = authType ? STEPS[authType].length : 0;
  const isLast = step === totalSteps - 1;

  const handleNext = async () => {
    if (!currentStep || loading) return;

    setLoading(true);
    const valid = await form.trigger(currentStep.fields as any);

    if (valid) {
      if (isLast) {
        try {
          const data = form.getValues();
          console.log('Auth Data:', data);
          await new Promise(resolve => setTimeout(resolve, 1000));
          onSuccess?.();
        } catch (error) {
          onError?.('Authentication failed');
        }
      } else {
        setStep(prev => prev + 1);
      }
    }
    setLoading(false);
  };

  const reset = () => {
    setAuthType(null);
    setStep(0);
    form.reset();
  };

  return (
    <FormProvider {...form}>
      <main className="max-w-md mx-auto p-4" role="main" aria-label="Authentication Form">
        <h1 className="sr-only">User Authentication</h1>

        {!authType ? (
          <Card className="p-6 space-y-6 bg-white border border-gray-200" role="region" aria-labelledby="auth-selection">
            <header className="text-center space-y-2">
              <h2 id="auth-selection" className="text-xl font-semibold text-black">Welcome Back</h2>
              <p className="text-gray-700">Choose your authentication method</p>
            </header>

            <nav className="flex flex-col space-y-3" aria-label="Authentication options">
              <Button
                type="button"
                onClick={() => setAuthType('login')}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                aria-describedby="login-desc"
              >
                Login to Account
              </Button>
              <p id="login-desc" className="sr-only">Login to your existing account using phone verification</p>

              <Button
                type="button"
                onClick={() => setAuthType('signup')}
                variant="outline"
                className="w-full border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white"
                aria-describedby="signup-desc"
              >
                Create New Account
              </Button>
              <p id="signup-desc" className="sr-only">Create a new account with phone verification and profile setup</p>
            </nav>
          </Card>
        ) : (
          <Card className="p-6 space-y-6 bg-white border border-gray-200" role="region" aria-labelledby="auth-form">
            <header className="text-center space-y-2">
              <h2 id="auth-form" className="text-lg font-semibold text-black">
                {authType === 'login' ? 'Account Login' : 'Account Registration'}
              </h2>
              <p className="text-sm text-gray-700" aria-live="polite">
                Step {step + 1} of {totalSteps}: {currentStep?.title}
              </p>
            </header>

            <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar"
              aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={totalSteps}
              aria-label={`Progress: ${step + 1} of ${totalSteps} steps completed`}>
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNext() }} noValidate>
              <AnimatePresence mode="wait">
                <motion.section
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[120px]"
                  aria-labelledby={`step-${currentStep?.id}`}
                >
                  <h3 id={`step-${currentStep?.id}`} className="sr-only">{currentStep?.title}</h3>
                  {currentStep && React.createElement(currentStep.component)}
                </motion.section>
              </AnimatePresence>

              <footer className="flex justify-between mt-6" role="group" aria-label="Form navigation">
                <div className="flex space-x-2">
                  {step > 0 && (
                    <Button
                      type="button"
                      onClick={() => setStep(prev => prev - 1)}
                      variant="outline"
                      disabled={loading}
                      aria-label="Go to previous step"
                    >
                      Back
                    </Button>
                  )}
                  {!isModal && <Button
                    type="button"
                    onClick={reset}
                    variant="ghost"
                    className="text-gray-500"
                    disabled={loading}
                    aria-label="Restart authentication process"
                  >
                    Start Over
                  </Button>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[80px] bg-teal-500 hover:bg-teal-600 text-white"
                  aria-label={isLast ? 'Submit form' : 'Continue to next step'}
                >
                  {loading ? 'Processing...' : (isLast ? 'Submit' : 'Continue')}
                </Button>
              </footer>
            </form>
          </Card>
        )}
      </main>
    </FormProvider>
  );
}