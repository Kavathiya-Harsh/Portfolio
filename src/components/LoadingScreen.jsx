import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '../data/profile';

const firstName = 'Harsh';
const lastName = 'Kavathiya';
const slogan = 'Engineering with Passion • Designing with Purpose';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('singularity'); // singularity -> horizon -> reveal -> exit
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    // Cinematic Timeline
    const tSingularity = setTimeout(() => setPhase('horizon'), 1400);   // Photo (Phase 1)
    const tHorizon     = setTimeout(() => setPhase('reveal'), 1800);    // Name Reveal (Phase 2)
    const tComplete    = setTimeout(() => onComplete?.(), 4500);         // Final Transition (Simplified)
    
    return () => {
      clearTimeout(tSingularity);
      clearTimeout(tHorizon);
      clearTimeout(tComplete);
    };
  }, [onComplete]);

  // Performance particles
  const particles = useMemo(() => {
    return Array.from({ length: isMobile ? 10 : 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 5
    }));
  }, [isMobile]);

  return (
    <AnimatePresence mode="wait">
      {phase !== 'complete' && (
        <motion.div
          key="loader-container"
          className="fixed inset-0 z-[250] flex items-center justify-center bg-[#050810] overflow-hidden"
          exit={{ opacity: 0 }}
        >
          {/* ── NOISE OVERLAY (DEPTH) ── */}
          <div className="absolute inset-0 bg-noise z-50 pointer-events-none" />

          {/* ── BACKGROUND PANELS (CLEAN EXIT) ── */}
          <motion.div 
            initial={{ y: 0 }}
            animate={phase === 'reveal' ? { y: 0 } : { y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-0 h-1/2 bg-[#080d1a] border-b border-white/5 z-0"
          />
          <motion.div 
            initial={{ y: 0 }}
            animate={phase === 'reveal' ? { y: 0 } : { y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#080d1a] border-t border-white/5 z-0"
          />

          {/* ── STELAR FOG ── */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0], scale: [1, 1.5, 1], y: [0, -50] }}
                transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
                className="absolute bg-blue-500 rounded-full"
                style={{ left: p.left, top: p.top, width: p.size, height: p.size, filter: 'blur(1px)' }}
              />
            ))}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full"
            />
          </div>

          {/* ── CONTENT ── */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* PHASE 1: THE SINGULARITY (Logo Pulse) */}
            <AnimatePresence>
              {phase === 'singularity' && (
                <motion.div
                  key="logo-pulse"
                  initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }}
                  transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                  className="relative group"
                >
                  <img 
                    src={profile.photoUrl} 
                    alt="Harsh Kavathiya" 
                    className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full shadow-[0_0_60px_rgba(59,130,246,0.6)] border-4 border-white/20"
                  />
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                </motion.div>
              )}

              {/* PHASE 2 & 3: HORIZON & REVEAL */}
              {(phase === 'horizon' || phase === 'reveal') && (
                <div className="relative flex flex-col items-center">
                   {/* Horizontal Slice Line */}
                   <motion.div 
                     initial={{ scaleX: 0, opacity: 0 }}
                     animate={{ scaleX: 1, opacity: 1 }}
                     exit={{ scaleX: 0, opacity: 0 }}
                     transition={{ duration: 0.8, ease: "circInOut" }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent z-20"
                   />

                   <div className="overflow-hidden py-4">
                      <motion.h1
                        initial={{ y: 200, letterSpacing: '2em', filter: 'blur(20px)' }}
                        animate={phase === 'reveal' ? { y: 0, letterSpacing: isMobile ? '0.1em' : '0.25em', filter: 'blur(0px)' } : {}}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                        className="text-4xl sm:text-7xl md:text-8xl font-black text-white uppercase text-center relative will-change-transform"
                      >
                         <span className="opacity-40 italic">{firstName}</span> 
                         <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent ml-4">
                            {lastName}
                         </span>

                         {/* Prismatic Sweep */}
                         <motion.div 
                           initial={{ x: '-150%' }}
                           animate={{ x: '150%' }}
                           transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
                           className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent skew-x-[-30deg] pointer-events-none"
                         />
                      </motion.h1>
                   </div>

                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={phase === 'reveal' ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                     transition={{ delay: 0.6, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                     className="text-[10px] sm:text-xs font-mono uppercase text-slate-400 tracking-[0.5em] text-center mt-6"
                   >
                     {slogan}
                   </motion.div>
                </div>
              )}

              {/* PHASE 4: IMMERSIVE EXIT (Through Camera) */}
              {phase === 'exit' && (
                <motion.div
                  key="exit-view"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 5, opacity: 0, filter: 'blur(20px)' }}
                  transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
                  className="flex flex-col items-center gap-12"
                >
                   <img src={profile.photoUrl} className="w-16 h-16 rounded-full opacity-40 object-cover" alt="" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── TECHNICAL OVERLAY (ENGINEERING FEEL) ── */}
          <div className="absolute inset-0 pointer-events-none p-12 overflow-hidden opacity-10">
             <div className="h-full w-full border border-white/20 rounded-[4rem] relative">
                <div className="absolute top-8 left-8 text-[8px] font-mono text-white tracking-widest uppercase">System Initialization...</div>
                <div className="absolute bottom-8 right-8 text-[8px] font-mono text-white tracking-widest uppercase">Ready to Reveal</div>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
