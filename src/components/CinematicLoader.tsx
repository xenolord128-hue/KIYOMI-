import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_LOGO_URL } from './BrandLogo';

export const CinematicLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Elegant, smooth progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 50 ? Math.random() * 8 + 5 : Math.random() * 5 + 3;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Trigger exit and complete phase
  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 300);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, 950);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="cinematic-loader-container"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A1E54] select-none overflow-hidden"
          style={{ 
            perspective: '1200px',
            willChange: 'opacity, transform'
          }}
        >
          {/* Subtle Ambient Glow Underlay */}
          <div 
            className="absolute inset-0 bg-radial-gradient from-[#1A3070]/60 via-[#0A1E54] to-[#061233] pointer-events-none" 
            style={{ transform: 'translateZ(0)' }}
          />

          {/* Thin Gold Guideline Matrix */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B]/50 to-transparent" />
            <div className="absolute top-[50%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B]/70 to-transparent" />
            <div className="absolute top-[70%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B]/50 to-transparent" />
            <div className="absolute left-[25%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#C9A66B]/30 to-transparent" />
            <div className="absolute left-[50%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#C9A66B]/50 to-transparent" />
            <div className="absolute left-[75%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#C9A66B]/30 to-transparent" />
          </div>

          {/* Interactive perspective stage */}
          <div 
            className="relative flex flex-col items-center justify-center pointer-events-none"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
          >
            {/* 3D DOUBLE-LAYERED BRAND EMBLEM CARD */}
            <motion.div
              id="cinematic-3d-emblem-card"
              initial={{ rotateY: -180, rotateX: 20, scale: 0.85 }}
              animate={{ 
                rotateY: [180, 0, -8, 0],
                rotateX: [20, -8, 4, 0],
                scale: 1,
              }}
              transition={{ 
                duration: 2.2, 
                ease: [0.25, 1, 0.5, 1],
                times: [0, 0.6, 0.85, 1]
              }}
              className="relative w-80 h-52 sm:w-96 sm:h-56 rounded-3xl p-6 flex flex-col justify-between overflow-visible"
              style={{
                transformStyle: 'preserve-3d',
                backgroundColor: 'rgba(26, 48, 112, 0.45)',
                border: '1px solid rgba(201, 166, 107, 0.25)',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(16px)',
                willChange: 'transform'
              }}
            >
              {/* Backing Depth Sheet inside Card */}
              <div 
                className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-[#1A3070]/40 via-[#0A1E54]/60 to-[#061233]/90 -z-10 pointer-events-none"
                style={{ transform: 'translateZ(-10px)' }}
              />

              {/* Top Row: Brand Info */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-[#C9A66B] uppercase block">
                    PATOWARY FASHION
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#F8F3EA]/70 block mt-0.5">
                    AUTONOMOUS STREETWEAR &bull; 2026
                  </span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B]" />
                </div>
              </div>

              {/* Core Display: Patowary Fashion with Official Logo */}
              <div 
                className="my-auto text-center flex flex-col items-center"
                style={{ 
                  transform: 'translateZ(35px)', 
                  transformStyle: 'preserve-3d',
                  willChange: 'transform' 
                }}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden mb-2.5 border-2 border-[#C9A66B] bg-white p-0.5 shadow-xl shadow-black/50">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="Patowary Fashion Official Logo"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#F8F3EA] font-serif select-none drop-shadow-md leading-none uppercase">
                  Patowary Fashion
                </h1>
                <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent mx-auto mt-2" />
              </div>

              {/* Bottom Row: Specs */}
              <div className="flex justify-between items-end">
                <span className="text-[8px] font-mono text-[#F8F3EA]/60 uppercase tracking-widest">
                  DHAKA, BANGLADESH
                </span>
                <span className="text-[9px] font-mono text-[#C9A66B] tracking-widest font-bold">
                  {Math.round(progress)}% LOADED
                </span>
              </div>

              {/* Front Glass Panel */}
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  transform: 'translateZ(45px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
                  boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
                  willChange: 'transform'
                }}
              />
            </motion.div>

            {/* Glowing Accent Ring floating horizontally */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotateX: 75, rotateZ: 0 }}
              animate={{ 
                opacity: [0, 0.35, 0.35, 0],
                scale: [0.6, 1.15, 1.3, 1.4],
                rotateZ: [0, 90, 180, 270]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-8 w-44 h-44 rounded-full border border-dashed border-[#C9A66B]/50 pointer-events-none"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(75deg) translateZ(-50px)',
                willChange: 'transform, opacity'
              }}
            />
          </div>

          {/* Progress Loading Bar */}
          <div className="absolute bottom-16 sm:bottom-20 w-48 sm:w-64 flex flex-col items-center gap-2 pointer-events-none">
            <div className="w-full h-[2.5px] bg-[#1A3070] rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#1A3070] via-[#C9A66B] to-[#F8F3EA]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between w-full font-mono text-[8px] text-[#F8F3EA]/70 tracking-[0.2em] uppercase">
              <span>INITIALIZING</span>
              <span>PATOWARY 2026</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
