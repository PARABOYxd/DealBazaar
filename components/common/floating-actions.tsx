'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ChevronUp, Zap, Star, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FloatingActionsProps {
  whatsappNumber: string;
  phoneNumber: string;
}

export function FloatingActions({ whatsappNumber, phoneNumber }: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hello! I want to sell my electronics/furniture items. Please provide more details.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const makeCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex-col gap-4 hidden lg:flex">
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="relative group"
      >
        <Button
          onClick={openWhatsApp}
          className="w-16 h-16 rounded-2xl bg-teal-500 hover:bg-teal-600 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
          aria-label="Contact on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Get WhatsApp Quote
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </div>
        </div>
      </motion.div>

      {/* Call Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        className="relative group"
      >
        <Button
          onClick={makeCall}
          className="w-16 h-16 rounded-2xl bg-teal-600 hover:bg-teal-700 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
          aria-label="Make a call"
        >
          <Phone className="w-7 h-7 text-white group-hover:scale-110 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Call Now
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </div>
        </div>
      </motion.div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative group"
          >
            <Button
              onClick={scrollToTop}
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-7 h-7 text-white group-hover:scale-110 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-800 to-teal-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                Back to Top
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        className="absolute -top-2 -left-2"
      >
        <Badge className="bg-teal-500 text-white text-xs px-2 py-1 animate-bounce-gentle">
          <Star className="w-3 h-3 mr-1 fill-white" />
          Best Prices
        </Badge>
      </motion.div>
    </div>
  );
}