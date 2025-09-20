'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, Zap, Star, Shield, ArrowRight, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { apiService } from '@/lib/api';

interface FooterProps {
  contactInfo: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export function Footer({ contactInfo }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    try {
      await apiService.subscribeNewsletter(email);
      setEmail('');
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Teal Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12 pt-12 pb-28">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-center md:text-left w-full"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-teal-400">ELECTRONICPICKUP</span>
                <span className="text-xs text-muted-foreground">Best Prices Guaranteed</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner for electronics and furniture pickup services.
              Get the best prices for your items with free doorstep collection across Mumbai.
            </p>

            {/* Trust Indicators */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-3 h-3 text-teal-400" />
                <span>Secure & Safe Transactions</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3 text-teal-400" />
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Award className="w-3 h-3 text-teal-400" />
                <span>Best Price Guarantee</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="ghost" size="lg" className="text-gray-400 hover:text-white hover:bg-teal-500/20 rounded-full p-3" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="lg" className="text-gray-400 hover:text-white hover:bg-teal-500/20 rounded-full p-3" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="lg" className="text-gray-400 hover:text-white hover:bg-teal-500/20 rounded-full p-3" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6 border-t border-gray-800 pt-8 md:border-t-0 md:pt-0 text-center md:text-left w-full"
          >
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'Pickup Request', href: '/pickup-request' },
                { name: 'Rate List', href: '/rate-list' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-teal-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 border-t border-gray-800 pt-8 md:border-t-0 md:pt-0 text-center md:text-left w-full"
          >
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-teal-400 mt-0.5 group-hover:text-teal-300 transition-colors" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  {contactInfo.address}, {contactInfo.city}, {contactInfo.state} - {contactInfo.pincode}
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-gray-400 hover:text-teal-400 text-sm transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <MessageCircle className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-teal-400 text-sm transition-colors"
                >
                  WhatsApp: {contactInfo.whatsapp}
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-400 hover:text-teal-400 text-sm transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6 border-t border-gray-800 pt-8 md:border-t-0 md:pt-0 text-center md:text-left w-full"
          >
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Subscribe to get updates on best prices, new services, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-teal-500"
                required
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
            </form>

            {/* Additional CTA */}
            <div className="pt-4 border-t border-gray-700">
              <Button
                asChild
                variant="outline"
                className="w-full border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white"
              >
                <Link href="/pickup-request">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Instant Quote
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 w-full md:w-auto">
              <p className="text-gray-400 text-sm">
                © {currentYear} ELECTRONICPICKUP. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Made with ❤️ in Mumbai</span>
                <span>•</span>
                <span>Best Prices Guaranteed</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 w-full md:w-auto items-center md:items-start">
              <Link href="/privacy" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}