/**
 * LoadingScreen — cinematic intro animation
 * Performance: GPU-composited (transform + opacity only), stable particles,
 *              will-change scoped, clean unmount, zero layout thrash.
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from '../context/PerformanceContext';

/* ─── CONSTANTS ─────────────────────────────────────── */
const FIRST_NAME = 'Harsh';
const LAST_NAME  = 'Kavathiya';
const SLOGAN     = 'Engineering with Passion \u2022 Designing with Purpose';
const ROLE       = 'Full Stack Developer';

// Per-character stagger
const F_DELAY = 0.22;   // delay before first char of firstName
const F_STEP  = 0.055;  // stagger per char — firstName
const L_DELAY = 0.52;   // delay before firstchar of lastName
const L_STEP  = 0.048;  // stagger per char — lastName

// When last char of lastName finishes landing (~0.65s animation)
const NAME_DONE = L_DELAY + LAST_NAME.length * L_STEP + 0.5; // ≈ 1.45s (previously 1.69s)

// Phase timestamps (ms) — exit must finish before unmount (overlay fade duration = EXIT_DURATION_SEC)
const EXIT_DURATION_SEC = 0.85;
const EXIT_DURATION_MS = EXIT_DURATION_SEC * 1000;
const T_SLOGAN         = NAME_DONE * 1000;
const HOLD_AFTER_NAME_MS = 1200;
const T_EXIT           = NAME_DONE * 1000 + HOLD_AFTER_NAME_MS;
/** Unmount only after exit blur/fade completes — was too short vs Framer duration (visible snap). */
const T_COMPLETE       = T_EXIT + EXIT_DURATION_MS + 120;

