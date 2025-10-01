'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageCircle, Zap, Star, Shield, ChevronDown, User, LogOut, Settings, Search, MapPin, CheckCircle, Home as HomeIcon, ShoppingCart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { SearchBar } from './search-bar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';
import { apiService } from '@/lib/api';
import { LoginModal } from './login-modal';
import { useDebounce } from '@/hooks/use-debounce';
import { Product } from '@/types';

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
  const [location, setLocation] = useState('Mumbai');
  const [isLocating, setIsLocating] = useState(true);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearchLoading(true);
      apiService.getSubcategory({ searchParam: debouncedSearchTerm })
        .then((res) => {
          setSearchResults(res.data || []);
        })
        .finally(() => {
          setIsSearchLoading(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();
            setLocation(data.city || 'Mumbai');
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation('Mumbai');
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation('Mumbai');
          setIsLocating(false);
        }
      );
    } else {
      setLocation('Mumbai');
      setIsLocating(false);
    }
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
                <img src="/logo-compact.svg" alt="Bhej Do logo" className="w-10 h-10 rounded-full shadow-sm object-contain" />
                <span className="text-teal-600 font-bold text-lg">Bhej Do</span>
              </Link>
              {/* Search Bar */}
              <div className="flex-1 max-w-xl mx-6 relative">
                <SearchBar
                  placeholder="Search for electronics, furniture & more"
                  value={searchTerm}
                  onChange={setSearchTerm}
                />
                {searchTerm && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-10">
                    {isSearchLoading && <div className="p-4 text-center">Loading...</div>}
                    {!isSearchLoading && searchResults.length === 0 && debouncedSearchTerm && (
                      <div className="p-4 text-center">No results found.</div>
                    )}
                    {!isSearchLoading && searchResults.length > 0 && (
                      <ul>
                        {searchResults.slice(0, 6).map((product) => (
                          <li key={product.id}>
                            <Link href={`/products/${product.slug}`} className="block p-4 hover:bg-gray-100">
                              {product.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              {/* Right Side - Location & Login */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin text-primary-500 />
                  <span>{isLocating ? 'Locating...' : location}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt="@shadcn" />
                          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem className="flex flex-col items-start space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || user?.phoneNumber || ""}
                        </p>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      {user?.status !== 'COMPLETED' && (
                        <DropdownMenuItem onClick={handleLogin}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Complete Profile</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-sm"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                )}
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
                  <Button className="ml-2 bg-black text-white hover:bg-black/80">
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
      <Link href="/" className="flex items-center space-x-1.5">
        <img src="/logo-compact.svg" alt="Bhej Do" className="w-9 h-9 rounded-full shadow-sm object-contain" />
        <span className="text-teal-600 font-bold text-sm">Bhej Do</span>
      </Link>

            <div className="flex items-center space-x-2">
                {/* Location */}
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 text-teal-500" />
                    <span>{isLocating ? 'Locating...' : location}</span>
                    <ChevronDown className="w-3 h-3" />
                </div>

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
                      className="w-full flex items-center gap-2 justify-center py-2 text-sm"
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
            <ShoppingCart className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Products</span>
          </Link>
          <Link
            href="/pickup-request"
            className={cn(
              'flex flex-col items-center py-2 px-3 transition-colors',
              pathname === '/pickup-request' ? 'text-teal-500' : 'text-gray-600'
            )}
          >
            <ShoppingBag className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Sell Now</span>
          </Link>
          <Link
            href="/contact"
            className={cn(
              'flex flex-col items-center py-2 px-3 transition-colors',
              pathname === '/contact' ? 'text-teal-500' : 'text-gray-600'
            )}
          >
            <Phone className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Contact Us</span>
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex flex-col items-center py-2 px-3 transition-colors',
                    isAuthenticated ? 'text-teal-500' : 'text-gray-600'
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt="@shadcn" />
                    <AvatarFallback className="text-xs">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium mt-1">{user?.name?.split(' ')[0] || "Profile"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user?.status !== 'COMPLETED' && (
                  <DropdownMenuItem onClick={handleLogin}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Complete Profile</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={handleLogin}
              className={cn(
                'flex flex-col items-center py-2 px-3 transition-colors',
                pathname === '/login' ? 'text-teal-500' : 'text-gray-600'
              )}
            >
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}