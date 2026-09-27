import React from 'react';
import { motion } from 'motion/react';
import { OFFICIAL_LOGO_URL } from './BrandLogo';

export const WifiLoader: React.FC<{ loadingText?: string }> = ({ loadingText = "CONNECTING TO PATOWARY FASHION" }) => {
  return (
    <div id="wifi-loader-container" className="fixed inset-0 z-50 bg-[#F8F3EA] flex flex-col items-center justify-center p-8 selection:bg-[#0A1E54] text-[#111827]">
      <div id="loader-wavefronts" className="relative flex items-center justify-center mb-8">
        {/* Pulsing Concentric Ripple Rings */}
        <motion.div
          animate={{ scale: [0.8, 1.8], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
          className="absolute w-28 h-28 rounded-full border border-[#C9A66B]/30"
        />
        <motion.div
          animate={{ scale: [0.8, 2.4], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut", delay: 0.6 }}
          className="absolute w-28 h-28 rounded-full border border-[#0A1E54]/20"
        />
        
        {/* Core Pulsing Icon Ring */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="relative bg-white p-2 rounded-full border-2 border-[#C9A66B] shadow-xl flex items-center justify-center"
        >
          <img
            src={OFFICIAL_LOGO_URL}
            alt="Patowary Fashion Logo"
            className="w-16 h-16 object-contain rounded-full"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1.0, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
        className="text-[#0A1E54] text-xs tracking-[0.25em] font-mono uppercase text-center mt-2 font-bold"
      >
        {loadingText}
      </motion.p>
    </div>
  );
};
