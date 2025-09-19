'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Zap, Shield, Clock, MessageCircle, Phone, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/cards/product-card';
import { apiService } from '@/lib/api';
import { generateSEO } from '@/lib/seo';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Autoplay from "embla-carousel-autoplay";
import { useInView } from 'react-intersection-observer';
import { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  products: Product[];
  whatsappNumber: string;
}

const ProductSection = ({ title, products, whatsappNumber }: ProductSectionProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
        </motion.div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {Array.isArray(products) && products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/3 lg:basis-1/4">
                <ProductCard
                  product={product}
                  whatsappNumber={whatsappNumber}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (!api) {
      return;
    }
    if (inView) {
      api.plugins().autoplay?.play();
    } else {
      api.plugins().autoplay?.stop();
    }
  }, [api, inView]);

  const { data: electronicsData } = useQuery({
    queryKey: ['products', 'electronics'],
    queryFn: () => apiService.getProducts({ category: 'electronics' }),
  });

  const { data: homeAppliancesData } = useQuery({
    queryKey: ['products', 'home-appliances'],
    queryFn: () => apiService.getProducts({ category: 'home-appliances' }),
  });

  const { data: furnitureData } = useQuery({
    queryKey: ['products', 'furniture'],
    queryFn: () => apiService.getProducts({ category: 'furniture' }),
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => apiService.getTestimonials(9),
  });

  const electronics = electronicsData?.data || [];
  const homeAppliances = homeAppliancesData?.data || [];
  const furniture = furnitureData?.data || [];
  const testimonials = testimonialsData?.data || [];

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+919876543210';

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hello! I want to sell my electronics/furniture items. Can you help me get the best price?');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const makeCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const firstName = names[0] ?? '';
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Quotes',
      description: 'Get price quotes within minutes through WhatsApp or call',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Best Prices Guaranteed',
      description: 'We ensure you get the highest market value for your items',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Free Doorstep Pickup',
      description: 'Convenient pickup service at your preferred time',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0">


        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <Badge className="bg-green-500/20 text-green-100 border-green-400">
                🎉 Best Prices in Mumbai - Free Pickup Available!
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Sell Your <span className="text-green-400">Electronics</span>
                <br />& <span className="text-green-400">Furniture</span> Today
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                Get instant quotes and best market prices for your old items.
                Free doorstep pickup service across Mumbai.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold"
                onClick={openWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Quote on WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold"
                onClick={makeCall}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="px-8 py-4 text-lg font-semibold"
              >
                <Link href="/pickup-request">
                  Schedule Pickup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index + 0.5 }}
                  className="text-center space-y-3"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {electronics.length > 0 && (
        <ProductSection title="Electronics" products={electronics} whatsappNumber={whatsappNumber} />
      )}
      {homeAppliances.length > 0 && (
        <ProductSection title="Home Appliances" products={homeAppliances} whatsappNumber={whatsappNumber} />
      )}
      {furniture.length > 0 && (
        <ProductSection title="Furniture" products={furniture} whatsappNumber={whatsappNumber} />
      )}

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple 4-step process to sell your items and get the best prices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Submit Request',
                description: 'Fill out our form or contact us via WhatsApp with item details',
                icon: '📝',
              },
              {
                step: '2',
                title: 'Get Quote',
                description: 'Receive instant price quote based on item condition and market value',
                icon: '💰',
              },
              {
                step: '3',
                title: 'Schedule Pickup',
                description: 'Choose convenient time slot for free doorstep pickup service',
                icon: '🚚',
              },
              {
                step: '4',
                title: 'Get Paid',
                description: 'Receive payment instantly after item verification and pickup',
                icon: '✅',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                    {item.icon}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section ref={ref} className="py-20 bg-gray-50 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our customers love the seamless experience and the great value we provide.
              </p>
            </motion.div>

            <Carousel
              setApi={setApi}
              plugins={[plugin.current]}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                    <div className="p-4">
                      <Card className="h-full bg-white rounded-xl shadow-lg overflow-hidden">
                        <CardContent className="p-8 flex flex-col justify-between h-full">
                          <div className="flex-grow">
                            <Quote className="w-8 h-8 text-blue-500 mb-4" />
                            <p className="text-gray-700 italic text-lg mb-6">
                              &quot;{testimonial.comment}&quot;
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={testimonial.image} alt={testimonial.name} />
                              <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {testimonial.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {testimonial.location}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Sell Your Items?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get instant quotes and schedule free pickup today.
              Join thousands of satisfied customers across Mumbai.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 text-lg font-semibold"
                onClick={openWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link href="/pickup-request">
                  Schedule Pickup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
