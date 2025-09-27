'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, X, Upload, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiService } from '@/lib/api';
import { PickupRequest } from '@/types';
import Image from 'next/image';
import { useAuth } from '@/components/providers/auth-provider';

const pickupSchema = z.object({
  // Removed address and email from schema as requested
  items: z.array(z.object({
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    condition: z.string().min(1, 'Condition is required'),
  })).min(1, 'At least one item is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  notes: z.string().optional(),
});

type PickupFormData = z.infer<typeof pickupSchema>;

interface PickupRequestFormProps {
  whatsappNumber: string;
  setIsLoginOpen: (isOpen: boolean) => void;
}

export function PickupRequestForm({ whatsappNumber, setIsLoginOpen }: PickupRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PickupFormData>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      items: [{ category: '', description: '', quantity: 1, condition: '' }],
    },
  });

  const watchedItems = watch('items');

  const categories = [
    'Electronics',
    'Furniture',
    'Appliances',
    'Mobile & Accessories',
    'Computer & Laptop',
    'TV & Audio',
    'Home Decor',
    'Other',
  ];

  const conditions = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
  ];

  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
  ];

  const addItem = () => {
    const currentItems = watchedItems || [];
    setValue('items', [...currentItems, { category: '', description: '', quantity: 1, condition: '' }]);
  };

  const removeItem = (index: number) => {
    const currentItems = watchedItems || [];
    if (currentItems.length > 1) {
      setValue('items', currentItems.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PickupFormData) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Upload images first if any
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const uploadResponse = await apiService.uploadImages(images);
        if (uploadResponse.status === 200) {
          imageUrls = uploadResponse.data.urls;
        }
      }

      const requestData: Omit<PickupRequest, 'id'> = {
        ...data,
        customerName: user.name,
        phone: user.phoneNumber || '', // Assuming phone number is in user object
        // Address and email removed from form but backend requires address; use user data or fallback
        address: (user as any)?.address || '',
        email: (user as any)?.email || undefined,
        city: 'N/A', // City is not in user object, to be discussed
        pincode: 'N/A', // Pincode is not in user object, to be discussed
        images: imageUrls,
      };

      const response = await apiService.createPickupRequest(requestData);

      if (response.status === 200) {
        setSubmitSuccess(true);
        reset();
        setImages([]);
      } else {
        setSubmitError(response.message || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hello! I want to schedule a pickup for my items. Can you help me?');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <Alert variant="default" className="max-w-md mx-auto mb-6">
          <AlertTitle>Request Submitted Successfully!</AlertTitle>
          <AlertDescription>
            We&apos;ve received your pickup request. Our team will contact you within 24 hours to confirm the details.
          </AlertDescription>
        </Alert>
        <div className="space-y-3 max-w-md mx-auto">
          <Button onClick={() => setSubmitSuccess(false)}>
            Submit Another Request
          </Button>
          <Button variant="outline" onClick={openWhatsApp} className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact on WhatsApp
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 sm:px-0"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Request Free Pickup</CardTitle>
          <p className="text-gray-600">
            Fill out the form below and we&apos;ll schedule a free pickup for your items
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{submitError}</AlertDescription>
                </Alert>
            )}
            {/* Address and Email fields removed as requested */}

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Items for Pickup *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {watchedItems?.map((_, index) => (
                <Card key={index} className="border-dashed">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Category *</Label>
                        <Select
                          onValueChange={(value) => setValue(`items.${index}.category`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Condition *</Label>
                        <Select
                          onValueChange={(value) => setValue(`items.${index}.condition`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((condition) => (
                              <SelectItem key={condition} value={condition}>
                                {condition}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Label>Description *</Label>
                        <Textarea
                          {...register(`items.${index}.description`)}
                          placeholder="Describe your item (brand, model, features, etc.)"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="1"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          placeholder="1"
                        />
                      </div>

                      {watchedItems.length > 1 && (
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {errors.items && (
                <p className="text-sm text-red-600">{errors.items.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Item Photos (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">Max 5 images, 5MB each</span>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pickup Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  {...register('preferredDate')}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.preferredDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.preferredDate.message}</p>
                )}
              </div>

              <div>
                <Label>Preferred Time *</Label>
                <Select
                  onValueChange={(value) => setValue('preferredTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.preferredTime && (
                  <p className="text-sm text-red-600 mt-1">{errors.preferredTime.message}</p>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any special instructions or additional information"
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 bg-black text-white hover:bg-black/80"
              >
                {isSubmitting ? 'Submitting...' : 'Schedule Pickup'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={openWhatsApp}
                className="w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Quick WhatsApp
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
