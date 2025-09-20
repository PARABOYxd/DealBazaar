'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import * as z from 'zod';

import { Label } from '@/components/ui/label';
import {
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

export function OtpInput() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4"> {/* No <form> tag here */}
      <FormField
        control={control}
        name="otp"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel className="text-black font-medium">OTP</FormLabel>
            <FormControl>
              <InputOTP maxLength={6} {...field} className="mx-auto"> {/* Replaced Input with InputOTP */}
                <InputOTPGroup className="flex flex-wrap justify-center">
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
    </div>
  );
}