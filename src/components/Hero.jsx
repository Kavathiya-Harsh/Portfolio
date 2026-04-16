import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, MapPin, GraduationCap, Download, CheckCircle2 } from 'lucide-react';
import Typewriter from './Typewriter';
import MagneticButton from './MagneticButton';
import { fadeInUp, viewportOnce } from '../utils/motion';
import { profile } from '../data/profile';
import { useBreakpoint } from '../utils/useBreakpoint';
import { usePerformance } from '../context/PerformanceContext';

// Character-by-character animated title — uses tween (not spring) to avoid blur issues
function AnimatedName({ firstName, lastName }) {
  const allChars = [];
  
  // First name characters
  firstName.split('').forEach((char, i) => {
    allChars.push({ char, isLast: false, index: i });
  });
  // Space
  allChars.push({ char: ' ', isLast: false, index: firstName.length });
  // Last name characters (gradient)
  lastName.split('').forEach((char, i) => {
    allChars.push({ char, isLast: true, index: firstName.length + 1 + i });
  });

  return (
    <motion.h1
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-3 sm:mb-4"
      initial="hidden"
      animate="visible"
      aria-label={`${firstName} ${lastName}`}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.04, delayChildren: 0.2 },
        },
      }}
    >
      {allChars.map((item, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 40, rotateX: -60 },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          className={`inline-block will-change-transform ${
            item.isLast
              ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent'
              : 'text-white'
          }`}
          style={{
            transformOrigin: 'center bottom',
            perspective: '600px',
          }}
        >
          {item.char === ' ' ? '\u00A0' : item.char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export default function Hero() {
  const isMobile = useBreakpoint(1024);
  const { isLowPower } = usePerformance();
  const [photoError, setPhotoError] = React.useState(false);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Simplified parallax strategy to prevent layout hangs
  const contentY = useTransform(smoothProgress, [0, 1], (isMobile || isLowPower) ? [0, 0] : [0, -60]);
  
  // Removed heavy scale/opacity transforms of the main photo during scroll
  // Background parallax reduced if in low power mode
  const bgOrb1Y = useTransform(smoothProgress, [0, 1], (isMobile || isLowPower) ? [0, 0] : [0, 80]);
  const bgOrb2Y = useTransform(smoothProgress, [0, 1], (isMobile || isLowPower) ? [0, 0] : [0, 50]);

  const firstName = profile.name.split(' ')[0];
  const lastName = profile.name.split(' ').slice(1).join(' ');

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background orbs */}
      <motion.div
        className="absolute top-20 right-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none animate-pulse will-change-transform"
        style={{ y: bgOrb1Y }}
      />
      <motion.div
        className="absolute bottom-20 left-[5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-cyan-500/5 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none will-change-transform"
        style={{ y: bgOrb2Y }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">

          {/* LEFT: Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
            className="order-2 lg:order-1"
            style={{ y: contentY }}
          >
            {/* Status Badge */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4 sm:mb-5 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Open to Innovation & Collaboration</span>
            </motion.div>

            {/* Full Name — "Harsh" in white, "Kavathiya" in gradient, single line */}
            <AnimatedName firstName={firstName} lastName={lastName} />

            {/* Role typewriter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl md:text-2xl font-medium text-slate-300 flex items-center gap-3 mb-6 sm:mb-8"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="h-px bg-blue-500/50 hidden sm:block"
              />
              <Typewriter />
            </motion.div>

            {/* ── Info Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6 sm:mb-8 group/card"
            >
              {/* Animated gradient border - Disabled in low power mode */}
              {!isLowPower && (
                <div
                  className="absolute -inset-[1px] rounded-2xl sm:rounded-3xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(19, 44, 55, 0.4) 0%, rgba(99,102,241,0.2) 50%, rgba(56,189,248,0.1) 100%)',
                  }}
                />
              )}

              {/* Card body */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
                style={{ background: 'rgba(8,13,26,0.85)', backdropFilter: 'blur(20px)' }}
              >
                {/* Shimmer sweep on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 1 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                  }}
                />

                {/* Ambient blob */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />

                <div className="p-4 sm:p-5 space-y-1">

                  {/* ── Location Row ── */}
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="group/row flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-xl transition-colors duration-300 cursor-default"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Icon bubble */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0.05) 100%)',
                          border: '1px solid rgba(56,189,248,0.25)',
                          boxShadow: '0 0 16px rgba(56,189,248,0.12)',
                        }}
                      >
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                      </div>
                      {/* Ping dot */}
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 flex">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-40" />
                        <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-cyan-500"
                          style={{ boxShadow: '0 0 6px rgba(56,189,248,0.8)' }} />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] mb-0.5"
                        style={{ color: 'rgba(56,189,248,0.6)' }}>Current Base</p>
                      <p className="text-white text-sm sm:text-[15px] font-semibold leading-tight">
                        Kalol &amp; Gandhinagar,{' '}
                        <span className="text-cyan-400">Gujarat</span>
                      </p>
                    </div>

                    {/* Trailing arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="ml-auto shrink-0 text-cyan-500/50"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>

                  {/* Divider */}
                  <div className="mx-3 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

                  {/* ── Education Row ── */}
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-xl transition-colors duration-300 cursor-default"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Icon bubble */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)',
                          border: '1px solid rgba(99,102,241,0.25)',
                          boxShadow: '0 0 16px rgba(99,102,241,0.12)',
                        }}
                      >
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] mb-0.5"
                        style={{ color: 'rgba(99,102,241,0.6)' }}>Education</p>
                      <p className="text-white text-sm sm:text-[15px] font-bold leading-tight mb-1">
                        B.E. in Computer Science
                      </p>
                      <p className="text-slate-400 text-[11px] sm:text-xs leading-snug mb-2">
                        Shree Swaminarayan University{' '}
                        <span className="text-indigo-400/80 font-medium">(CodingGita)</span>
                      </p>

                      {/* School badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] sm:text-[11px] text-slate-400">
                          10th &amp; 12th · <span className="text-slate-300">Modi School</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </motion.div>


            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-5"
            >
              <MagneticButton
                href="#contact"
                whileHover={{ 
                  scale: 1.05, 
                  y: -4,
                  boxShadow: "0 20px 40px -10px rgba(37,99,235,0.5)"
                }}
                className="px-6 sm:px-8 py-4 rounded-xl sm:rounded-2xl bg-blue-600 text-white font-bold transition-all flex items-center justify-center gap-2 group text-sm sm:text-base border border-blue-400/20"
                title="Contact Harsh Kavathiya"
              >
                Let's Build Something <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.05, 
                  y: -4,
                  boxShadow: "0 20px 40px -10px rgba(212,175,55,0.2)"
                }}
                className="px-6 sm:px-8 py-4 rounded-xl sm:rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                title="Download Harsh Kavathiya's Resume"
              >
                <Download className="w-4 h-4" /> Download CV
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* RIGHT: Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.3 }}
            className="flex justify-center items-center order-1 lg:order-2 will-change-transform"
          >
            <div className="relative group">
              {/* Animated gradient glow — static gradient with composited opacity pulse */}
              <motion.div
                className="absolute -inset-12 sm:-inset-16 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Orbiting rings - Static in low power mode */}
              <motion.div
                className="absolute -inset-4 sm:-inset-5 rounded-full border-2 border-dashed border-blue-500/20"
                animate={!isLowPower ? { rotate: 360 } : {}}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-7 sm:-inset-9 rounded-full border border-cyan-400/10"
                animate={!isLowPower ? { rotate: -360 } : {}}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />

              {/* Gradient spinning border */}
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-500 p-1.5 shadow-[0_0_80px_-20px_rgba(37,99,235,0.6)]"
                animate={!isLowPower ? { rotate: 360 } : {}}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-full h-full rounded-full bg-[#080d1a]" />
              </motion.div>

              {/* Floating dots */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-blue-400/60 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                  style={{
                    top: `${20 + i * 30}%`,
                    left: i === 1 ? '-8px' : 'auto',
                    right: i !== 1 ? '-8px' : 'auto',
                  }}
                  animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}

              {/* Photo */}
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-[4px] sm:border-[6px] border-[#080d1a] bg-slate-800 z-10 shadow-2xl">
                {!photoError ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    width="384"
                    height="384"
                    fetchpriority="high"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-1000 will-change-transform"
                    onError={() => setPhotoError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500">
                    <span className="text-4xl sm:text-6xl font-black text-white tracking-widest">{profile.initials}</span>
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2 font-mono">Profile Avatar</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
