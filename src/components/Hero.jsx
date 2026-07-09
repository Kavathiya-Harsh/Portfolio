import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Download from 'lucide-react/dist/esm/icons/download';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Typewriter from './Typewriter';
import MagneticButton from './MagneticButton';
import MouseGlow from './MouseGlow';

import { profile } from '../data/profile';
import { useBreakpoint } from '../utils/useBreakpoint';
import { usePerformance } from '../context/PerformanceContext';

/* ─── Shared easing ─────────────────────────────────── */
const EXPO = [0.16, 1, 0.3, 1];

/* ─── Stagger container variant ─────────────────────── */
const staggerContainer = (stagger = 0.09, delay = 0, instant = false) => ({
  hidden: {},
  visible: { transition: { staggerChildren: instant ? 0 : stagger, delayChildren: instant ? 0 : delay } },
});

/* ─── Standard child variant ─────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } },
};

/* Instant variant — zero delay/duration for immediate paint (LCP) */
const fadeUpInstant = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

/* ─────────────────────────────────────────────────────── */
/* Animated Name — char-by-char, only once isReady fires  */
/* ─────────────────────────────────────────────────────── */
function AnimatedName({ firstName, lastName, isReady, instant = false }) {
  const chars = [];
  firstName.split('').forEach((c, i) => chars.push({ c, gradient: false, idx: i }));
  chars.push({ c: ' ', gradient: false, idx: firstName.length });
  lastName.split('').forEach((c, i) =>
    chars.push({ c, gradient: true, idx: firstName.length + 1 + i })
  );

  return (
    <motion.h1
      className="font-bold tracking-tighter leading-[1.25] mb-8 pb-3 whitespace-nowrap cursor-default overflow-visible"
      style={{ fontSize: 'clamp(1.7rem, 5.5vw, 5.25rem)' }}
      initial={instant ? 'visible' : 'hidden'}
      animate={isReady ? 'visible' : 'hidden'}
      whileHover={{ textShadow: "0px 0px 25px rgba(6,182,212,0.4)" }}
      aria-label={`Harsh Kavathiya — Full Stack Developer & Problem Solver`}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: instant ? 0 : 0.042, delayChildren: instant ? 0 : 0.05 } },
      }}
    >
      {chars.map((item, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          variants={instant ? {
            hidden: { opacity: 1, y: 0, rotateX: 0 },
            visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0 } },
          } : {
            hidden: { opacity: 0, y: 38, rotateX: -55 },
            visible: {
              opacity: 1, y: 0, rotateX: 0,
              transition: { duration: 0.55, ease: EXPO },
            },
          }}
          className={`inline-block will-change-transform ${item.gradient
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'
            : 'text-white'
            }`}
          style={{ transformOrigin: 'center bottom', perspective: '700px' }}
        >
          {item.c === ' ' ? '\u00A0' : item.c}
        </motion.span>
      ))}
    </motion.h1>
  );
}

