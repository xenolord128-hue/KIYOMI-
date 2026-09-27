import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Sparkles, Tag } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const NoticeBoard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [announcements, setAnnouncements] = useState<string[]>([
    "PATOWARY FASHION • ENJOY FREE EXPRESS DELIVERY FOR ORDERS OVER BDT 3500",
    "USE PROMOCODE [PATOWARY10] FOR 10% OFF ON ALL STREETWEAR",
    "NEW DROP: HEAVYWEIGHT BAGGY CARGO PANTS & 260 GSM OVERSIZED TEES"
  ]);
  const [index, setIndex] = useState(0);

  // Sync announcements dynamically from Firestore if set by Admin
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'announcements'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().active) {
        setAnnouncements([docSnap.data().message]);
        setIndex(0);
      }
    }, () => {
      // Use defaults
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements]);

  if (!isVisible) return null;

  return (
    <div id="notice-board-wrapper" className="bg-[#0A1E54] text-[#F8F3EA] border-b border-[#1A3070] py-2 px-4 relative flex items-center justify-between text-[10px] sm:text-xs font-medium tracking-wider uppercase">
      <div className="w-full flex justify-center items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 font-medium"
          >
            {index === 0 ? <Flame className="w-3.5 h-3.5 text-[#C9A66B] animate-pulse" /> : 
             index === 1 ? <Tag className="w-3.5 h-3.5 text-[#C9A66B]" /> : 
             <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />}
            <span>{announcements[index]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <button 
        id="close-notice-btn"
        className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer md:absolute md:right-4"
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
