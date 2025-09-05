'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, X, Upload, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { apiService } from '@/lib/api';
import { PickupRequest } from '@/types';

const pickupSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
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
}

export function PickupRequestForm({ whatsappNumber }: PickupRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);

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
    setIsSubmitting(true);
    
    try {
      // Upload images first if any
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const uploadResponse = await apiService.uploadImages(images);
        if (uploadResponse.success) {
          imageUrls = uploadResponse.data.urls;
        }
      }

      // Submit pickup request
      const requestData: Omit<PickupRequest, 'id'> = {
        ...data,
        images: imageUrls,
      };

      const response = await apiService.createPickupRequest(requestData);

      if (response.success) {
        setSubmitSuccess(true);
        reset();
        setImages([]);
      }
    } catch (error) {
      console.error('Form submission error:', error);
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
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Request Submitted Successfully!</h3>
          <p className="text-gray-600 mb-6">
            We've received your pickup request. Our team will contact you within 24 hours to confirm the details.
          </p>
          <div className="space-y-3">
            <Button onClick={() => setSubmitSuccess(false)}>
              Submit Another Request
            </Button>
            <Button variant="outline" onClick={openWhatsApp} className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact on WhatsApp
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Request Free Pickup</CardTitle>
          <p className="text-gray-600">
            Fill out the form below and we'll schedule a free pickup for your items
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  {...register('customerName')}
                  placeholder="Enter your full name"
                />
                {errors.customerName && (
                  <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="+91 9876543210"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Enter your complete address"
                  rows={2}
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    {...register('pincode')}
                    placeholder="400001"
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-600 mt-1">{errors.pincode.message}</p>
                  )}
                </div>
              </div>
            </div>

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
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
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
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Schedule Pickup'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={openWhatsApp}
                className="flex-1 sm:flex-initial"
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