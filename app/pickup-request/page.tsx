import { Metadata } from 'next';
import { PickupRequestForm } from '@/components/forms/pickup-request-form';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Free Pickup Request - Schedule Electronics & Furniture Collection',
  description: 'Request free doorstep pickup for your electronics and furniture. Fill out our simple form and get the best prices with convenient pickup service in Mumbai.',
  keywords: 'pickup request, free pickup, electronics pickup, furniture pickup, doorstep collection, Mumbai pickup service',
  url: '/pickup-request',
});

export default function PickupRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Schedule Free Pickup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to request a free pickup for your electronics and furniture items. 
            Our team will contact you within 24 hours to confirm the details and provide a quote.
          </p>
        </div>
        
        <PickupRequestForm whatsappNumber="919876543210" />
      </div>
    </div>
  );
}