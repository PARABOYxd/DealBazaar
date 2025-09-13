'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { Product } from '@/types';
import { notFound } from 'next/navigation';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+919876543210';

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Hello! I'm interested in the product "${product?.name}". Can you provide more details?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const makeCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-0 md:flex">
            <div className="relative w-full md:w-1/2 aspect-video md:aspect-square">
              <Image
                src={(product.images && product.images[0]) || '/images/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                priority
              />
            </div>

            <div className="w-full md:w-1/2 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <Badge variant="outline" className="text-sm">
                  {product.category}
                </Badge>
              </div>

              {product.brand && (
                <p className="text-lg text-gray-600">
                  Brand: <span className="font-semibold">{product.brand}</span>
                </p>
              )}

              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-green-600">
                  ₹{product.estimatePriceMin.toLocaleString()} - ₹{product.estimatePriceMax.toLocaleString()}
                </span>
                {product.condition && (
                  <Badge
                    className={`text-sm ${
                      product.condition === 'excellent'
                        ? 'bg-green-100 text-green-800'
                        : product.condition === 'good'
                        ? 'bg-blue-100 text-blue-800'
                        : product.condition === 'fair'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Condition: {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button size="lg" onClick={openWhatsApp} className="bg-green-500 hover:bg-green-600 text-white">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Get Quote on WhatsApp
                </Button>
                <Button size="lg" variant="outline" onClick={makeCall} className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
