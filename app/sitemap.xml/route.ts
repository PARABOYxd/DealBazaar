import { NextResponse } from 'next/server';
import { apiService } from '@/lib/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://electrofurni.com';

  // Static pages
  const staticPages = [
    '',
    '/products',
    '/pickup-request',
    '/about',
    '/contact',
    '/blog',
    '/faq',
  ];

  // Get dynamic pages from API
  let products: any[] = [];
  let blogPosts: any[] = [];

  try {
    const [productsResponse, blogResponse] = await Promise.all([
      apiService.getProducts({ size: 1000 }),
      apiService.getBlogPosts({ limit: 1000 }),
    ]);

    if (productsResponse.status === 200) {
      products = productsResponse.data;
    }

    if (blogResponse.status === 200) {
      blogPosts = blogResponse.data.posts;
    }
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${products
    .map(
      (product) => `
  <url>
    <loc>${baseUrl}/product/${product.slug}</loc>
    <lastmod>${product.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}