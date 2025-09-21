'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageCircle, Zap, Star, Shield, ChevronDown, User, LogOut, Settings, Search, MapPin, CheckCircle, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';
import { apiService } from '@/lib/api';
import { LoginModal } from './login-modal';

const navigation = [
  { name: 'All', href: '/' },
  { name: 'Sell Electronics', href: '/products?category=electronics' },
  { name: 'Sell Furniture', href: '/products?category=furniture' },
  { name: 'Sell Appliances', href: '/products?category=home-appliances' },
  // { name: 'Rate List', href: '/rate-list' }, // commented out as per user request
  // { name: 'Schedule Pickup', href: '/pickup-request' }, // moved to button below
];

interface NavbarProps {
  whatsappNumber: string;
  phoneNumber: string;
}

export function Navbar({ whatsappNumber, phoneNumber }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hello! I want to sell my electronics/furniture items. Can you help me get the best price?');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const makeCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleLogin = () => setIsLoginOpen(true);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 hidden lg:block"
      >
        {/* Top Bar */}
        <div className="bg-gray-50 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-teal-600 font-bold text-lg">ELECTRONICPICKUP</span>
              </Link>
              {/* Search Bar */}
              <div className="flex-1 max-w-xl mx-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for electronics, furniture & more"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Right Side - Location & Login */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>Mumbai</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-sm"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        {/* This section is now removed as per user request */}

        {/* Navigation */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              {/* Navigation Links */}
              <nav className="flex items-center space-x-8">
                {navigation.map((item) => {
                  if (item.name === 'Sell Electronics') {
                    return (
                      <DropdownMenu key={item.name}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center text-sm font-medium">
                            {item.name}
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=phone">Sell Phone</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=laptop">Sell Laptop</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=gadgets">Sell Gadgets</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=home-appliances">Sell Appliances</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }
                  if (item.name === 'Sell Furniture') {
                    return (
                      <DropdownMenu key={item.name}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center text-sm font-medium">
                            {item.name}
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=sofa">Sell Sofa</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=table">Sell Table</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=chair">Sell Chair</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=bed">Sell Bed</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }
                  if (item.name === 'Sell Appliances') {
                    return (
                      <DropdownMenu key={item.name}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center text-sm font-medium">
                            {item.name}
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=ac">Sell AC</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=fridge">Sell Fridge</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=washing-machine">Sell Washing Machine</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/products?category=microwave">Sell Microwave</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }
                  // Default: normal link
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center text-sm font-medium transition-colors duration-200',
                        pathname === item.href
                          ? 'text-teal-600'
                          : 'text-gray-600 hover:text-teal-500'
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              {/* WhatsApp and Call Buttons */}
              <div className="flex items-center space-x-4 ml-8">
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2"
                  onClick={openWhatsApp}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-4 py-2"
                  onClick={makeCall}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Link href="/pickup-request" className="block">
                  <Button className="bg-black hover:bg-gray-800 text-white px-4 py-2 ml-2">
                    Schedule Pickup
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 lg:hidden"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-teal-600 font-bold text-lg">ELECTRONICPICKUP</span>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-56px)] overflow-y-auto pb-24"
            >
              <div className="px-4 py-6 space-y-4">


                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                        pathname === item.href
                          ? 'text-teal-600 bg-teal-50'
                          : 'text-gray-600 hover:text-teal-500 hover:bg-gray-50'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Button
                    onClick={openWhatsApp}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 justify-center py-2 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Quote
                  </Button>
                  <Button
                    onClick={makeCall}
                    variant="outline"
                    className="w-full border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white flex items-center gap-2 justify-center py-2 text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                  <Link
                    href="/pickup-request"
                    className="w-full block"
                  >
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white flex items-center gap-2 justify-center py-2 text-sm"
                    >
                      Schedule Pickup
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className={cn(
              'flex flex-col items-center py-2 px-3 transition-colors',
              pathname === '/' ? 'text-teal-500' : 'text-gray-600'
            )}
          >
            <HomeIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            href="/products"
            className={cn(
              'flex flex-col items-center py-2 px-3 transition-colors',
              pathname.startsWith('/products') ? 'text-teal-500' : 'text-gray-600'
            )}
          >
            <Zap className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Buy</span>
          </Link>
          <Link
            href="/pickup-request"
            className={cn(
              'flex flex-col items-center py-2 px-3 transition-colors',
              pathname === '/pickup-request' ? 'text-teal-500' : 'text-gray-600'
            )}
          >
            <Star className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Sell</span>
          </Link>
          <Link
            href="/rate-list"
            className={cn(
              'flex flex-col items-center py-2 px-3 transition-colors',
              pathname === '/rate-list' ? 'text-teal-500' : 'text-gray-600'
            )}
          >
            <Shield className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Repair</span>
          </Link>
          <button
            onClick={handleLogin}
            className={cn(
              'flex flex-col items-center py-2 px-3 transition-colors',
              isAuthenticated ? 'text-teal-500' : 'text-gray-600'
            )}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
