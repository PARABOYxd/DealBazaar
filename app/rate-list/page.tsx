import { apiService } from '@/lib/api';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Rate List for Used Electronics and Furniture',
  description: 'Find out the estimated value for your used electronics and furniture. We offer competitive prices for a wide range of categories.',
  keywords: ['rate list', 'used electronics', 'used furniture', 'sell electronics', 'sell furniture', 'price list'],
};

export default async function RateListPage() {
  const categoriesResponse = await apiService.getCategories();
  const categories = categoriesResponse.data;

  if (!categories || categories.length === 0) {
    // Or show a message that the rate list is currently unavailable
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
            Our Rate List
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
            Get an estimate for your used electronics and furniture. Prices vary based on condition, brand, and model.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative w-full h-48">
                  <Image
                    src={category.image || '/images/placeholder-category.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <CardTitle className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                    {category.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3">{category.description}</p>
                <Button asChild className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                  <Link href={`/products?category=${category.slug}`}>
                    View Products in this Category
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-black">Ready to Sell?</h2>
          <p className="mt-2 text-lg text-gray-700">
            Request a pickup for your items today and get a final offer.
          </p>
          <Button asChild size="lg" className="mt-6 bg-teal-500 hover:bg-teal-600 text-white">
            <Link href="/pickup-request">Request a Pickup</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
