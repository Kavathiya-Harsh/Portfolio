import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro → exit → done
  const counterRef = useRef(null);
  const completedRef = useRef(false);

  const progressValue = useMotionValue(0);
  const progressWidth = useTransform(progressValue, [0, 100], ['0%', '100%']);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  useEffect(() => {
    const controls = animate(progressValue, 100, {
      duration: 1.4,
      ease: [0.23, 1, 0.32, 1], // Ultra-smooth modern ease
      onUpdate: (value) => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(value).toString();
        }
      },
      onComplete: () => {
        setTimeout(() => {
          setPhase('exit');
          setTimeout(() => {
            if (!completedRef.current) {
              completedRef.current = true;
              setPhase('done');
              onComplete?.();
            }
          }, 600);
        }, 180);
      }
    });

    return () => controls.stop();
  }, [onComplete, progressValue]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence mode="wait">
      {phase !== 'exit' && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "brightness(1.8) blur(12px)",
            scale: 1.02
          }}
          transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070f] overflow-hidden"
        >
          {/* Subtle animated grid / tech pattern */}
          <div className="absolute inset-0 opacity-[0.035] mix-blend-screen pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(103,232,249,0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(103,232,249,0.6) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Deep ethereal orb */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: [0.85, 1.15, 0.95],
              opacity: [0.3, 0.65, 0.45]
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-[920px] max-h-[920px] rounded-full blur-[120px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 40% 30%, rgba(103,232,249,0.55) 0%, rgba(59,130,246,0.25) 45%, rgba(147,51,234,0.15) 70%, transparent 90%)'
            }}
          />

          {/* Accent ring */}
          <motion.div
            initial={{ scale: 0.7, rotate: -12 }}
            animate={{ scale: 1.05, rotate: 8 }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-cyan-400/30 rounded-full pointer-events-none"
          />

          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-6">

            {/* Hero Name - Modern Ultra-bold Typography */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <motion.div
                initial={{ letterSpacing: '0.45em' }}
                animate={{ letterSpacing: '-0.025em' }}
                transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <h1 className="text-[13vw] sm:text-[92px] md:text-[110px] lg:text-[128px] font-black tracking-[-0.04em] leading-[0.82] text-white drop-shadow-[0_0_60px_rgba(103,232,249,0.6)]">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-white">Harsh</span>
                  {' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">Kavathiya</span>
                </h1>
              </motion.div>

              {/* Premium reflection / glass effect */}
              <h1
                className="text-[13vw] sm:text-[92px] md:text-[110px] lg:text-[128px] font-black tracking-[-0.04em] leading-[0.82] absolute top-full left-1/2 -translate-x-1/2 scale-y-[-0.65] opacity-10 blur-md pointer-events-none select-none mix-blend-screen"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 35%, rgba(255,255,255,0.9) 80%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 35%, rgba(255,255,255,0.9) 80%)'
                }}
              >
                Harsh Kavathiya
              </h1>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex items-center gap-5"
              >
                <div className="h-px w-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <p className="font-light tracking-[0.125em] text-sm md:text-base text-cyan-100/80 uppercase">
                  Engineering with Passion
                </p>
                <div className="h-px w-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              </motion.div>
            </motion.div>

            {/* Modern Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-20 flex flex-col items-center gap-3"
            >
              <div className="flex items-baseline font-mono text-cyan-100/60 text-sm tracking-[3px]">
                <span ref={counterRef} className="text-2xl tabular-nums">0</span>
                <span className="text-base ml-1">%</span>
              </div>

              {/* Sleek progress bar */}
              <div className="w-48 h-px bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400"
                  style={{ width: progressWidth }}
                />
              </div>
            </motion.div>
          </div>

          {/* Exit Flash - More refined */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            exit={{
              scale: 80,
              opacity: 0.75
            }}
            transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full blur-3xl pointer-events-none z-10 mix-blend-screen"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}