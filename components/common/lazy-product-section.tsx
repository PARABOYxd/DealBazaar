
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { apiService } from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/cards/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ProductSectionProps {
  title: string;
  products: Product[];
  whatsappNumber: string;
}

const ProductSection = ({ title, products, whatsappNumber }: ProductSectionProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section className="pt-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">{title}</h2>
            <p className="text-gray-600">Best prices guaranteed</p>
          </div>
          <Button variant="outline" asChild className="border-black text-black hover:bg-black hover:text-white">
            <Link href="/products">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {Array.isArray(products) && products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard
                  product={product}
                  whatsappNumber={whatsappNumber}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" /> */}
        </Carousel>
      </div>
    </section>
  );
};


interface LazyProductSectionProps {
  title: string;
  category: string;
  whatsappNumber: string;
}

const LazyProductSection = ({ title, category, whatsappNumber }: LazyProductSectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', category],
    queryFn: () => apiService.getSubcategory({ category, size: 6 }),
    enabled: inView,
  });

  const products = data?.data || [];

  if (isLoading) {
    return (
      <div ref={ref} className=" bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">{title}</h2>
              <p className="text-gray-600">Best prices guaranteed</p>
            </div>
            <Button variant="outline" asChild className="border-black text-black hover:bg-black hover:text-white">
              <Link href="/products">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div ref={ref} className="pt-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black mb-2">{title}</h2>
          <p>Could not load products.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <ProductSection title={title} products={products} whatsappNumber={whatsappNumber} />
    </div>
  );
};

export default LazyProductSection;
