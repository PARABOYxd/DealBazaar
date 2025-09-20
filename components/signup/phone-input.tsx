'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import * as z from 'zod';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
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

export function PhoneInput() {
  const { control } = useFormContext(); // Get form methods from context

  return (
    <div className="space-y-4"> {/* No <form> tag here */}
      <FormField
        control={control} // Use control from context
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-medium">Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="e.g., +919876543210" {...field} className="border-gray-300 focus:border-teal-500 focus:ring-teal-500" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}