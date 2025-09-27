'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { FAQ } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export default function FaqSection({ linkOnClick = false }: { linkOnClick?: boolean }) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchFaqs = async (pageNum: number) => {
    const response = await apiService.getFAQs({ page: pageNum, size: 5 });
    if (response.data.length > 0) {
      setFaqs(prev => [...prev, ...response.data]);
      setPage(pageNum);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchFaqs(0);
  }, []);

  const loadMore = () => {
    fetchFaqs(page + 1);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {linkOnClick ? (
            <Link href="/faq" className="inline-block text-center" aria-label="View all FAQs">
              <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 text-lg">
                Here are some of our most frequently asked questions. Tap to view the full list.
              </p>
            </Link>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 text-lg">
                Here are some of our most frequently asked questions. If you don't see the answer you're looking for, please feel free to contact us.
              </p>
            </>
          )}
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map(faq => (
            <AccordionItem value={faq.id} key={faq.id}>
              <AccordionTrigger className="text-black font-bold">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {hasMore && (
          <div className="text-center mt-8">
            {linkOnClick ? (
              // When displayed as a teaser on home, link to the full FAQ page
              <Link href="/faq" passHref>
                <Button asChild className="bg-black text-white hover:bg-gray-700" style={{ backgroundColor: '#13AF9E', textDecoration: 'underline', textDecorationColor: 'white' }}>
                  <a>View All FAQs</a>
                </Button>
              </Link>
            ) : (
              // When on the FAQ page, load the next page of FAQs
              <Button onClick={loadMore} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">Load More</Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
