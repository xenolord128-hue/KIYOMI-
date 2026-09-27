import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_LOGO_URL } from './BrandLogo';

export const IntroAnimation: React.FC = () => {
  const [show, setShow] = useState(() => {
    // Show only once per session so it doesn't disturb browsing
    return !sessionStorage.getItem('patowary_intro_seen');
  });

  useEffect(() => {
    if (show) {
      sessionStorage.setItem('patowary_intro_seen', 'true');
      const timer = setTimeout(() => setShow(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] bg-[#0A1E54] flex flex-col items-center justify-center p-6 overflow-hidden select-none"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-[#C9A66B]/15 via-transparent to-transparent pointer-events-none" />

          {/* Official Brand Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative p-1 rounded-full bg-white shadow-2xl border-2 border-[#C9A66B]/60 mb-6">
              <img 
                src={OFFICIAL_LOGO_URL} 
                alt="Patowary Fashion Logo" 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wider"
            >
              Patowary Fashion
            </motion.h1>

            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#C9A66B] mt-2 font-medium"
            >
              MODERN TRENDING STREETWEAR
            </motion.span>

            {/* Glass line progress indicator */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "140px" }}
              transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
              className="mt-8 h-0.5 bg-[#C9A66B] rounded-full shadow-sm"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
