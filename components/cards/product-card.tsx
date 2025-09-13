'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye } from 'lucide-react';
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
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(`Hi! I'm interested in selling my ${product.name}. Can you provide more details?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const conditionColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-yellow-100 text-yellow-800',
    poor: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <div className="relative w-full h-full bg-gray-100">
              <Image
                src={(product.images && product.images[0]) || '/images/placeholder-product.jpg'}
                alt={product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-300 group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </div>
          </Link>

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                asChild
              >
                <Link href={`/product/${product.slug}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button
                size="sm"
                onClick={openWhatsApp}
                className="bg-green-500 hover:bg-green-600"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Favorite Button */}
          {/* <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </Button> */}

          {/* Condition Badge */}
          {/* <Badge
            className={cn(
              "absolute top-2 left-2",
              conditionColors[product.condition]
            )}
          >
            {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
          </Badge> */}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              {product.brand && (
                <span className="text-xs text-gray-500">{product.brand}</span>
              )}
            </div>

            <Link href={`/product/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>

            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="text-lg font-bold text-green-600">
                ₹{product.estimatePriceMin.toLocaleString()} - ₹{product.estimatePriceMax.toLocaleString()}
              </div>
              <Button
                size="sm"
                onClick={openWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-xs px-3"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}