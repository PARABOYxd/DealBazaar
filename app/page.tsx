'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
  MessageCircle,
  Phone,
  CheckCircle,
  TrendingUp,
  Award,
  Truck,
  DollarSign,
  Heart,
  Smartphone,
  Laptop,
  Home as HomeIcon,
  Sofa,
  Camera,
  Headphones,
  Monitor,
  Gamepad2,
  Search,
  MapPin,
  Menu,
  ChevronDown,
  ArrowLeft,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { getHomePageData, type HomePageData } from '@/lib/api';
import LazyProductSection from '@/components/common/lazy-product-section';

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

  const { data: homeData = {} as HomePageData } = useQuery<HomePageData>({
    queryKey: ['homePageData'],
    queryFn: () => getHomePageData(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const testimonials = homeData.testimonials || [];

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

  const services = [
    { name: 'Sell Phone', icon: Smartphone, color: 'bg-teal-100' },
    { name: 'Sell Laptop', icon: Laptop, color: 'bg-teal-100' },
    { name: 'Sell Gadgets', icon: Camera, color: 'bg-teal-100' },
    { name: 'Sell Furniture', icon: Sofa, color: 'bg-teal-100' },
    { name: 'Sell Appliances', icon: HomeIcon, color: 'bg-teal-100' },
    { name: 'Sell Audio', icon: Headphones, color: 'bg-teal-100' },
    { name: 'Sell Monitors', icon: Monitor, color: 'bg-teal-100' },
    { name: 'Sell Gaming', icon: Gamepad2, color: 'bg-teal-100' },



  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Quotes',
      description: 'Get price quotes within minutes',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Best Prices',
      description: 'Highest market value guaranteed',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free Pickup',
      description: 'Doorstep service across Mumbai',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Support',
      description: 'Always here to help you',
    },
  ];

  return (
    <>

      {/* Mobile Search Bar (moved from Navbar) */}
      <div className="lg:hidden px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for electronics, furniture & more"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden">
        <div className="mt-2 lg:mt-16 xl:mt-15 mx-2 lg:mx-32">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {/* Banner 1 - Sell Phone */}
              <CarouselItem className="basis-full">
                <div className="bg-teal-500 text-white relative overflow-hidden rounded-t-3xl rounded-b-3xl">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 lg:py-8">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-8 lg:gap-12 items-center">
                      {/* Left Content */}
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-2 lg:space-y-8 text-center lg:text-left"
                      >
                        <div className="space-y-1 sm:space-y-2 lg:space-y-6">
                          <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-6xl font-bold leading-tight">
                            Sell Old <span className="text-white">Phone</span>
                          </h1>

                          <p className="text-[10px] sm:text-sm md:text-lg lg:text-xl text-teal-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            From Your Doorstep or At Any of our 200 Stores Pan India
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 justify-center lg:justify-start">
                          <Button
                            size="sm"
                            className="bg-black hover:bg-gray-800 text-white px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs md:px-8 md:py-4 md:text-lg font-semibold"
                            onClick={openWhatsApp}
                          >
                            Sell Now
                          </Button>
                        </div>
                      </motion.div>

                      {/* Right Content - Mobile Mockup */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-end"
                      >
                        <div className="relative w-32 h-32 sm:w-40 sm:h-48 md:w-60 md:h-56 lg:w-72 lg:h-72">
                          {/* Phone Outline */}
                          <div className="absolute inset-0 bg-black rounded-xl md:rounded-3xl p-1 sm:p-2 md:p-4">
                            <div className="bg-white rounded-lg md:rounded-2xl h-full p-1 sm:p-2 md:p-6 flex flex-col items-center justify-center space-y-1 md:space-y-4">
                              {/* Doorstep Pickup Badge */}
                              <div className="bg-teal-500 text-white px-1 py-0.5 md:px-4 md:py-2 rounded-md md:rounded-lg text-[8px] sm:text-[10px] md:text-sm font-semibold flex items-center gap-1 md:gap-2">
                                <Truck className="w-2 h-2 md:w-4 md:h-4" />
                                DOORSTEP PICKUP
                              </div>

                              {/* 200 Stores Badge */}
                              <div className="bg-teal-500 text-white px-1 py-0.5 md:px-4 md:py-2 rounded-md md:rounded-lg text-[8px] sm:text-[10px] md:text-sm font-semibold flex items-center gap-1 md:gap-2">
                                <MapPin className="w-2 h-2 md:w-4 md:h-4" />
                                200 STORES PAN INDIA
                              </div>
                            </div>
                          </div>

                          {/* Delivery Person Illustration */}
                          <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 md:-bottom-8 md:-right-4 w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-teal-600 rounded-full flex items-center justify-center">
                            <Truck className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Banner 2 - Sell Laptop */}
              <CarouselItem className="basis-full">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden rounded-t-3xl rounded-b-3xl">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 lg:py-8">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-8 lg:gap-12 items-center">
                      {/* Left Content */}
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-2 lg:space-y-8 text-center lg:text-left"
                      >
                        <div className="space-y-1 sm:space-y-2 lg:space-y-6">
                          <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-6xl font-bold leading-tight">
                            Sell Old <span className="text-white">Laptop</span>
                          </h1>

                          <p className="text-[10px] sm:text-sm md:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Get Best Prices for Your Old Laptop. Instant Quotes & Free Pickup
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 justify-center lg:justify-start">
                          <Button
                            size="sm"
                            className="bg-black hover:bg-gray-800 text-white px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs md:px-8 md:py-4 md:text-lg font-semibold"
                            onClick={openWhatsApp}
                          >
                            Get Quote
                          </Button>
                        </div>
                      </motion.div>

                      {/* Right Content - Laptop Mockup */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-end"
                      >
                        <div className="relative w-32 h-32 sm:w-40 sm:h-48 md:w-60 md:h-56 lg:w-72 lg:h-72">
                          {/* Laptop Outline */}
                          <div className="absolute inset-0 bg-gray-800 rounded-xl md:rounded-3xl p-1 sm:p-2 md:p-4">
                            <div className="bg-white rounded-lg md:rounded-2xl h-full p-1 sm:p-2 md:p-6 flex flex-col items-center justify-center space-y-1 md:space-y-4">
                              <Laptop className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-blue-600" />
                              <div className="text-center">
                                <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800">Best Price</div>
                                <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">Guaranteed</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Banner 3 - Sell Furniture */}
              <CarouselItem className="basis-full">
                <div className="bg-gradient-to-r from-green-600 to-green-800 text-white relative overflow-hidden rounded-t-3xl rounded-b-3xl">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 lg:py-8">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-8 lg:gap-12 items-center">
                      {/* Left Content */}
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-2 lg:space-y-8 text-center lg:text-left"
                      >
                        <div className="space-y-1 sm:space-y-2 lg:space-y-6">
                          <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-6xl font-bold leading-tight">
                            Sell Old <span className="text-white">Furniture</span>
                          </h1>

                          <p className="text-[10px] sm:text-sm md:text-lg lg:text-xl text-green-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Transform Your Space. Sell Old Furniture & Get Cash Instantly
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 justify-center lg:justify-start">
                          <Button
                            size="sm"
                            className="bg-black hover:bg-gray-800 text-white px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs md:px-8 md:py-4 md:text-lg font-semibold"
                            onClick={openWhatsApp}
                          >
                            Sell Furniture
                          </Button>
                        </div>
                      </motion.div>

                      {/* Right Content - Furniture Mockup */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-end"
                      >
                        <div className="relative w-32 h-32 sm:w-40 sm:h-48 md:w-60 md:h-56 lg:w-72 lg:h-72">
                          {/* Furniture Outline */}
                          <div className="absolute inset-0 bg-gray-800 rounded-xl md:rounded-3xl p-1 sm:p-2 md:p-4">
                            <div className="bg-white rounded-lg md:rounded-2xl h-full p-1 sm:p-2 md:p-6 flex flex-col items-center justify-center space-y-1 md:space-y-4">
                              <Sofa className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-green-600" />
                              <div className="text-center">
                                <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800">Free Pickup</div>
                                <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">Doorstep Service</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>

            {/* Carousel Navigation */}
            {/* <CarouselPrevious className="left-4 text-white" />
            <CarouselNext className="right-4 text-white" /> */}
          </Carousel>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Our Services Section - Mobile First */}
      <section className="py-12 bg-white mx-auto md:mx-32 lg:mx-32">
        <div className="mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-left mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">Our Services</h2>
            </div>
          </div>

          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Card className="bg-white border border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300 p-4 text-center group-hover:scale-105 rounded-xl">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600 group-hover:scale-110 transition-transform duration-300">
                    {React.createElement(service.icon, { className: "w-6 h-6" })}
                  </div>
                  <h3 className="font-semibold text-black text-xs">{service.name}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Product Sections */}
      <LazyProductSection title="Electronics" category="electronics" whatsappNumber={whatsappNumber} />
      <LazyProductSection title="Home Appliances" category="home-appliances" whatsappNumber={whatsappNumber} />
      <LazyProductSection title="Furniture" category="furniture" whatsappNumber={whatsappNumber} />

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg">We make selling your items simple and profitable</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-teal-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple 4-step process to sell your items</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Submit Request',
                description: 'Contact us via WhatsApp with item details and photos',
                icon: <MessageCircle className="w-8 h-8" />,
              },
              {
                step: '2',
                title: 'Get Quote',
                description: 'Receive instant price quote based on market value',
                icon: <DollarSign className="w-8 h-8" />,
              },
              {
                step: '3',
                title: 'Schedule Pickup',
                description: 'Choose convenient time for free doorstep pickup',
                icon: <Truck className="w-8 h-8" />,
              },
              {
                step: '4',
                title: 'Get Paid',
                description: 'Receive payment instantly after verification',
                icon: <CheckCircle className="w-8 h-8" />,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="bg-white border border-gray-200 p-8 h-full">
                  <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Statement */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by 157.52 Lac + Happy Users and Major Brands since 2015
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">11813.85Cr.</div>
              <div className="text-gray-400">Cash Given</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">175.02Lac</div>
              <div className="text-gray-400">Gadgets Encashed</div>
            </div>
          </div>

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <div className="relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">What Our Customers Say</h3>
              </div>

              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[plugin.current]}
                className="w-full max-w-6xl mx-auto"
              >
                <CarouselContent>
                  {testimonials.map((testimonial: import("@/types").Testimonial, index: number) => (
                    <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/4">
                      <div className="p-2 h-full">
                        <Card className="bg-white border border-gray-200 shadow-lg h-full flex flex-col">
                          <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div>
                              <div className="text-3xl text-blue-500 mb-2">"</div>
                              <p className="text-gray-600 mb-4 text-sm min-h-[48px] line-clamp-3">
                                {testimonial.comment}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3 mt-auto">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                                  {getInitials(testimonial.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-bold text-black text-xs">{testimonial.name}</div>
                                <div className="text-xs text-gray-600">{testimonial.location}</div>
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
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ready to Sell Your <span className="text-teal-400">Items</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get instant quotes and schedule free pickup today.
                Join thousands of satisfied customers across Mumbai.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 text-lg font-semibold"
                onClick={openWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link href="/pickup-request">
                  Schedule Pickup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Secure & Safe</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Award className="w-4 h-4 text-teal-400" />
                <span>Best Price Guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Teal Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500"></div>
      </section>


    </>
  );
}