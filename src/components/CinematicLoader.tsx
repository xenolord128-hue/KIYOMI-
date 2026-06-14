import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
        // Rapid initially, matching professional loader behaviors
        const increment = prev < 50 ? Math.random() * 8 + 4 : Math.random() * 4 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 45);

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
      }, 950); // High-fidelity transition timing

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
            scale: 1.08,
            filter: 'brightness(1.5)',
            transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050D0E] select-none overflow-hidden"
          style={{ 
            perspective: '1200px',
            willChange: 'opacity, transform'
          }}
        >
          {/* Hardware-Accelerated Ambient Glow Underlay */}
          <div 
            className="absolute inset-0 bg-radial-gradient from-cyan-950/20 via-[#050D0E] to-[#04090A] pointer-events-none" 
            style={{ transform: 'translateZ(0)' }}
          />

          {/* Thin Glowing High-Tech Background Guideline Matrix */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            {/* Horizontal Line Grid */}
            <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#54a8fc]/40 to-transparent" />
            <div className="absolute top-[50%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#54a8fc]/60 to-transparent" />
            <div className="absolute top-[70%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#54a8fc]/40 to-transparent" />
            {/* Vertical Line Grid */}
            <div className="absolute left-[25%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#54a8fc]/30 to-transparent" />
            <div className="absolute left-[50%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#54a8fc]/50 to-transparent" />
            <div className="absolute left-[75%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#54a8fc]/30 to-transparent" />
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
                rotateY: [180, 0, -10, 0],
                rotateX: [20, -10, 5, -5],
                scale: 1,
              }}
              transition={{ 
                duration: 2.2, 
                ease: [0.25, 1, 0.5, 1],
                times: [0, 0.6, 0.85, 1]
              }}
              className="relative w-72 h-44 sm:w-80 sm:h-48 rounded-2xl p-5 flex flex-col justify-between overflow-visible"
              style={{
                transformStyle: 'preserve-3d',
                backgroundColor: 'rgba(18, 30, 32, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                willChange: 'transform'
              }}
            >
              {/* Backing Depth Sheet inside Card */}
              <div 
                className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-cyan-950/25 via-[#0c1e1f]/35 to-black/80 -z-10 pointer-events-none"
                style={{ transform: 'translateZ(-10px)' }}
              />

              {/* Top Row: Brand Info */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-mono font-bold tracking-widest text-[#54a8fc] uppercase block">
                    GUILD CODE / VERIFIED
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-[#CBF23D] block font-semibold mt-1">
                    SYS-2026.K
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#54a8fc] animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#54a8fc]" />
                </div>
              </div>

              {/* Core Display: KIYOMI (Preserves physical 3D float) */}
              <div 
                className="my-auto text-center"
                style={{ 
                  transform: 'translateZ(35px)', 
                  transformStyle: 'preserve-3d',
                  willChange: 'transform' 
                }}
              >
                <h1 className="text-4xl sm:text-[42px] font-bold tracking-[0.25em] text-white font-serif select-none drop-shadow-lg leading-none">
                  KIYOMI
                </h1>
                <div className="h-[1px] w-12 bg-[#CBF23D] mx-auto mt-2.5 opacity-80" />
              </div>

              {/* Bottom Row: Specs */}
              <div className="flex justify-between items-end">
                <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                  EST. 2026 DHAKA
                </span>
                <span className="text-[8px] font-mono text-[#54a8fc] tracking-widest font-bold">
                  {Math.round(progress)}% LOADED
                </span>
              </div>

              {/* FRONT TRANSLUCENT GLASS PANEL (Creates a stunning 3D shadow/glass parallax) */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  transform: 'translateZ(45px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
                  boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
                  willChange: 'transform'
                }}
              />
            </motion.div>

            {/* Glowing Ring floating horizontally under the card (Perspective depth) */}
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
              className="absolute -bottom-8 w-44 h-44 rounded-full border border-dashed border-[#54a8fc]/40 pointer-events-none"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(75deg) translateZ(-50px)',
                willChange: 'transform, opacity'
              }}
            />

            {/* Additional fast hardware-rendered particles orbit for immersive UX */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
              <div 
                className="absolute w-2 h-2 rounded-full bg-[#CBF23D] shadow-[0_0_8px_#CBF23D] animate-ping"
                style={{ transform: 'translateX(-120px) translateY(-50px) translateZ(20px)' }}
              />
              <div 
                className="absolute w-1.5 h-1.5 rounded-full bg-[#54a8fc] shadow-[0_0_8px_#54a8fc]"
                style={{ transform: 'translateX(130px) translateY(80px) translateZ(-10px)' }}
              />
            </div>
          </div>

          {/* Premium Tech Progress Loading Bar */}
          <div className="absolute bottom-16 sm:bottom-20 w-48 sm:w-56 flex flex-col items-center gap-2 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-900 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#54a8fc] via-cyan-400 to-[#CBF23D]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between w-full font-mono text-[7px] text-zinc-500 tracking-[0.18em] uppercase">
              <span>PROT.LAUNCH.V1</span>
              <span>SECURE ENTRY</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
