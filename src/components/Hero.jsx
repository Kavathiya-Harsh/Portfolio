import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, MapPin, GraduationCap, Download, CheckCircle2 } from 'lucide-react';
import Typewriter from './Typewriter';
import MagneticButton from './MagneticButton';
import { fadeInUp, viewportOnce } from '../utils/motion';
import { profile } from '../data/profile';

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

  const contentY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const photoScale = useTransform(smoothProgress, [0, 1], [1, 0.88]);
  const photoOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const bgOrb1Y = useTransform(smoothProgress, [0, 1], [0, 80]);
  const bgOrb2Y = useTransform(smoothProgress, [0, 1], [0, 50]);

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
        className="absolute top-20 right-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none animate-pulse"
        style={{ y: bgOrb1Y }}
      />
      <motion.div
        className="absolute bottom-20 left-[5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-cyan-500/5 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none"
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

            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-3 sm:gap-4 mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              {/* Ambient Glows — simplified for mobile performance */}
              <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full hidden md:block" />
              <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full hidden md:block" />
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-mono uppercase tracking-widest mb-0.5">Current Base</p>
                  <p className="text-slate-200 text-xs sm:text-sm font-medium">Kalol & Gandhinagar, Gujarat</p>
                </div>
              </div>

              <div className="h-px bg-white/5 mx-2" />

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-mono uppercase tracking-widest mb-0.5">Education</p>
                  <p className="text-slate-200 text-sm sm:text-base font-bold mb-0.5">B.E in Computer Science</p>
                  <p className="text-slate-400 text-xs sm:text-sm">Shree Swaminarayan University (codinggita)</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                    <span className="text-[10px] sm:text-xs text-slate-500">10th & 12th: Modi School</span>
                  </div>
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
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-blue-600 text-white font-bold shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(37,99,235,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                Let's Build Something <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
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
            className="flex justify-center items-center order-1 lg:order-2"
            style={{ scale: photoScale, opacity: photoOpacity }}
          >
            <div className="relative group">
              {/* Animated gradient glow */}
              <motion.div
                className="absolute -inset-12 sm:-inset-16 rounded-full pointer-events-none"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Orbiting rings */}
              <motion.div
                className="absolute -inset-4 sm:-inset-5 rounded-full border-2 border-dashed border-blue-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-7 sm:-inset-9 rounded-full border border-cyan-400/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />

              {/* Gradient spinning border */}
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-500 p-1.5 shadow-[0_0_80px_-20px_rgba(37,99,235,0.6)]"
                animate={{ rotate: 360 }}
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
                    src="/photo.jpg"
                    alt={profile.name}
                    className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-1000"
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
