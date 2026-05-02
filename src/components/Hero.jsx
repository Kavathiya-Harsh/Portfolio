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
      className="font-bold tracking-tighter leading-[1.05] mb-4 whitespace-nowrap"
      style={{ fontSize: 'clamp(1.7rem, 5.5vw, 5.25rem)' }}
      initial={instant ? 'visible' : 'hidden'}
      animate={isReady ? 'visible' : 'hidden'}
      aria-label={`Harsh Kavathiya — Full Stack Developer & 5x Hackathon Winner`}
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
          className={`inline-block will-change-transform ${
            item.gradient
              ? 'bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent'
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
      className="flex justify-center items-center order-1 lg:order-2 will-change-transform"
    >
      <div className="relative group">
        {/* Outer glow pulse */}
        <motion.div
          className="absolute -inset-16 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orbiting dashed ring */}
        <motion.div
          className="absolute -inset-5 rounded-full border-2 border-dashed border-blue-500/20"
          animate={!isLowPower ? { rotate: 360 } : {}}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
        {/* Outer static ring */}
        <motion.div
          className="absolute -inset-9 rounded-full border border-cyan-400/8"
          animate={!isLowPower ? { rotate: -360 } : {}}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        />

        {/* Spinning gradient border */}
        <motion.div
          className="absolute -inset-1 rounded-full p-[3px]"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6)',
            boxShadow: '0 0 70px -18px rgba(37,99,235,0.65)',
          }}
          animate={!isLowPower ? { rotate: 360 } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full bg-[#080d1a]" />
        </motion.div>

        {/* Floating accent dots */}
        {[
          { top: '16%', right: '-10px', delay: 0 },
          { top: '50%', left: '-10px', delay: 0.9 },
          { top: '80%', right: '-10px', delay: 1.8 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-400/70"
            style={{ ...dot, boxShadow: '0 0 8px rgba(59,130,246,0.7)' }}
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Photo */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] rounded-full overflow-hidden border-[5px] border-[#080d1a] bg-slate-800 z-10 shadow-2xl">
          {!photoError ? (
            <picture>
              <source 
                media="(max-width: 1024px)" 
                srcSet="https://res.cloudinary.com/dvv5mtpli/image/upload/q_auto,f_auto,w_400/v1776351778/Harsh_Kavathiya_Profile_duaqrs.jpg" 
              />
              <source 
                media="(min-width: 1025px)" 
                srcSet="https://res.cloudinary.com/dvv5mtpli/image/upload/q_auto,f_auto,w_800/v1776351778/Harsh_Kavathiya_Profile_duaqrs.jpg" 
              />
              <img
                src="https://res.cloudinary.com/dvv5mtpli/image/upload/q_auto,f_auto,w_800/v1776351778/Harsh_Kavathiya_Profile_duaqrs.jpg"
                alt="Harsh Kavathiya - Full Stack Developer & Hackathon Winner"
                width="352"
                height="352"
                fetchpriority="high"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-[1.2s] will-change-transform"
                onError={() => setPhotoError(true)}
              />
            </picture>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500">
              <span className="text-5xl font-black text-white tracking-widest">{profile.initials}</span>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2 font-mono">Profile</p>
            </div>
          )}
        </div>


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
  const bgOrb1Y  = useTransform(smoothProgress, [0, 1], noParallax ? [0, 0] : [0, 75]);
  const bgOrb2Y  = useTransform(smoothProgress, [0, 1], noParallax ? [0, 0] : [0, 45]);

  const firstName = profile.name.split(' ')[0];
  const lastName  = profile.name.split(' ').slice(1).join(' ');

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center pt-20 sm:pt-24 pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background orbs */}
      <motion.div
        className="absolute top-24 right-[8%] w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] rounded-full pointer-events-none will-change-transform"
        style={{ y: bgOrb1Y, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <motion.div
        className="absolute bottom-20 left-[3%] w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] rounded-full pointer-events-none will-change-transform"
        style={{ y: bgOrb2Y, background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

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
                <Sparkles className="w-3 h-3" />
                Open to Innovation &amp; Collaboration
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

            {/* Info card */}
            <motion.div variants={instant ? fadeUpInstant : fadeUp}>
              <InfoCard isLowPower={isLowPower} />
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={instant ? fadeUpInstant : fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              {/* Primary CTA */}
              <MagneticButton
                href="#contact"
                whileHover={{ scale: 1.04, y: -3, boxShadow: '0 18px 40px -10px rgba(37,99,235,0.55)' }}
                whileTap={{ scale: 0.97 }}
                className="relative px-7 py-3.5 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 group overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', border: '1px solid rgba(96,165,250,0.2)' }}
                title="Contact Harsh Kavathiya"
              >
                {/* Shimmer on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: '-110%' }}
                  whileHover={{ x: '110%' }}
                  transition={{ duration: 0.6 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                />
                Let's Build Something
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </MagneticButton>

              {/* Secondary CTA */}
              <MagneticButton
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -3, boxShadow: '0 14px 32px -8px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
                title="Download Harsh Kavathiya's Resume"
              >
                <Download className="w-4 h-4" />
                Download CV
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Photo ────────────────────────────────────── */}
          <PhotoSection isLowPower={isLowPower} isReady={isReady} isMobile={isMobile} instant={instant} />
        </div>
      </div>
    </section>
  );
}
