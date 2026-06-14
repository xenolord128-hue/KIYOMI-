import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Sparkles, AlertCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const NoticeBoard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [announcements, setAnnouncements] = useState<string[]>([
    "KIYOMI BANGLADESH: ENJOY FREE COURIER FOR ALL ORDERS ABOVE BDT 5000",
    "ENTER PROMOCODE [KIYOMIVIP] FOR 20% OFF AT CHECKOUT",
    "RESTOCKED: EXCLUSIVE HEAVYWEIGHT OVERSIZED STREET HOODIES NOW ACTIVE"
  ]);
  const [index, setIndex] = useState(0);

  // Sync announcements dynamically from Firestore if set by Admin
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'announcements'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().active) {
        setAnnouncements([docSnap.data().message]);
        setIndex(0);
      }
    }, (err) => {
      console.log("No custom admin announcement, using defaults.");
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
    <div id="notice-board-wrapper" className="bg-big-stone text-seashell border-b border-cascade/10 py-2.5 px-4 relative flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase selection:bg-lime-neon selection:text-big-stone">
      <div className="w-full flex justify-center items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 font-semibold"
          >
            {index === 0 ? <Flame className="w-3.5 h-3.5 text-lime-neon animate-pulse" /> : 
             index === 1 ? <Sparkles className="w-3.5 h-3.5 text-lime-neon" /> : 
             <AlertCircle className="w-3.5 h-3.5 text-cascade" />}
            <span>{announcements[index]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <button 
        id="close-notice-btn"
        className="text-seashell/75 hover:text-lime-neon transition-colors p-1 cursor-pointer md:absolute md:right-4"
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
