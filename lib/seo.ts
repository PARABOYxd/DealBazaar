import { Metadata } from 'next';
import { Product, BlogPost } from '@/types';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateSEO({
  title,
  description,
  keywords,
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const siteName = 'ElectroFurni Pickup';
  const fullTitle = `${title} | ${siteName}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://electrofurni.com';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: fullUrl,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };

  if (type === 'article') {
    metadata.other = {};
    if (publishedTime) {
      metadata.other['article:published_time'] = publishedTime;
    }
    if (modifiedTime) {
      metadata.other['article:modified_time'] = modifiedTime;
    }
  }

  return metadata;
}

export function generateProductSEO(product: Product): Metadata {
  return generateSEO({
    title: `Buy ${product.name} | Best Price Guaranteed`,
    description: `${product.description.substring(0, 150)}... Get the best price for your ${product.name}. Free pickup service available.`,
    keywords: `${product.name}, ${product.category}, ${product.brand}, sell electronics, furniture pickup`,
    image: product.images[0],
    url: `/product/${product.slug}`,
    type: 'website',
  });
}

export function generateBlogSEO(post: BlogPost): Metadata {
  return generateSEO({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    image: post.featuredImage,
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
  });
}

// Schema.org structured data
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ElectroFurni Pickup',
    description: 'Professional electronics and furniture pickup service with best prices',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    telephone: '+91-9821816308',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'mogal lane opp. shivaji park, mumbai',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400016',
      addressCountry: 'IN',
    },
    openingHours: [
      'Mo-Sa 09:00-20:00',
      'Su 10:00-18:00',
    ],
    priceRange: '₹₹',
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png`,
    serviceArea: {
      '@type': 'City',
      name: 'Mumbai',
    },
  };
}

export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Various',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      lowPrice: product.estimatePriceMin,
      highPrice: product.estimatePriceMax,
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '123',
    },
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ElectroFurni Pickup',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
    },
  };
}