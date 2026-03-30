import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const firstName = 'Harsh';
const lastName = 'Kavathiya';
const slogan = 'Engineering with Passion • Designing with Purpose';
const totalChars = firstName.length + 1 + lastName.length;
const charDelay = 0.04;
const nameAnimDur = totalChars * charDelay + 0.5;

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('name'); // name → slogan → exit
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Reduce particle count for mobile
  const particleCount = isMobile ? 8 : 18;

  useEffect(() => {
    // Phase 1: Name reveal
    // Phase 2: Slogan/Role reveal — faster transition
    const t1 = setTimeout(() => setPhase('role'), (nameAnimDur + 0.1) * 1000);
    // Phase 3: Exit — start exit sooner
    const t2 = setTimeout(() => setPhase('exit'), (nameAnimDur + 1.2) * 1000);
    // Phase 4: Complete — fire callback quickly after exit starts
    const t3 = setTimeout(() => onComplete?.(), (nameAnimDur + 1.8) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {phase !== 'complete' && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={phase === 'exit' ? { opacity: 0, scale: 1.05, filter: 'blur(10px)' } : { opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #080d1a 0%, #0c1629 40%, #0a1628 100%)' }}
        >
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />

          {/* Animated gradient orbs — simplified */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ top: '15%', left: '10%' }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-full h-full rounded-full bg-blue-600/20 blur-[100px]" />
          </motion.div>
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
            style={{ bottom: '10%', right: '10%' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <div className="w-full h-full rounded-full bg-cyan-500/15 blur-[100px]" />
          </motion.div>

          {/* Rising particles — reduced count */}
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1.5px] h-[1.5px] rounded-full"
              style={{
                left: `${5 + Math.random() * 90}%`,
                bottom: '-2%',
                background: i % 2 === 0 ? '#60a5fa' : '#22d3ee',
              }}
              animate={{
                y: [0, -900],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-4xl w-full">
            
            {/* Main Name Group */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center items-baseline gap-x-4 sm:gap-x-6">
                {/* First name */}
                <div className="flex">
                  {firstName.split('').map((char, i) => (
                    <motion.span
                      key={`f-${i}`}
                      initial={{ opacity: 0, y: 60, rotateX: -90, scale: 0.6 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                      transition={{
                        delay: 0.3 + i * charDelay,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-6xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter inline-block will-change-transform"
                      style={{
                        transformOrigin: 'center bottom',
                        perspective: '1000px',
                        textShadow: '0 20px 50px rgba(0,0,0,0.5)',
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                {/* Last name */}
                <div className="flex">
                  {lastName.split('').map((char, i) => (
                    <motion.span
                      key={`l-${i}`}
                      initial={{ opacity: 0, y: 60, rotateX: -90, scale: 0.6 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                      transition={{
                        delay: 0.3 + (firstName.length + 1 + i) * charDelay,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter inline-block will-change-transform bg-gradient-to-br from-blue-400 via-cyan-300 to-indigo-500 bg-clip-text text-transparent"
                      style={{
                        transformOrigin: 'center bottom',
                        perspective: '1000px',
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Slogan & Role Reveal */}
            <div className="h-16 flex flex-col items-center justify-center gap-3">
              <AnimatePresence mode="wait">
                {(phase === 'role' || phase === 'exit') && (
                  <motion.div
                    key="slogan-box"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center gap-3"
                  >
                    {/* Slogan */}
                    <motion.p
                      initial={{ opacity: 0, letterSpacing: '0.5em', y: 8 }}
                      animate={{ opacity: 1, letterSpacing: '0.25em', y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="text-sm sm:text-lg font-medium text-blue-100/90 text-center tracking-[0.25em]"
                    >
                      {slogan}
                    </motion.p>

                    {/* Decorative line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                    />

                    {/* Role */}
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.5em] text-cyan-400 animate-pulse"
                    >
                      Full Stack Developer
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 sm:w-80 h-[2px] bg-white/5 rounded-full overflow-hidden mt-2 relative">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 1.6,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                style={{ transformOrigin: 'left center' }}
              />
              {/* Shimmer effect on bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
