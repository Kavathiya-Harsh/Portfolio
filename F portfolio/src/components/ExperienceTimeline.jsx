import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { experience } from '../data/experience';
import { maskReveal, staggerItem, transitionSpring } from '../utils/motion';

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

  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.6]);

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          variants={maskReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Experience
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transitionSpring, delay: 0.05 }}
          className="text-slate-400 mb-12"
        >
          Career and education journey.
        </motion.p>

        <div className="relative">
          {/* Static background track */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/10 rounded-full" />

          {/* Animated glowing fill line */}
          <motion.div
            className="absolute left-[19px] top-2 w-px rounded-full origin-top"
            style={{
              scaleY,
              height: 'calc(100% - 1rem)',
              background: 'linear-gradient(to bottom, #3b82f6, #06b6d4)',
              boxShadow: '0 0 12px 2px rgba(59, 130, 246,0.7)',
              opacity: glowOpacity,
            }}
          />

          {experience.map((item, i) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ ...transitionSpring, delay: i * 0.1 }}
              className="relative pl-16 pb-12 last:pb-0"
            >
              {/* Timeline node */}
              <motion.div
                className="absolute left-0 top-2 w-10 h-10 rounded-full border-2 border-[#3b82f6] bg-[#0b1120] flex items-center justify-center z-10"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...transitionSpring, delay: i * 0.1 + 0.1 }}
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
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.description}</p>
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
