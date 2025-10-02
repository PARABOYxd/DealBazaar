'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { apiService } from '@/lib/api';
import { Product } from '@/types';
import { SubcategoryRequestForm } from '@/components/forms/subcategory-request-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SubcategoryClientPageProps {
  subcategorySlug: string;
}

export default function SubcategoryClientPage({ subcategorySlug }: SubcategoryClientPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subcategorySlug) {
      const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiService.getProductsBySubcategory(subcategorySlug, { size: 10, page: 0 });
          if (response.status === 200 && response.data) {
            setProducts(response.data);
          } else {
            setError(response.message || 'Failed to fetch products.');
          }
        } catch (err) {
          console.error('Error fetching subcategory products:', err);
          setError('An unexpected error occurred while fetching products.');
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [subcategorySlug]);

  const mainImage = products.length > 0 && products[0].images.length > 0
    ? `/public/images/${products[0].images[0]}` // Assuming images are in public/images
    : '/logo-compact.svg'; // Placeholder image

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4 capitalize">
            {subcategorySlug.replace(/-/g, ' ')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our range of {subcategorySlug.replace(/-/g, ' ')} and get a quote.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full" />
            <Card>
              <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-xl">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
              {products.length > 0 && products[0].images.length > 0 ? (
                <Image
                  src={`/${products[0].images[0]}`} // Next.js handles /public prefix automatically
                  alt={products[0].name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                  No Image Available
                </div>
              )}
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Inquire About {subcategorySlug.replace(/-/g, ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <SubcategoryRequestForm subcategory={subcategorySlug} products={products} whatsappNumber={whatsappNumber} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
