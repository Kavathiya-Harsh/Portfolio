import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { experience } from '../data/experience';
import {
  textRevealUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
  transitionSpring,
  viewportOnce,
} from '../utils/motion';
import { useBreakpoint } from '../utils/useBreakpoint';

export default function ExperienceTimeline() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const isMobile = useBreakpoint(1024);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [0.6, 0.6, 0.6] : [0.3, 1, 0.6]);
  const finalScaleY = useTransform(scaleY, (v) => isMobile ? 1 : v);

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header with text reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1, 0)}
        >
          <motion.h2
            variants={textRevealUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Experience
          </motion.h2>
          <motion.p
            variants={textRevealUp}
            className="text-slate-300 mb-12"
          >
            Career and education journey.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Static background track */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/10 rounded-full" />

          {/* Animated glowing fill line */}
          <motion.div
            className="absolute left-[19px] top-2 w-px rounded-full origin-top"
            style={{
              scaleY: finalScaleY,
              height: 'calc(100% - 1rem)',
              background: 'linear-gradient(to bottom, #3b82f6, #06b6d4)',
              boxShadow: '0 0 12px 2px rgba(59, 130, 246,0.7)',
              opacity: glowOpacity,
            }}
          />

          {experience.map((item, i) => (
            <motion.div
              key={item.id}
              variants={i % 2 === 0 ? slideInLeft : slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ ...transitionSpring, delay: i * 0.12 }}
              className="relative pl-16 pb-12 last:pb-0"
            >
              {/* Timeline node — enhanced pop-in with rotation */}
              <motion.div
                className="absolute left-0 top-2 w-10 h-10 rounded-full border-2 border-[#3b82f6] bg-[#0b1120] flex items-center justify-center z-10"
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: i * 0.12 + 0.1,
                }}
                whileHover={{ scale: 1.15 }}
              >
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_12px_4px_rgba(59, 130, 246,0.5)]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                />
              </motion.div>

              {/* Card */}
              <motion.div
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--mx', `${x}%`);
                  e.currentTarget.style.setProperty('--my', `${y}%`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mx', `50%`);
                  e.currentTarget.style.setProperty('--my', `50%`);
                }}
                className="relative group overflow-hidden rounded-xl border border-white/12 bg-slate-800/50 backdrop-blur-md p-5 hover:border-blue-500/20 transition-colors"
                whileHover={{ x: 4 }}
                transition={transitionSpring}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(59, 130, 246,0.12), transparent 60%)',
                    mixBlendMode: 'screen',
                  }}
                />
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <span className="text-xs font-mono text-[#06b6d4]">{item.period}</span>
                </div>
                <p className="text-blue-300/90 text-sm font-medium mb-2">{item.company}</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">{item.description}</p>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="space-y-1">
                    {item.highlights.map((h) => (
                      <li key={h} className="text-slate-500 text-sm flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">▹</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