/* ─────────────────────────────────────────────────────── */
/* InfoCard — location + education glassmorphism card     */
/* ─────────────────────────────────────────────────────── */
function InfoCard({ isLowPower }) {
  return (
    <div className="relative group/card mb-7 sm:mb-8">
      {/* Gradient border glow */}
      <div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(56,189,248,0.18) 0%, rgba(99,102,241,0.15) 60%, rgba(56,189,248,0.08) 100%)',
        }}
      />
      {/* Card body */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: 'rgba(7,11,22,0.82)', backdropFilter: 'blur(24px)' }}
      >
        {/* Hover shimmer */}
        {!isLowPower && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-110%', opacity: 0 }}
            whileHover={{ x: '110%', opacity: 1 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent)',
            }}
          />
        )}

        {/* Ambient blobs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-cyan-500/8 blur-[55px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-500/8 blur-[45px] rounded-full pointer-events-none" />

        <div className="p-3.5 sm:p-4 space-y-0.5">
          {/* Location row */}
          <motion.div
            whileHover={{ x: 5, background: 'rgba(56,189,248,0.06)' }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl cursor-default transition-all duration-200"
          >
            <div className="relative shrink-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(56,189,248,0.16), rgba(56,189,248,0.06))',
                  border: '1px solid rgba(56,189,248,0.22)',
                  boxShadow: '0 0 16px rgba(56,189,248,0.1)',
                }}
              >
                <MapPin className="w-4 h-4 text-cyan-400" />
              </div>
              {/* Live ping */}
              <span className="absolute -top-0.5 -right-0.5 flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-40" />
                <span
                  className="relative inline-flex rounded-full w-2.5 h-2.5 bg-cyan-500"
                  style={{ boxShadow: '0 0 6px rgba(56,189,248,0.7)' }}
                />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] mb-0.5 text-cyan-400/60">
                Current Base
              </p>
              <p className="text-white text-sm font-semibold leading-tight">
                Kalol &amp; Gandhinagar,{' '}
                <span className="text-cyan-400">Gujarat</span>
              </p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-500/40 ml-auto shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity" />
          </motion.div>

          {/* Divider */}
          <div
            className="mx-3 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)' }}
          />

          {/* Education row */}
          <motion.div
            whileHover={{ x: 5, background: 'rgba(99,102,241,0.06)' }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="flex items-start gap-3 sm:gap-4 p-3 rounded-xl cursor-default transition-all duration-200"
          >
            <div className="shrink-0 mt-0.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(99,102,241,0.06))',
                  border: '1px solid rgba(99,102,241,0.22)',
                  boxShadow: '0 0 16px rgba(99,102,241,0.1)',
                }}
              >
                <GraduationCap className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] mb-0.5 text-indigo-400/60">
                Education
              </p>
              <p className="text-white text-sm font-bold leading-tight mb-1">
                B.E. in Computer Science
              </p>
              <p className="text-slate-400 text-[11px] leading-snug mb-2">
                Shree Swaminarayan University{' '}
                <span className="text-indigo-400/80 font-medium">(CodingGita)</span>
              </p>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] text-slate-400">
                  10th &amp; 12th · <span className="text-slate-300">Modi School</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* PhotoSection — profile photo with premium orb effects  */
