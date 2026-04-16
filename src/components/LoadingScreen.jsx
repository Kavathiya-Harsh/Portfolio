import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const firstName = 'Harsh';
const lastName  = 'Kavathiya';
const slogan    = 'Engineering with Passion \u2022 Designing with Purpose';

const charDelay  = 0.04;
const nameAnimDur = (firstName.length + 1 + lastName.length) * charDelay + 0.5; // ~1.36s

// Total loader duration = nameAnimDur + 1.8s  ≈ 3.2s
const T_ROLE     = (nameAnimDur + 0.15) * 1000;  // name done → show slogan
const T_EXIT     = (nameAnimDur + 1.3)  * 1000;  // begin fade-out
const T_COMPLETE = (nameAnimDur + 1.9)  * 1000;  // fire onComplete

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('name'); // name → role → exit → done
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('role'),     T_ROLE);
    const t2 = setTimeout(() => setPhase('exit'),     T_EXIT);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, T_COMPLETE);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  // Stable random particles — computed once
  const particles = useMemo(() => {
    const count = isMobile ? 10 : 20;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left:     `${5 + (i / count) * 90 + (i % 3) * 2}%`,
      duration: 4 + (i % 5),
      delay:    (i * 0.4) % 3,
      color:    i % 2 === 0 ? '#60a5fa' : '#22d3ee',
    }));
  }, [isMobile]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        animate={phase === 'exit' ? { opacity: 0, scale: 1.04, filter: 'blur(8px)' } : { opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080d1a 0%, #0c1629 40%, #0a1628 100%)' }}
      >
        {/* ── GRID OVERLAY ── */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* ── GRADIENT ORBS ── */}
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ top: '10%', left: '8%' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.22, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-full bg-blue-600/20 blur-[100px]" />
        </motion.div>
        <motion.div
          className="absolute w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ bottom: '8%', right: '8%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.16, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className="w-full h-full rounded-full bg-cyan-500/15 blur-[100px]" />
        </motion.div>

        {/* ── RISING PARTICLES ── */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute w-[2px] h-[2px] rounded-full pointer-events-none"
            style={{ left: p.left, bottom: '-2%', background: p.color }}
            animate={{ y: [0, -window.innerHeight * 1.05], opacity: [0, 0.45, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-4xl w-full">

          {/* NAME — character flip-in */}
          <div className="flex flex-wrap justify-center items-baseline gap-x-4 sm:gap-x-6">
            {/* First name — white */}
            <div className="flex">
              {firstName.split('').map((char, i) => (
                <motion.span
                  key={`f-${i}`}
                  initial={{ opacity: 0, y: 60, rotateX: -90, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  transition={{ delay: 0.3 + i * charDelay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter inline-block will-change-transform"
                  style={{ transformOrigin: 'center bottom', perspective: '1000px', textShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Last name — gradient */}
            <div className="flex">
              {lastName.split('').map((char, i) => (
                <motion.span
                  key={`l-${i}`}
                  initial={{ opacity: 0, y: 60, rotateX: -90, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  transition={{ delay: 0.3 + (firstName.length + 1 + i) * charDelay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter inline-block will-change-transform bg-gradient-to-br from-blue-400 via-cyan-300 to-indigo-500 bg-clip-text text-transparent"
                  style={{ transformOrigin: 'center bottom', perspective: '1000px' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* SLOGAN + ROLE — appear after name finishes */}
          <div className="flex flex-col items-center gap-3 min-h-[72px]">
            <AnimatePresence>
              {(phase === 'role' || phase === 'exit') && (
                <motion.div
                  key="slogan-block"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Slogan */}
                  <motion.p
                    initial={{ opacity: 0, letterSpacing: '0.45em' }}
                    animate={{ opacity: 1, letterSpacing: '0.25em' }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="text-sm sm:text-base font-medium text-blue-100/90 text-center"
                    style={{ letterSpacing: '0.25em' }}
                  >
                    {slogan}
                  </motion.p>

                  {/* Divider line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="w-64 sm:w-80 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
                  />

                  {/* Role badge */}
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.5 }}
                    className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.5em] text-cyan-400"
                    style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
                  >
                    Full Stack Developer
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PROGRESS BAR — synced to total nameAnimDur */}
          <div className="w-56 sm:w-72 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: nameAnimDur + 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 rounded-full"
              style={{ transformOrigin: 'left center', boxShadow: '0 0 16px rgba(59,130,246,0.8)' }}
            />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', delay: 0.4 }}
            />
          </div>
        </div>

        {/* ── CORNER HUD ── */}
        <div className="absolute inset-0 pointer-events-none p-10 overflow-hidden opacity-[0.07]">
          <div className="h-full w-full border border-white/30 rounded-[3rem] relative">
            <span className="absolute top-6 left-8 text-[8px] font-mono text-white tracking-widest uppercase">
              Portfolio v2.0
            </span>
            <span className="absolute bottom-6 right-8 text-[8px] font-mono text-white tracking-widest uppercase">
              Initializing...
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
