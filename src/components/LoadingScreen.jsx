import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro → exit → done
  const counterRef = useRef(null);
  const completedRef = useRef(false);

  const progressValue = useMotionValue(0);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  useEffect(() => {
    // Keep it fast, but use a very soft, emotional curve
    const controls = animate(progressValue, 100, {
      duration: 1.2, 
      ease: [0.45, 0, 0.15, 1], // Soft, breath-like curve
      onUpdate: (value) => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(value).toString();
        }
      },
      onComplete: () => {
        // Very brief hold to absorb the beauty
        setTimeout(() => {
          setPhase('exit');
          setTimeout(() => {
            if (!completedRef.current) {
              completedRef.current = true;
              setPhase('done');
              onComplete?.();
            }
          }, 800); 
        }, 150); 
      }
    });

    return () => controls.stop();
  }, [onComplete, progressValue]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="loading-screen"
          // The "Heavenly Light" Exit: Screen gets engulfed in pure glowing light before fading
          exit={{ opacity: 0, filter: "brightness(2) blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#010204] overflow-hidden"
        >
          {/* Ethereal Film Grain */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
          />

          {/* The "Breathing" Core Light */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 0.9], opacity: [0, 0.4, 0.8] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px] pointer-events-none mix-blend-screen"
            style={{ background: 'radial-gradient(circle, rgba(103,232,249,0.4) 0%, rgba(59,130,246,0.1) 50%, transparent 100%)' }}
          />

          {/* Expanding "Flashbang" Light on Exit */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            exit={{ scale: 50, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full blur-[20px] pointer-events-none z-10 mix-blend-overlay"
          />

          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
            
            {/* Soft, Emotional Typography Reveal */}
            <motion.div 
              className="flex flex-col items-center text-center relative"
              initial={{ filter: "blur(20px)", scale: 0.85, opacity: 0 }}
              animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Cinematic Expo
            >
              {/* Dynamic Tracking (Letter Spacing) Container */}
              <motion.div
                initial={{ letterSpacing: '0.3em' }}
                animate={{ letterSpacing: '-0.02em' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <h1 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tight drop-shadow-[0_0_50px_rgba(59,130,246,0.5)] leading-none px-4 flex flex-wrap justify-center gap-x-4 relative z-10">
                  <motion.span 
                    className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#e2e8f0] to-white"
                    style={{ backgroundSize: '200% auto' }}
                    animate={{ backgroundPosition: ['200% center', '-200% center'] }}
                    transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                  >
                    Harsh
                  </motion.span>
                  <motion.span 
                    className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-200 to-blue-500"
                    style={{ backgroundSize: '200% auto' }}
                    animate={{ backgroundPosition: ['-200% center', '200% center'] }}
                    transition={{ duration: 2.5, ease: 'linear', repeat: Infinity }}
                  >
                    Kavathiya
                  </motion.span>
                </h1>
                
                {/* Stunning Glassy Reflection Below Text */}
                <h1 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tight leading-none px-4 flex flex-wrap justify-center gap-x-4 absolute top-full left-0 w-full scale-y-[-1] opacity-20 blur-[4px] pointer-events-none select-none mix-blend-screen" style={{ maskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)' }}>
                  <span className="text-white">Harsh</span>
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">Kavathiya</span>
                </h1>
              </motion.div>
              
              <div className="mt-8 flex items-center gap-4 opacity-70 relative z-20">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-200" />
                <p className="font-serif italic text-sm md:text-base text-cyan-50 tracking-widest drop-shadow-[0_0_10px_rgba(103,232,249,0.8)]">
                  Engineering with Passion
                </p>
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-200" />
              </div>
            </motion.div>

            {/* Delicate, Minimal Counter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute bottom-16 flex flex-col items-center gap-2"
            >
              <div className="flex items-baseline gap-1 text-white/40 drop-shadow-[0_0_10px_rgba(59,130,246,0.2)] mix-blend-screen">
                <span ref={counterRef} className="text-sm font-mono tracking-widest">0</span>
                <span className="text-[10px] font-mono">%</span>
              </div>
            </motion.div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
