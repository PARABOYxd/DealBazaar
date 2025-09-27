"use client";

import React from 'react';
import { SEOHead } from '@/components/common/seo-head';
import { LayoutWrapper } from '@/components/common/layout-wrapper';
import contactConfig from '@/lib/config';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';

export default function AboutPage() {
  const contactInfo = {
    phone: contactConfig.phone,
    whatsapp: contactConfig.whatsapp,
    email: contactConfig.email,
    address: contactConfig.address,
    city: contactConfig.city,
    state: contactConfig.state,
    pincode: contactConfig.pincode,
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hi, I want to schedule a pickup.');
    const raw = contactConfig.whatsapp.startsWith('+')
      ? contactConfig.whatsapp.replace('+', '')
      : contactConfig.whatsapp;

    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/${raw}?text=${message}`, '_blank');
    }
  };

  return (
    <LayoutWrapper contactInfo={contactInfo}>
      <SEOHead
        title="About Us"
        description={`Bhej Do — Trusted pickup service for electronics and furniture in ${contactConfig.city}.`}
      />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-sky-100 via-white to-sky-50">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/logo-compact.svg"
                alt="Logo"
                width={64}
                height={64}
                className="drop-shadow-md"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
              Bhej Do  Best in {contactConfig.city}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600">
              Quick quotes • Free doorstep pickup • Safe & trusted transactions
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href={`tel:${contactConfig.phone}`}>
                <Button className="px-8 py-4 text-lg font-semibold shadow-md rounded-xl">
                  <Phone className="w-5 h-5 mr-2" />
                  {contactConfig.phone}
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={openWhatsApp}
                className="px-7 py-4 text-lg font-semibold border-2 rounded-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Available 9:00 AM - 9:00 PM • Serving {contactConfig.city} and
              nearby areas
            </p>
          </div>
        </div>
      </header>

      {/* About Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Who we are
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are a local team focused on making it effortless to sell your
              used electronics and furniture. From free pickup to fast payments,
              our process is transparent and customer-first. We provide fair,
              instant quotes and handle logistics so you don’t have to.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
              Our Promise
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>Honest evaluation and market-relevant prices</li>
              <li>Fast, contactless doorstep pickup</li>
              <li>Secure payments and clear documentation</li>
              <li>Environmentally responsible disposal and recycling</li>
            </ul>
          </div>

          {/* Sidebar */}
          <aside className="bg-white border border-gray-100 p-8 rounded-2xl shadow-md">
            <h4 className="text-xl font-bold mb-5 text-gray-900">
              Why we’re the best in the area
            </h4>
            <ul className="text-gray-700 space-y-3">
              <li>Experienced evaluators with fair pricing</li>
              <li>Quick scheduling — same-week pickups</li>
              <li>Dedicated customer support</li>
            </ul>

            <div className="mt-8 space-y-3">
              <a href={`tel:${contactConfig.phone}`} className="block">
                <Button className="w-full py-4 font-semibold rounded-xl shadow-md">
                  Call Now • {contactConfig.phone}
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={openWhatsApp}
                className="w-full py-4 font-semibold border-2 rounded-xl"
              >
                Message on WhatsApp
              </Button>
            </div>
          </aside>
        </section>

        {/* Services */}
        <section className="mt-20">
          <h3 className="text-3xl font-bold mb-8 text-gray-900">
            Our Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Electronics',
                desc: 'Phones, laptops, home appliances, and more.',
              },
              {
                title: 'Furniture',
                desc: 'Sofas, tables, beds — we pickup large items too.',
              },
              {
                title: 'Secure Payments',
                desc: 'Cash, bank transfer or UPI — your choice.',
              },
              {
                title: 'Recycling',
                desc: 'Responsible disposal for unusable items.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-lg text-gray-900">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </LayoutWrapper>
  );
}
