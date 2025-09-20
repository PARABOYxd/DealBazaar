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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';
import { apiService } from '@/lib/api';

const navigation = [
  { name: 'All', href: '/' },
  { name: 'Sell Electronics', href: '/products?category=electronics' },
  { name: 'Sell Furniture', href: '/products?category=furniture' },
  { name: 'Sell Appliances', href: '/products?category=home-appliances' },
  { name: 'Rate List', href: '/rate-list' },
  { name: 'Schedule Pickup', href: '/pickup-request' },
];

interface NavbarProps {
  whatsappNumber: string;
  phoneNumber: string;
}

export function Navbar({ whatsappNumber, phoneNumber }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    phone: '',
    otp: '',
    name: '',
    email: '',
    location: ''
  });
  const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
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

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  const handlePhoneSubmit = async () => {
    setLoginError('');
    if (loginData.phone.length === 10) {
      setLoginLoading(true);
      try {
        const res = await apiService.sendOtp(loginData.phone);
        if (res.status === 200) {
          setLoginStep(2);
        } else {
          setLoginError(res.message || 'Failed to send OTP');
        }
      } catch (err) {
        setLoginError('Failed to send OTP');
      } finally {
        setLoginLoading(false);
      }
    }
  };

  const handleOTPSubmit = async () => {
    setLoginError('');
    if (loginData.otp.length === 6) {
      setLoginLoading(true);
      try {
        const res = await apiService.verifyOtp(loginData.phone, loginData.otp);
        if (res.status === 200 && res.data && res.data[0]?.token) {
          localStorage.setItem('token', res.data[0].token);
          setLoginStep(3);
        } else {
          setLoginError(res.message || 'Invalid OTP');
        }
      } catch (err) {
        setLoginError('Invalid OTP');
      } finally {
        setLoginLoading(false);
      }
    }
  };

  const handleDetailsSubmit = () => {
    // Here you would typically save user details
    setIsLoginOpen(false);
    setLoginStep(1);
    setLoginData({ phone: '', otp: '', name: '', email: '', location: '' });
  };

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
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-teal-600 font-bold text-lg">ELECTRONICPICKUP</span>
              </Link>

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
        <div className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for electronics, furniture & more"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4">
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3"
                  onClick={openWhatsApp}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-6 py-3"
                  onClick={makeCall}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-8 py-3">
              {navigation.map((item) => (
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
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Link>
              ))}
            </nav>
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
              className="bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for electronics, furniture & more"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg',
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
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Quote
                  </Button>
                  <Button
                    onClick={makeCall}
                    variant="outline"
                    className="w-full border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white flex items-center gap-2 justify-center"
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
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md w-full mx-4">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-black">
              {loginStep === 1 && "Login to Your Account"}
              {loginStep === 2 && "Verify OTP"}
              {loginStep === 3 && "Complete Your Profile"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {loginStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={loginData.phone}
                    onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                    className="mt-1"
                    maxLength={10}
                  />
                </div>
                <Button
                  onClick={handlePhoneSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  disabled={loginData.phone.length !== 10 || loginLoading}
                >
                  {loginLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
                {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
              </div>
            )}

            {loginStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={loginData.otp}
                    onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                    className="mt-1 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-teal-500 text-sm"
                    onClick={() => setLoginStep(1)}
                  >
                    Resend OTP
                  </Button>
                </div>
                <Button
                  onClick={handleOTPSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  disabled={loginData.otp.length !== 6 || loginLoading}
                >
                  {loginLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
              </div>
            )}

            {loginStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={loginData.name}
                    onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your city"
                    value={loginData.location}
                    onChange={(e) => setLoginData({ ...loginData, location: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleDetailsSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  disabled={!loginData.name || !loginData.location}
                >
                  Complete Registration
                </Button>
              </div>
            )}

            <div className="text-center">
              <Button
                variant="link"
                className="text-gray-500 text-sm"
                onClick={() => {
                  setIsLoginOpen(false);
                  setLoginStep(1);
                  setLoginData({ phone: '', otp: '', name: '', email: '', location: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
