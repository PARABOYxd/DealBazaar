'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Pickup Request', href: '/pickup-request' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

interface NavbarProps {
  whatsappNumber: string;
  phoneNumber: string;
}

export function Navbar({ whatsappNumber, phoneNumber }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hello! I want to sell my electronics/furniture items.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const makeCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'bg-white/95 backdrop-blur-md shadow-lg'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <span
              className={cn(
                'text-xl font-bold transition-colors duration-300',
                'text-gray-900'
              )}
            >
              DealBazaar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200 relative text-gray-700 hover:text-blue-600',
                  {
                    'text-blue-600': pathname === item.href,
                  }
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                    initial={false}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="default" size="sm" asChild className="bg-blue-600 text-white hover:bg-blue-700">
              <Link href="/rate-list">Check Rate List</Link>
            </Button>
            <Button
              onClick={openWhatsApp}
              variant="outline"
              size="sm"
              className={cn(
                'flex items-center gap-2 transition-colors duration-300',
                'text-gray-800 border-gray-300 hover:bg-gray-100'
              )}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button
              onClick={makeCall}
              variant="outline"
              size="sm"
              className={cn(
                'flex items-center gap-2 transition-colors duration-300',
                'border-gray-800 text-gray-800 hover:bg-gray-100'
              )}
            >
              <Phone className="w-4 h-4" />
              Call Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="default" size="sm" asChild className="bg-blue-600 text-white hover:bg-blue-700">
                <Link href="/rate-list">Check Rate List</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'transition-colors duration-300',
                'text-gray-800 hover:bg-gray-100'
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t">
                <Button
                  onClick={openWhatsApp}
                  variant="outline"
                  className="flex items-center gap-2 justify-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button
                  onClick={makeCall}
                  className="flex items-center gap-2 justify-center"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
