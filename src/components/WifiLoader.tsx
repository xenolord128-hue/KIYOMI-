import React from 'react';
import { motion } from 'motion/react';
import { Wifi } from 'lucide-react';

export const WifiLoader: React.FC<{ loadingText?: string }> = ({ loadingText = "CONNECTING TO KIYOMI LUXURY ENVIRONMENT" }) => {
  return (
    <div id="wifi-loader-container" className="fixed inset-0 z-50 bg-[#fbf9f5] flex flex-col items-center justify-center p-8 selection:bg-emerald-800">
      <div id="loader-wavefronts" className="relative flex items-center justify-center mb-8">
        {/* Pulsing Concentric Ripple Rings */}
        <motion.div
          animate={{ scale: [0.8, 1.8], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
          className="absolute w-24 h-24 rounded-full border border-[#2d728f]/10"
        />
        <motion.div
          animate={{ scale: [0.8, 2.4], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut", delay: 0.6 }}
          className="absolute w-24 h-24 rounded-full border border-emerald-800/10"
        />
        
        {/* Core Pulsing Icon Ring */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="relative bg-[#0f2c2e] p-3 rounded-full border border-yellow-600/10 shadow-xl shadow-[#021111]/5 flex items-center justify-center text-[#f4efe8]"
        >
          <img
            src="https://i.ibb.co.com/Xxv0xKL8/Black-White-Simple-Modern-Neon-Griddy-Bold-Technology-Pixel-Electronics-Store-Logo.png"
            alt="KIYOMI Loading..."
            className="w-16 h-16 object-contain rounded-full bg-[#1A1A1A]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1.0, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
        className="text-[#0f2c2e] text-[10px] md:text-xs tracking-[0.25em] font-mono uppercase text-center mt-2 font-medium"
      >
        {loadingText}
      </motion.p>
    </div>
  );
};
