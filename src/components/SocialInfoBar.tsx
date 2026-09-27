import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { RAW_PRODUCTS } from '../data/products';
import { Sparkles, MoveRight, Radio } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SocialInfoBar: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();
  const { locale, t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % RAW_PRODUCTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeProduct = RAW_PRODUCTS[currentIdx] || RAW_PRODUCTS[0];
  const isBn = locale === 'bn';

  return (
    <div
      id="social-info-bar-container"
      className="bg-[#1A3070] text-white border-b border-white/10 py-2.5 sm:py-3 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-3 font-sans relative overflow-hidden shrink-0"
    >
      {/* Left Segment: Live trending fashion alert */}
      <div className="flex items-center gap-3 w-full md:w-auto min-w-0 justify-between md:justify-start">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 bg-[#0A1E54] rounded-lg shrink-0 border border-[#C9A66B]/30 flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-[#C9A66B] animate-pulse" />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-[#C9A66B] uppercase">
                {isBn ? "লাইভ ট্রেন্ডিং ড্রপ" : "TRENDING STREETWEAR"}
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-mono tracking-wider font-semibold uppercase flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                {isBn ? "অনলাইন স্টোর" : "IN STOCK"}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-white/80 font-sans tracking-wide truncate max-w-[240px] sm:max-w-md">
              {isBn 
                ? "পাটোয়ারী ফ্যাশন — প্রিমিয়াম ব্যাগি প্যান্ট ও ওভারসাইজড স্ট্রিটওয়্যার।" 
                : "Patowary Fashion — Heavyweight baggy fits & curated urban couture."}
            </p>
          </div>
        </div>
      </div>

      {/* Right Segment: Product preview pill */}
      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 p-2 bg-white/5 border border-white/10 rounded-xl md:bg-transparent md:border-0 md:p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 flex-grow md:flex-grow-0"
          >
            <img
              src={activeProduct.assets[0]}
              alt={activeProduct.title}
              className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-lg bg-neutral-900 border border-white/20 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="text-left min-w-0 flex flex-col justify-center">
              <span className="text-[8px] sm:text-[9px] font-mono text-[#C9A66B] uppercase font-bold tracking-wider truncate">
                {activeProduct.category}
              </span>
              <h5 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[140px] sm:max-w-[220px]">
                {activeProduct.title}
              </h5>
              <span className="text-[10px] sm:text-xs font-mono text-[#F8F3EA] font-bold">
                ৳ {activeProduct.price.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => navigate(`/product/${activeProduct.id}`)}
          className="bg-[#C9A66B] hover:bg-[#d6b47c] text-[#0A1E54] font-bold text-[10px] sm:text-xs uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer flex items-center gap-1 shrink-0 transition-all shadow-xs"
        >
          <span>{isBn ? "দেখুন" : "VIEW"}</span>
          <MoveRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