/* ─── SHARED EASING ─────────────────────────────────── */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ─── CHAR ANIMATION VARIANTS ───────────────────────── */
const charVariants = {
  hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)', y: 20, filter: 'blur(10px)' },
  visible: (delay) => ({
    opacity: 1, clipPath: 'inset(0% 0 0 0)', y: 0, filter: 'blur(0px)',
    transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ─── COMPONENT ─────────────────────────────────────── */
export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('name'); // name → slogan → exit → done
  const timersRef = useRef([]);
  const completedRef = useRef(false);
  const { isLowPower } = usePerformance();

  /* detect mobile once */
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  /* stable particles — computed once, never re-randomised */
  const particles = useMemo(() => {
    let count = isMobile ? 10 : 24;
    if (isLowPower) count = Math.max(6, Math.floor(count * 0.5));
    return Array.from({ length: count }, (_, i) => {
      const t = i / count;
      return {
        id:       i,
        left:     `${3 + t * 94}%`,
        duration: 4.5 + (i % 6) * 0.8,
        delay:    (i * 0.28) % 3.5,
        color:    ['#60a5fa', '#22d3ee', '#818cf8'][i % 3],
        size:     i % 4 === 0 ? 2.5 : 1.8,
      };
    });
  }, [isMobile, isLowPower]);

  /* viewport height ref — no recalc on tick */
  const vhRef = useRef(typeof window !== 'undefined' ? window.innerHeight + 60 : 860);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const push = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timersRef.current.push(id);
    };
    push(() => setPhase('slogan'), T_SLOGAN);
    push(() => setPhase('exit'), T_EXIT);
    push(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      setPhase('done');
      onComplete?.();
    }, T_COMPLETE);
    return () => timersRef.current.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="loading-screen"
        initial={{ opacity: 1 }}
        animate={
          phase === 'exit'
            ? { opacity: 0, scale: 1.05, filter: 'blur(10px)' }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: EXIT_DURATION_SEC, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(150deg, #060c1a 0%, #0b1628 55%, #07101f 100%)',
          contain: 'strict',
        }}
        aria-hidden="true"
      >
        {/* Subtle Cinematic Grain */}
        <div className="absolute inset-0 z-50 pointer-events-none bg-noise opacity-[0.022]" />

        {/* ── SUBTLE GRID ────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.022,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),' +
              'linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* ── AMBIENT ORBS (GPU blur, no layout) ─────── */}
        <motion.div
          aria-hidden="true"
          className="absolute pointer-events-none rounded-full"
          style={{ width: 520, height: 520, top: '-5%', left: '-8%', willChange: 'transform, opacity' }}
          animate={
            isLowPower
              ? { scale: 1, opacity: 0.12 }
              : { scale: [1, 1.28, 1], opacity: [0.09, 0.2, 0.09] }
          }
          transition={
            isLowPower
              ? { duration: 0 }
              : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(59,130,246,0.18)', filter: isLowPower ? 'blur(64px)' : 'blur(110px)' }} />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="absolute pointer-events-none rounded-full"
          style={{ width: 440, height: 440, bottom: '-5%', right: '-8%', willChange: 'transform, opacity' }}
          animate={
            isLowPower
              ? { scale: 1, opacity: 0.08 }
              : { scale: [1, 1.22, 1], opacity: [0.06, 0.14, 0.06] }
          }
          transition={
            isLowPower
              ? { duration: 0 }
              : { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
          }
        >
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(6,182,212,0.14)', filter: isLowPower ? 'blur(64px)' : 'blur(110px)' }} />
        </motion.div>

        {/* ── RISING PARTICLES ────────────────────────── */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            aria-hidden="true"
            className="absolute pointer-events-none rounded-full"
            style={{ width: p.size, height: p.size, left: p.left, bottom: '-2%', background: p.color, willChange: 'transform, opacity' }}
            animate={{ y: [0, -vhRef.current], opacity: [0, 0.5, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* ── MAIN CONTENT ─────────────────────────────── */}
        <div
          className="relative z-10 flex flex-col items-center px-4"
          style={{ perspective: '1200px', userSelect: 'none' }}
        >

          {/* FIRST NAME — "Harsh" — cream/off-white */}
          <div className="flex justify-center" style={{ lineHeight: 1.02, marginBottom: '-0.06em' }}>
            {FIRST_NAME.split('').map((char, i) => (
              <motion.span
                key={`f${i}`}
                custom={F_DELAY + i * F_STEP}
                variants={charVariants}
                initial="hidden"
                animate="visible"
                className="inline-block font-black font-heading"
                style={{
                  fontSize: 'clamp(4.5rem, 13vw, 9rem)',
                  color: '#ede9df',                   /* warm cream — matches screenshot */
                  letterSpacing: '-0.03em',
                  transformOrigin: 'center bottom',
                  willChange: 'transform, opacity',
                  textShadow: '0 18px 45px rgba(0,0,0,0.55)',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* LAST NAME — "Kavathiya" — larger, cyan→blue gradient */}
          <div className="flex justify-center" style={{ lineHeight: 1.02 }}>
            {LAST_NAME.split('').map((char, i) => (
              <motion.span
                key={`l${i}`}
                custom={L_DELAY + i * L_STEP}
                variants={charVariants}
                initial="hidden"
                animate="visible"
                className="inline-block font-black font-heading"
                style={{
                  fontSize: 'clamp(4.5rem, 13vw, 9rem)',
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #67e8f9 0%, #38bdf8 28%, #3b82f6 65%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transformOrigin: 'center bottom',
                  willChange: 'transform, opacity',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* SLOGAN + ROLE + LINE — always in DOM, controlled by opacity for LCP */}
          <div className="flex flex-col items-center mt-8" style={{ minHeight: 90 }}>
            <motion.div
              key="sub-content"
              initial={{ opacity: 0, y: 14 }}
              animate={(phase === 'slogan' || phase === 'exit') ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4"
            >
                  {/* Slogan */}
                  <motion.p
                    initial={{ opacity: 0, letterSpacing: '0.55em' }}
                    animate={{ opacity: 0.72, letterSpacing: '0.28em' }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className="text-center font-light text-slate-300"
                    style={{
                      fontSize: 'clamp(0.6rem, 1.5vw, 0.85rem)',
                      letterSpacing: '0.28em',
                      fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
                    }}
                  >
                    {SLOGAN}
                  </motion.p>

                  {/* Role */}
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.55, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.55, ease: 'easeOut' }}
                    className="text-center font-mono uppercase text-cyan-400"
                    style={{
                      fontSize: 'clamp(0.55rem, 1.2vw, 0.7rem)',
                      letterSpacing: '0.55em',
                    }}
                  >
                    {ROLE}
                  </motion.p>

                  {/* Gradient divider */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.85, delay: 0.12, ease: EASE_OUT_EXPO }}
                    style={{
                      width: 'clamp(200px, 38vw, 340px)',
                      height: 1,
                      background: 'linear-gradient(90deg, transparent 0%, #3b82f6 30%, #06b6d4 70%, transparent 100%)',
                      transformOrigin: 'center',
                      willChange: 'transform',
                    }}
                  />
                </motion.div>
          </div>
        </div>

        {/* ── CORNER HUD (very subtle) ─────────────────── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ padding: 40, opacity: 0.055 }}
        >
          <div style={{ width: '100%', height: '100%', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 48, position: 'relative' }}>
            <span style={{ position: 'absolute', top: 24, left: 32, fontSize: 8, fontFamily: '"SF Mono", "Fira Code", monospace', color: '#fff', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.3 }}>
              Portfolio v2.0 // Alpha
            </span>
            <span style={{ position: 'absolute', bottom: 24, right: 32, fontSize: 8, fontFamily: '"SF Mono", "Fira Code", monospace', color: '#fff', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.3 }}>
              Initializing System Diagnostics...
            </span>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
