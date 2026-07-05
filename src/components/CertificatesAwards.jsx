import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { Award, Medal, Maximize2, X, Sparkles, Shield } from 'lucide-react';
import { certificates, awards } from '../data/certificates';
import { textRevealUp, staggerContainer, viewportOnce } from '../utils/motion';

const mergedItems = [
  ...certificates.map((c) => ({ ...c, isAward: false })),
  ...awards.map((a) => ({ ...a, isAward: true, image: a.image || '/certificates/shaastra_ai.jpg' })),
];



/* ─── Single Certificate Card ──────────────────────────────────────────────── */
function CertificateCard({ item, onClick }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 20, stiffness: 200, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [0, 1], [8, -8]);
  const rotateY = useTransform(springX, [0, 1], [-8, 8]);
  
  const xStr = useTransform(springX, x => `${x * 100}%`);
  const yStr = useTransform(springY, y => `${y * 100}%`);
  
  const isAward = item.isAward;
  const accentRGB = isAward ? '251, 191, 36' : '6, 182, 212';
  const accentHex = isAward ? '#fbbf24' : '#06b6d4';

  const glowBg = useMotionTemplate`radial-gradient(500px circle at ${xStr} ${yStr}, rgba(${accentRGB}, 0.15), transparent 50%)`;
  const borderBg = useMotionTemplate`inset 0 0 0 1px rgba(${accentRGB}, 0.2)`;

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const onMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="group relative w-full cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
      }}
    >
      <motion.div
        className="relative w-full rounded-[2.5rem] p-4 flex flex-col gap-5 overflow-hidden bg-[#0a0f1e] shadow-2xl transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] border border-white/[0.03] group-hover:border-white/[0.08]"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Glow overlay following cursor */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: glowBg }}
        />

        {/* Dynamic Border Glow */}
        <motion.div 
          className="absolute inset-0 z-0 rounded-[2.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-duration-500"
          style={{ boxShadow: borderBg }}
        />

        {/* Image Container */}
        <div className="relative h-48 sm:h-56 w-full rounded-3xl overflow-hidden z-10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]" style={{ transform: 'translateZ(20px)' }}>
          <motion.img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transform"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] pointer-events-none" />
          
          <div className="absolute top-3 left-3 z-20">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest backdrop-blur-md"
              style={{ 
                background: `linear-gradient(135deg, rgba(${accentRGB}, 0.2), rgba(${accentRGB}, 0.05))`, 
                border: `1px solid rgba(${accentRGB}, 0.3)`, 
                color: accentHex,
                boxShadow: `0 4px 12px rgba(${accentRGB}, 0.15)`
              }}
            >
              {isAward ? <Medal className="w-3 h-3" /> : <Award className="w-3 h-3" />}
              {isAward ? 'AWARD' : 'CERTIFICATE'}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg cursor-pointer">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 px-2 pb-2" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-1 transition-colors duration-300">
            {item.title}
          </h3>
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 overflow-hidden">
               <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentHex, boxShadow: `0 0 10px ${accentHex}` }} />
               <p className="text-slate-400 text-sm font-medium truncate group-hover:text-slate-300 transition-colors">{item.issuer}</p>
            </div>
            <span className="shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-md" 
                  style={{ color: accentHex, backgroundColor: `rgba(${accentRGB}, 0.1)`, border: `1px solid rgba(${accentRGB}, 0.2)` }}>
              {item.date}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function CertificatesAwards() {
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    if (!expandedItem) return;
    const onKey = (e) => { if (e.key === 'Escape') setExpandedItem(null); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [expandedItem]);

  if (mergedItems.length === 0) return null;

  const expandedIdx = expandedItem ? mergedItems.findIndex((m) => m.id === expandedItem.id) : -1;

  return (
    <section id="certificates" className="py-28 relative overflow-hidden">
      {/* Breathing ambient blobs */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ top: '15%', left: '8%', width: 500, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ bottom: '10%', right: '5%', width: 450, height: 280, background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', filter: 'blur(90px)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 10, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 px-6">
        {/* ─── Header ────────────────────────────────────────────── */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewportOnce}
          variants={staggerContainer(0.1, 0)}
          className="text-center mb-16"
        >
          <motion.div variants={textRevealUp} className="inline-flex items-center gap-2 mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.22em]"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: '#60a5fa' }}
            >
              <Sparkles className="w-3 h-3" />
              Showcase & Recognition
            </span>
          </motion.div>

          <motion.h2
            variants={textRevealUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] mb-5 text-white"
          >
            Official{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Credentials
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #22d3ee, #3b82f6, transparent)' }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </motion.h2>

          <motion.p variants={textRevealUp} className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Hackathon wins, technical certifications, and industry recognitions — all in one place.
          </motion.p>
        </motion.div>
      </div>

      {/* ─── Staggered Grid Layout ─────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
          hidden: {}
        }}
        className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        {mergedItems.map((item) => (
          <CertificateCard key={item.id} item={item} onClick={() => setExpandedItem(item)} />
        ))}
      </motion.div>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-16 flex flex-wrap items-center justify-center gap-5 px-6 relative z-10"
      >
        {[
          { icon: <Award className="w-4 h-4" />, val: `${mergedItems.length}`, lab: 'Credentials', col: '#a5b4fc' },
          { icon: <Sparkles className="w-4 h-4" />, val: '5x', lab: 'Hackathons', col: '#d4af37' },
          { icon: <Shield className="w-4 h-4" />, val: '7+', lab: 'Institutions', col: '#6ee7b7' },
        ].map((s) => (
          <div
            key={s.lab}
            className="flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span style={{ color: s.col }}>{s.icon}</span>
            <div>
              <p className="font-black text-white text-lg leading-none">{s.val}</p>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-0.5">{s.lab}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ─── Lightbox ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="cert-lb-title"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 lg:p-10"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)' }}
            onClick={() => setExpandedItem(null)}
          >
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 380, damping: 22 }}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10 flex h-10 w-10 items-center justify-center rounded-xl border text-white/70 hover:text-white transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); setExpandedItem(null); }}
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(12,18,36,0.98), rgba(6,9,17,0.99))',
                border: '1px solid rgba(212,175,55,0.18)',
                boxShadow: '0 60px 140px -40px rgba(0,0,0,0.9), 0 0 80px rgba(212,175,55,0.06)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4af37 40%, #f5e07a 60%, transparent)' }} />

              <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh] overflow-y-auto lg:overflow-hidden lg:max-h-[85vh]">
                <div className="relative flex items-center justify-center p-6 sm:p-8" style={{ background: 'rgba(5,9,18,0.6)' }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 40% 40%, rgba(99,102,241,0.08), transparent 60%)' }} />
                  <div className="relative z-10 w-full rounded-xl overflow-hidden" style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8)' }}>
                    <img src={expandedItem.image} alt={expandedItem.title} loading="eager" decoding="async" fetchPriority="high" className="w-full object-contain max-h-[55vh] lg:max-h-[70vh]" />
                  </div>
                </div>

                <aside className="relative flex flex-col justify-between gap-8 p-7 sm:p-9 lg:border-l" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="absolute left-0 top-0 bottom-0 w-px hidden lg:block" style={{ background: 'linear-gradient(to bottom, #d4af3755, rgba(99,102,241,0.25), transparent)' }} />
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.2em]"
                        style={{
                          background: expandedItem.isAward ? 'rgba(245,158,11,0.10)' : 'rgba(99,102,241,0.10)',
                          border: `1px solid ${expandedItem.isAward ? 'rgba(245,158,11,0.28)' : 'rgba(99,102,241,0.28)'}`,
                          color: expandedItem.isAward ? '#fbbf24' : '#a5b4fc',
                        }}
                      >
                        {expandedItem.isAward ? <Medal className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                        {expandedItem.isAward ? 'Award' : 'Certificate'}
                      </span>
                      <span className="font-mono text-[11px] text-slate-600">{expandedIdx + 1} / {mergedItems.length}</span>
                    </div>

                    <h3 id="cert-lb-title" className="text-white font-extrabold text-2xl sm:text-3xl leading-tight tracking-tight mb-6">
                      {expandedItem.title}
                    </h3>

                    <div className="flex items-start gap-4 mb-5 pl-4 border-l-2" style={{ borderColor: '#d4af3755' }}>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 mb-1">Issued by</p>
                        <p className="text-sm sm:text-base font-semibold text-slate-200">{expandedItem.issuer}</p>
                      </div>
                    </div>

                    <div className="inline-flex items-baseline gap-2 px-4 py-2.5 rounded-xl mb-6" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Date</span>
                      <span className="font-mono text-sm text-amber-200/90">{expandedItem.date}</span>
                    </div>

                    {expandedItem.description && (
                      <div className="border-t pt-6" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500 mb-3">About</p>
                        <p className="text-sm leading-relaxed text-slate-400">{expandedItem.description}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Press <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">Esc</kbd> or tap outside to close
                  </p>
                </aside>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
