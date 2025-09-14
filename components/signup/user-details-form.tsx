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
const userDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  referralCode: z.string().max(20, 'Referral code must not exceed 20 characters').optional().or(z.literal('')),
});

type UserDetailsFormValues = z.infer<typeof userDetailsSchema>;

interface UserDetailsFormProps {
  onNext: () => void; // onNext no longer receives data directly, it's managed by parent form
  onBack: () => void;
}

export function UserDetailsForm({ onNext, onBack }: UserDetailsFormProps) {
  const { control, trigger, getValues } = useFormContext();

  const handleNext = async () => {
    const isValid = await trigger(['name', 'email', 'referralCode']);
    if (isValid) {
      console.log('User details:', getValues('name'), getValues('email'), getValues('referralCode'));
      onNext(); // Call parent's onNext (which will be the final handleSubmit)
    }
  };

  return (
    <div className="space-y-4"> {/* No <form> tag here */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Name" {...field} />
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
            <FormLabel>Email (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="your@example.com" {...field} />
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
            <FormLabel>Referral Code (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter referral code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between mt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button> {/* type="button" to prevent form submission */}
      </div>
    </div>
  );
}