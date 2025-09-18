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
const locationSchema = z.object({
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits').regex(/^\d+$/, 'Pincode must be numeric').optional().or(z.literal('')),
  currentLocation: z.string().optional(), // This will be set by geolocation API
}).refine(data => data.pincode || data.currentLocation, {
  message: "Either Pincode or Current Location is required",
  path: ["pincode"], // Attach error to pincode field
});

type LocationFormValues = z.infer<typeof locationSchema>;

export function LocationInput() {
  const { control, setValue, clearErrors, setError, getValues } = useFormContext();

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you would reverse geocode these coordinates to get a readable address/pincode
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          setValue('currentLocation', `Lat: ${latitude}, Lon: ${longitude}`);
          clearErrors('pincode'); // Clear pincode error if location is obtained
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('pincode', { type: 'manual', message: 'Could not get current location.' });
        }
      );
    } else {
      setError('pincode', { type: 'manual', message: 'Geolocation is not supported by your browser.' });
    }
  };

  return (
    <div className="space-y-4"> {/* No <form> tag here */}
      <FormField
        control={control}
        name="pincode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pincode</FormLabel>
            <FormControl>
              <Input placeholder="Enter Pincode" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="text-center my-2">OR</div>
      <Button type="button" onClick={handleGetCurrentLocation} className="w-full" variant="outline">
        Get Current Location
      </Button>
      {getValues('currentLocation') && (
        <p className="text-sm text-gray-600">Current Location: {getValues('currentLocation')}</p>
      )}
    </div>
  );
}
