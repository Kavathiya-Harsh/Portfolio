import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '../data/profile';

const firstName = 'Harsh';
const lastName = 'Kavathiya';
const slogan = 'Engineering with Passion • Designing with Purpose';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('photo'); // photo -> name -> done

  useEffect(() => {
    // Dramatically shortened timeline for PageSpeed (was 4.5s total, now 2.5s)
    const tName     = setTimeout(() => setPhase('name'), 1000);    // Photo visible for 1s
    const tComplete = setTimeout(() => onComplete?.(), 2500);       // Total loading: 2.5s

    return () => {
      clearTimeout(tName);
      clearTimeout(tComplete);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[250] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#050810' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Subtle ambient glow — composited (opacity only) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">

            {/* PHASE 1: Photo */}
            <AnimatePresence mode="wait">
              {phase === 'photo' && (
                <motion.div
                  key="photo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="relative"
                >
                  <img
                    src={profile.photoUrl}
                    alt="Harsh Kavathiya"
                    width="224"
                    height="224"
                    className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full border-4 border-white/20"
                    style={{
                      boxShadow: '0 0 60px rgba(59,130,246,0.5)',
                    }}
                    fetchpriority="high"
                  />
                  {/* Subtle pulse ring — uses only opacity + scale (composited) */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                    animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                  />
                </motion.div>
              )}

              {/* PHASE 2: Name */}
              {phase === 'name' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col items-center"
                >
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="text-4xl sm:text-7xl md:text-8xl font-black text-white uppercase text-center will-change-transform"
                    style={{ letterSpacing: '0.15em' }}
                  >
                    <span className="opacity-40 italic">{firstName}</span>{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                      {lastName}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="text-[10px] sm:text-xs font-mono uppercase text-slate-400 text-center mt-6"
                    style={{ letterSpacing: '0.4em' }}
                  >
                    {slogan}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Technical overlay — static, no animation cost */}
          <div className="absolute inset-0 pointer-events-none p-12 overflow-hidden opacity-[0.06]">
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
