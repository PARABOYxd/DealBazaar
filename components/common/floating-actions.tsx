'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Button
          onClick={openWhatsApp}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Contact on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </Button>
      </motion.div>

      {/* Call Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
      >
        <Button
          onClick={makeCall}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Make a call"
        >
          <Phone className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </Button>
      </motion.div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring' }}
          >
            <Button
              onClick={scrollToTop}
              variant="secondary"
              className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}