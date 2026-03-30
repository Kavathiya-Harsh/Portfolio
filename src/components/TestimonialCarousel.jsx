import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '../data/testimonials';
import {
  textRevealUp,
  smoothFadeIn,
  staggerContainer,
  viewportOnce,
} from '../utils/motion';

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  const t = testimonials[index];

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header with text reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1, 0)}
          className="text-center"
        >
          <motion.h2
            variants={textRevealUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            What People Say
          </motion.h2>
          <motion.p
            variants={textRevealUp}
            className="text-slate-300 mb-12"
          >
            Kind words from colleagues and clients.
          </motion.p>
        </motion.div>

        {/* Card with smooth entrance */}
        <motion.div
          variants={smoothFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
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
          className="relative group overflow-hidden rounded-2xl border border-white/12 bg-slate-800/50 backdrop-blur-md p-8 md:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(59, 130, 246,0.14), transparent 60%)',
              mixBlendMode: 'screen',
            }}
          />
          <Quote className="absolute top-6 right-6 w-10 h-10 text-[#3b82f6]/30" />
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-8 pr-12">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/12"
                />
                <div>
                  <p className="font-semibold text-white">{t.author}</p>
                  <p className="text-sm text-slate-300">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/12">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              className="p-2 rounded-lg text-slate-400 hover:text-[#3b82f6] hover:bg-slate-800/50 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === index ? 'bg-[#3b82f6] w-6' : 'bg-white/20'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % total)}
              className="p-2 rounded-lg text-slate-400 hover:text-[#3b82f6] hover:bg-slate-800/50 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
