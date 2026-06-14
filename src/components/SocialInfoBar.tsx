import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { Sparkles, Flame, MoveRight, Radio } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SocialInfoBar: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();
  const { locale, t } = useLanguage();

  // Cycle through premium showcase items slightly slower for comfortable mobile reading
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PRODUCTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeProduct = PRODUCTS[currentIdx];

  // Language mappings helper
  const isBn = locale === 'bn';

  return (
    <div
      id="social-info-bar-container"
      className="bg-[#091012] text-white border-b border-[#CBF23D]/15 py-3 sm:py-4 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-sans relative overflow-hidden shrink-0 selection:bg-[#CBF23D] selection:text-black"
    >
      {/* Premium background gradient sweeps */}
      <div className="absolute top-0 left-0 w-44 h-full bg-gradient-to-r from-[#005840]/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-44 h-full bg-gradient-to-l from-[#CBF23D]/5 to-transparent pointer-events-none" />
      <div className="absolute -bottom-12 left-1/3 w-32 h-32 bg-[#CBF23D]/5 blur-3xl rounded-full pointer-events-none" />

      {/* Decorative ambient tech lines */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#CBF23D]/10 to-transparent" />

      {/* Left Segment: Luxe Manifesto & Status */}
      <div className="flex items-center gap-3 w-full md:w-auto min-w-0 justify-between md:justify-start">
        <div className="flex items-center gap-3 min-w-0">
          {/* Audio pulsing-inspired premium badge */}
          <div className="p-2 bg-gradient-to-br from-[#0c2e21] via-[#012217] to-[#041d14] rounded-xl shrink-0 border border-[#CBF23D]/30 flex items-center justify-center shadow-[0_0_15px_rgba(203,242,61,0.06)]">
            <Flame className="w-4 h-4 text-[#CBF23D] animate-bounce" />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] text-[#CBF23D] uppercase flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#CBF23D] animate-pulse" />
                {isBn ? "লাইভ ক্যাটালগ" : "LIVE SPECIMENS"}
              </span>
              <span className="px-1.5 py-0.5 bg-[#43e6a2]/10 text-[#43e6a2] rounded text-[7px] sm:text-[8px] font-mono tracking-widest font-extrabold uppercase flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                {isBn ? "ঢাকা অনলাইন" : "Dhk Online"}
              </span>
            </div>
            <p className="text-[9.5px] sm:text-[11.5px] text-stone-300 font-sans tracking-wide truncate max-w-[240px] sm:max-w-md font-medium">
              {isBn 
                ? "ঢাকার গুলশানে আমাদের সেরা ইন্টেলিজেন্ট ওয়্যারেবল ও হাই-অ্যাকোস্টিক গ্যাজেট রয়েছে।" 
                : "Elite smart wearables & high-fidelity hardware allocated premium in Dhaka."}
            </p>
          </div>
        </div>

        {/* Pulse Dot only shown on mobile/tablet viewport right-aligned */}
        <span className="md:hidden flex items-center gap-1.5 font-mono text-[8px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-1 px-2.5 rounded-full uppercase shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isBn ? "লাইভ ফিড" : "LIVE FEED"}
        </span>
      </div>

      {/* Right Segment: Premium Dynamic Carousel Capsule */}
      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 p-2.5 sm:p-2 bg-white/[0.02] border border-white/5 rounded-2xl md:bg-transparent md:border-0 md:p-0 md:rounded-none">
        
        {/* Caption */}
        <div className="hidden lg:flex flex-col items-end text-right mr-2 leading-none shrink-0 font-mono">
          <span className="text-[8.5px] font-black text-stone-500 uppercase tracking-widest mb-1">
            {isBn ? "ভিআইপি পাস" : "EXHIBITION TICKET"}
          </span>
          <span className="text-[10px] font-medium text-[#CBF23D] uppercase tracking-wide">
            {isBn ? "আজকের বিশেষ অফার • সীমিত স্টক" : "TODAY'S SPECIAL • LIMITED STOCK"}
          </span>
        </div>

        <div className="flex-grow md:flex-grow-0 flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 flex-grow md:flex-grow-0"
            >
              {/* Product Thumbnail with premium glow rings */}
              <div className="relative shrink-0">
                <img
                  src={activeProduct.assets[0]}
                  alt={activeProduct.title}
                  className="w-11 h-11 sm:w-14 sm:h-14 object-cover rounded-xl bg-neutral-950 border border-white/10 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-xl border border-[#CBF23D]/20 animate-pulse pointer-events-none" />
              </div>

              {/* Text Meta Container */}
              <div className="text-left min-w-0 flex flex-col justify-center leading-none">
                <span className="text-[8px] sm:text-[9px] font-mono text-[#CBF23D] uppercase font-black tracking-[0.15em] mb-1 block">
                  {isBn ? "সীমিত সংস্করণ" : "LIMITED DROP"} {t(activeProduct.category).toUpperCase()}
                </span>
                <h5 className="text-[11px] sm:text-[13px] font-bold text-white truncate font-serif italic max-w-[130px] sm:max-w-[200px] mb-1.5 leading-snug">
                  {t(activeProduct.title)}
                </h5>
                <span className="text-[10px] sm:text-[12px] font-mono text-[#43e6a2] font-black tracking-wider block">
                  {isBn ? "টাকা " : "BDT "} {activeProduct.price.toLocaleString()}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Acquire Call to Action Button */}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(203,242,61,0.25)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(`/product/${activeProduct.id}`)}
            className="bg-[#CBF23D] hover:bg-white text-black font-semibold text-[10px] md:text-[11px] font-mono tracking-widest uppercase transition-all px-4 py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-[0_4px_15px_rgba(203,242,61,0.15)] select-none h-11 active:scale-95 border border-[#CBF23D]"
          >
            <span>{isBn ? "সংগ্রহ করুন" : "ACQUIRE"}</span>
            <MoveRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

      </div>
    </div>
  );
};
