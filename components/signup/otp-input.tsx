'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // Removed this import
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

// Define the schema for this step's fields
const otpSchema = z.object({
  otp: z.string().min(4, 'OTP must be 4 digits').max(6, 'OTP must not exceed 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpInputProps {
  onNext: () => void;
  onBack: () => void;
}

export function OtpInput({ onNext, onBack }: OtpInputProps) {
  const { control, trigger, getValues } = useFormContext();

  const handleNext = async () => {
    const isValid = await trigger('otp');
    if (isValid) {
      console.log('Verifying OTP:', getValues('otp'));
      onNext();
    }
  };

  return (
    <div className="space-y-4"> {/* No <form> tag here */}
      <FormField
        control={control}
        name="otp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>OTP</FormLabel>
            <FormControl>
              <InputOTP maxLength={6} {...field}> {/* Replaced Input with InputOTP */}
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">Verify OTP</Button> {/* type="button" to prevent form submission */}
      </div>
    </div>
  );
}