/* ─────────────────────────────────────────────────────── */
function PhotoSection({ isLowPower, isReady, isMobile, instant = false }) {
  const [photoError, setPhotoError] = React.useState(false);

  return (
    <motion.div
      initial={instant ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 20 }}
      animate={isReady ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 20 }}
      transition={instant ? { duration: 0 } : { duration: 0.9, ease: EXPO, delay: 0.15 }}
      className="flex justify-center items-center order-1 lg:order-2 will-change-transform relative"
    >
      <div className="relative group perspective-section w-full max-w-md mx-auto">

        {/* Soft background glow tailored for the rectangular card */}
        <motion.div
          className="absolute -inset-10 rounded-[3rem] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 40%, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ambient floating orbs behind the card */}
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/20 blur-[40px] rounded-full pointer-events-none"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none"
          animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Photo Card */}
        <motion.div
          className="relative w-[16rem] sm:w-[19rem] md:w-[21rem] lg:w-[23rem] aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-900 z-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] mx-auto"
          style={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}
          whileHover={{
            y: -8,
            boxShadow: '0 30px 80px -15px rgba(59,130,246,0.3)',
            borderColor: 'rgba(255,255,255,0.25)'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Subtle inner reflection */}
          <div className="absolute inset-0 z-20 pointer-events-none rounded-[2rem]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)' }} />

          {/* Clean gradient overlay at the bottom to blend with dark mode */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/40 to-transparent z-10 pointer-events-none" />

          {!photoError ? (
            <img
              src={profile.photoUrl}
              alt="Harsh Kavathiya - Full Stack Developer"
              fetchpriority="high"
              loading="eager"
              decoding="async"
              // object-[50%_15%] to perfectly frame a portrait shot
              className="w-full h-full object-cover object-[50%_15%] scale-100 group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1] will-change-transform"
              style={{ filter: 'contrast(1.03) saturate(1.05)' }}
              onError={() => setPhotoError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500">
              <span className="text-5xl font-black text-white tracking-widest">{profile.initials}</span>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2 font-mono">Profile</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* Hero — main section                                    */
/* ─────────────────────────────────────────────────────── */
export default function Hero({ isReady = false }) {
  const isMobile = useBreakpoint(1024);
  const { isLowPower } = usePerformance();
  const sectionRef = useRef(null);
  // If isReady was true on mount, this is an instant-paint scenario (mobile/bot)
  const instantRef = useRef(isReady);
  const instant = instantRef.current;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const noParallax = isMobile || isLowPower;
  const contentY = useTransform(smoothProgress, [0, 1], noParallax ? [0, 0] : [0, -55]);
  const bgOrb1Y = useTransform(smoothProgress, [0, 1], noParallax ? [0, 0] : [0, 75]);
  const bgOrb2Y = useTransform(smoothProgress, [0, 1], noParallax ? [0, 0] : [0, 45]);

  const firstName = profile.name.split(' ')[0];
  const lastName = profile.name.split(' ').slice(1).join(' ');

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center pt-20 sm:pt-24 pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* New Interactive 3D Background handles the environment */}

      {/* Mouse glow effect */}
      <MouseGlow />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 items-center">

          {/* ── LEFT: Content ──────────────────────────────────── */}
          <motion.div
            initial={instant ? 'visible' : 'hidden'}
            animate={isReady ? 'visible' : 'hidden'}
            variants={staggerContainer(0.09, 0, instant)}
            className="order-2 lg:order-1 flex flex-col"
            style={{ y: contentY }}
          >
            {/* Status badge */}
            <motion.div variants={instant ? fadeUpInstant : fadeUp} className="mb-5">
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  color: '#34d399',
                  boxShadow: '0 0 20px rgba(16,185,129,0.06)',
                }}
              >
                🚀 Open to Opportunities &amp; Collaboration
              </span>
            </motion.div>

            {/* Animated name */}
            <AnimatedName firstName={firstName} lastName={lastName} isReady={isReady} instant={instant} />

            {/* Typewriter role */}
            <motion.div
              variants={instant ? fadeUpInstant : fadeUp}
              className="text-lg sm:text-xl md:text-2xl font-medium text-slate-300 flex items-center gap-3 mb-7"
            >
              <motion.div
                initial={instant ? { width: 28 } : { width: 0 }}
                animate={isReady ? { width: 28 } : { width: 0 }}
                transition={instant ? { duration: 0 } : { duration: 0.55, delay: 0.5, ease: EXPO }}
                className="h-px bg-blue-500/50 shrink-0 hidden sm:block"
              />
              <Typewriter />
            </motion.div>

            {/* Value Proposition */}
            <motion.div variants={instant ? fadeUpInstant : fadeUp} className="mb-6">
              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                I build scalable, high-performance web applications with clean architecture and modern user experiences.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={instant ? fadeUpInstant : fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8"
            >
              {/* Primary CTA */}
              <MagneticButton
                href="#projects"
                whileHover={{ scale: 1.05, y: -2, boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="relative px-8 py-3.5 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 group overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%', border: '1px solid rgba(6,182,212,0.3)' }}
                title="View My Work"
              >
                {/* Shimmer on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: '-110%' }}
                  whileHover={{ x: '110%' }}
                  transition={{ duration: 0.6 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                />
                🚀 View My Work
              </MagneticButton>

              {/* Secondary CTA */}
              <MagneticButton
                href="#contact"
                whileHover={{ scale: 1.05, y: -2, boxShadow: '0 14px 32px -8px rgba(139,92,246,0.3)', borderColor: 'rgba(139,92,246,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 text-slate-300 hover:text-white transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
                title="Let's Connect"
              >
                📩 Let's Connect
              </MagneticButton>
            </motion.div>

            {/* Minimal Info Row */}
            <motion.div variants={instant ? fadeUpInstant : fadeUp} className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gujarat, India</span>
              <span className="mx-2 opacity-50">•</span>
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Computer Science Graduate</span>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Photo ────────────────────────────────────── */}
          <PhotoSection isLowPower={isLowPower} isReady={isReady} isMobile={isMobile} instant={instant} />
        </div>
      </div>
    </section>
  );
}
