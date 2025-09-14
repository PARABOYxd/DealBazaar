'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the schema for this step's fields
const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must not exceed 15 digits').regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>; // Still useful for type inference

interface PhoneInputProps {
  onNext: () => void; // onNext no longer receives data directly, it's managed by parent form
}

export function PhoneInput({ onNext }: PhoneInputProps) {
  const { control, trigger, getValues } = useFormContext(); // Get form methods from context

  const handleNext = async () => {
    const isValid = await trigger('phoneNumber'); // Trigger validation for this field
    if (isValid) {
      console.log('Sending OTP to:', getValues('phoneNumber'));
      onNext(); // Call parent's onNext
    }
  };

  return (
    <div className="space-y-4"> {/* No <form> tag here */}
      <FormField
        control={control} // Use control from context
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="e.g., +919876543210" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Send OTP</Button> {/* type="button" to prevent form submission */}
    </div>
  );
}