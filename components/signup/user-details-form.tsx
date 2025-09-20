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
const userDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  referralCode: z.string().max(20, 'Referral code must not exceed 20 characters').optional().or(z.literal('')),
});

type UserDetailsFormValues = z.infer<typeof userDetailsSchema>;

export function UserDetailsForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4"> {/* No <form> tag here */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-medium">Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Name" {...field} className="border-gray-300 focus:border-teal-500 focus:ring-teal-500" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-medium">Email (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="your@example.com" {...field} className="border-gray-300 focus:border-teal-500 focus:ring-teal-500" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="referralCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black font-medium">Referral Code (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter referral code" {...field} className="border-gray-300 focus:border-teal-500 focus:ring-teal-500" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
