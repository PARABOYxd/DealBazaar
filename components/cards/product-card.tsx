'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Tag, Star, Zap, ArrowRight, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  className?: string;
}

export function ProductCard({ product, whatsappNumber, className }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(`Hi! I'm interested in selling my ${product.name}. Can you provide more details and best price?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  // Simple pricing display without random generation
  const showPricing = product.estimatePriceMin && product.estimatePriceMax;

  const getImageUrl = (path?: string) => {
    if (!path) return '/images/placeholder-product.jpg';
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const imageUrl = getImageUrl(product.images?.[0]);

  const conditionColors = {
    excellent: 'bg-green-100 text-green-800 border-green-200',
    good: 'bg-blue-100 text-blue-800 border-blue-200',
    fair: 'bg-orange-100 text-orange-800 border-orange-200',
    poor: 'bg-red-100 text-red-800 border-red-200',
  };

  const categoryIcons = {
    electronics: <Zap className="w-4 h-4" />,
    'home-appliances': <Shield className="w-4 h-4" />,
    furniture: <Star className="w-4 h-4" />,
  };

  return (
    <Link href={`/products/${product.slug}`} passHref>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("group h-full cursor-pointer", className)}
      >
        <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl overflow-hidden h-full transition-all duration-300 rounded-xl flex flex-col">
          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <Image
              src={product.images && product.images[0] ? `/images/${product.images[0]}` : '/images/placeholder-product.jpg'}
              alt={product.name}
              fill
              className={cn(
                "object-contain transition-all duration-500 group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
          {/* Product Name */}
          <h3 className="font-bold text-black text-sm leading-tight flex-grow">
            {product.name}
          </h3>

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-medium">
              {product.category.replace('-', ' ').toUpperCase()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">4.9</span>
            </div>
          </div>

          {/* Pricing or Get Quote */}
          {showPricing ? (
            <div className="space-y-1">
              <div className="text-sm text-gray-600">Estimated Value</div>
              <div className="text-lg font-bold text-teal-600">
                ₹{product.estimatePriceMin?.toLocaleString()} - ₹{product.estimatePriceMax?.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-sm text-gray-600">Get Best Price</div>
              <div className="text-sm font-semibold text-teal-600">
                Contact for Quote
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={openWhatsApp}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 mt-auto"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Get Quote
          </Button>
        </CardContent>
      </Card>
    </motion.div>
    </Link>
  );
}