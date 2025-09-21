'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cards/product-card';
import { apiService } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from '@/hooks/use-debounce';
import { LoginModal } from '@/components/common/login-modal';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const searchTermToUse = debouncedSearchTerm.length >= 2 ? debouncedSearchTerm : '';

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products', { category, search: searchTermToUse }],
    queryFn: ({ pageParam = 0 }) =>
      apiService.getProducts({
        category: category || undefined,
        searchParam: searchTermToUse,
        page: pageParam,
        size: 6,
      }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (!pagination) return undefined;
      const { pageNumber, totalElements, pageSize } = pagination;
      if ((pageNumber + 1) * pageSize < totalElements) {
        return pageNumber + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const products = data?.pages.flatMap((page) => page.data).filter(Boolean) || [];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const pageTitle = category ? `${category} Products` : 'All Products';

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="mb-6 text-teal-600 hover:text-teal-700" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-black">{pageTitle}</h1>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for products "
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {status === 'pending' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : status === 'error' ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <p className="text-lg text-red-600">Error: {error.message}</p>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No products found {category && `in ${category}`} {searchTermToUse && `matching "${searchTermToUse}"`}.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/products">View All Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    whatsappNumber={whatsappNumber}
                  />
                ))}
              </div>
            )}
            <div className="flex justify-center mt-10">
              {hasNextPage && (
                <div ref={ref} className="w-full h-10 flex justify-center items-center">
                  {isFetchingNextPage && <p>Loading more products...</p>}
                </div>
              )}
              {!hasNextPage && products.length > 0 && (
                <p className="text-gray-500">You&apos;ve reached the end of the list.</p>
              )}
            </div>
          </>
        )}
        <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      </div>
    </div>
  );
}