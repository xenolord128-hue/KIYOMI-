import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data/products';

export const IntroAnimation: React.FC = () => {
  const [show, setShow] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);

  useEffect(() => {
    // Random product
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    setSelectedProduct(randomProduct);

    // After animation delay, hide
    const timer = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] bg-[#0C1E1F] flex flex-col items-center justify-center p-6 overflow-hidden perspective-1000"
        >
          {/* Layer 1: Background Glow/Depth */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-radial from-[#CBF23D]/20 to-transparent"
          />

          {/* Layer 2: Info (Top layer in terms of movement/delay) */}
          <motion.div
            initial={{ opacity: 0, y: -20, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-[#CBF23D] font-bold text-[10px] tracking-[0.4em] uppercase mb-8 z-20"
          >
            INITIALIZING SHOWCASE
          </motion.div>

          {/* Layer 3: Main Product Image container */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md w-full text-center relative z-10"
          >
            <motion.div 
              className="absolute -inset-4 bg-gradient-to-r from-[#CBF23D]/10 to-[#00E0FF]/10 blur-2xl opacity-50"
            />
            <motion.img 
              src={selectedProduct.assets[0]} 
              className="w-full h-80 object-cover rounded-xl border border-[#CBF23D]/20 shadow-2xl relative z-10" 
              alt={selectedProduct.title}
            />
            
            {/* Layer 4: Title */}
            <motion.h2 
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              className="text-4xl mt-10 font-serif text-[#CBF23D] tracking-tighter"
            >
              {selectedProduct.title}
            </motion.h2>
          </motion.div>

          {/* Layer 5: Progress Bar */}
          <motion.div
            initial={{ width: "0%", opacity: 0 }}
            animate={{ width: "160px", opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
            className="mt-16 h-0.5 bg-[#CBF23D] relative z-20"
          >
            <div className="absolute inset-0 bg-[#00E0FF] blur-sm" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
