import { NextResponse } from 'next/server';

export function GET() {
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml
`;

  return new NextResponse(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}