'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, X, Upload, AlertCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiService } from '@/lib/api';
import { Product, PickupRequest, ScheduleRequest } from '@/types';
import Image from 'next/image';

const formSchema = z.object({
  productId: z.string().min(1, 'Please select a product.'),
  variantId: z.string().optional(),
  condition: z.string().min(1, 'Condition is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  sellingPrice: z.number().min(0, 'Selling price cannot be negative').optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SubcategoryRequestFormProps {
  subcategory: string;
  products: Product[];
  whatsappNumber: string;
}

export function SubcategoryRequestForm({ subcategory, products, whatsappNumber }: SubcategoryRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      condition: '',
      quantity: 1,
      preferredDate: '',
      preferredTime: '',
      sellingPrice: undefined,
      notes: '',
    },
  });

  const selectedProductId = watch('productId');
  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);

  const conditions = ['Excellent', 'GOOD', 'Fair', 'Poor'];

  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello! I have an inquiry about ${subcategory.replace(/-/g, ' ')} products.` +
        (selectedProduct ? ` Product: ${selectedProduct.name}` : '') +
        (selectedProduct && watch('variantId')
          ? ` Variant: ${selectedProduct.variants?.find(v => v.id.toString() === watch('variantId'))?.name}`
          : '') +
        `
Condition: ${watch('condition')}` +
        `
Quantity: ${watch('quantity')}` +
        `
Preferred Date: ${watch('preferredDate')}` +
        `
Preferred Time: ${watch('preferredTime')}` +
        (watch('sellingPrice') ? `
Selling Price: ${watch('sellingPrice')}` : '') +
        (watch('notes') ? `
Notes: ${watch('notes')}` : '')
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const requestData = {
        items: [
          {
            category: subcategory,
            product: selectedProduct?.name || 'N/A',
            brand: selectedProduct?.brand || undefined,
            variant: selectedProduct && watch('variantId')
              ? selectedProduct.variants?.find(v => v.id.toString() === watch('variantId'))?.name
              : undefined,
            desc: data.notes || 'No additional notes',
            quantity: data.quantity,
            condition: data.condition,
          },
        ],
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        existingAddress: false, 
        addressId: undefined, 
        pincode: 'N/A', 
        alternateMobileNo: 'N/A', 
        additionalNotes: data.notes,
        userPrice: data.sellingPrice,
      };

      const response = await apiService.createScheduleRequestWithImages(requestData, images);

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

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <Alert variant="default" className="mb-4">
          <AlertTitle>Request Submitted Successfully!</AlertTitle>
          <AlertDescription>
            We&apos;ve received your inquiry for {subcategory.replace(/-/g, ' ')} products. Our team will
            contact you shortly.
          </AlertDescription>
        </Alert>
        <Button onClick={() => setSubmitSuccess(false)}>Submit Another Inquiry</Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {products && products.length > 0 && (
          <div className="mb-4">
            <Label htmlFor="productId">Product</Label>
            <Select
              onValueChange={(value) => {
                setValue('productId', value);
                setValue('variantId', '');
              }}
              value={selectedProductId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && <p className="text-sm text-red-600 mt-1">{errors.productId.message}</p>}
          </div>
        )}

        {selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0 && (
          <div className="mb-4">
            <Label htmlFor="variantId">Variant</Label>
            <Select onValueChange={(value) => setValue('variantId', value)} value={watch('variantId')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a variant" />
              </SelectTrigger>
              <SelectContent>
                {selectedProduct.variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id.toString()}>
                    {variant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.variantId && <p className="text-sm text-red-600 mt-1">{errors.variantId.message}</p>}
          </div>
        )}

        {/* Condition and Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Condition *</Label>
            <Select onValueChange={(value) => setValue('condition', value)} value={watch('condition')}>
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
            {errors.condition && <p className="text-sm text-red-600 mt-1">{errors.condition.message}</p>}
          </div>

          <div>
            <Label>Quantity *</Label>
            <Input type="number" min="1" {...register(`quantity`, { valueAsNumber: true })} placeholder="1" />
            {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>}
          </div>
        </div>

        {/* Item Photos */}
        <div className="space-y-4 mb-4">
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
                <div key={index} className="relative overflow-hidden rounded bg-gray-50">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="object-cover w-full h-32 md:h-24"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 w-6 h-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferred Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <Select onValueChange={(value) => setValue('preferredTime', value)} value={watch('preferredTime')}>
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
            {errors.preferredTime && <p className="text-sm text-red-600 mt-1">{errors.preferredTime.message}</p>}
          </div>
        </div>

        {/* Selling Price */}
        <div className="mb-4">
          <Label htmlFor="sellingPrice">At what price do you want to sell it? (Optional)</Label>
          <Input
            id="sellingPrice"
            type="number"
            min="0"
            {...register('sellingPrice', { valueAsNumber: true })}
            placeholder="e.g., 5000"
          />
          {errors.sellingPrice && <p className="text-sm text-red-600 mt-1">{errors.sellingPrice.message}</p>}
        </div>

        {/* Additional Notes */}
        <div className="mb-4">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Any special instructions or additional information"
            rows={3}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" className="w-full sm:flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Query'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={openWhatsApp}
            className="w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Quick Quote
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
