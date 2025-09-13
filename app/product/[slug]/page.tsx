import { apiService } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetailsClient from './product-details-client';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const productsData = await apiService.getProducts(); // Assuming getProducts fetches all products
  const products = productsData?.data || [];

  return products.map((product: { slug: string }) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = params;
  const productData = await apiService.getProductBySlug(slug);
  const product = productData?.data;

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.description,
    keywords: `${product.name}, ${product.category}, ${product.brand || ''}, electronics, furniture, sell, Mumbai`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const productData = await apiService.getProductBySlug(slug);
  const product = productData?.data;

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
