import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Award, Medal, Maximize2, X, Sparkles, Shield } from 'lucide-react';
import { certificates, awards } from '../data/certificates';
import { textRevealUp, staggerContainer, viewportOnce } from '../utils/motion';

const mergedItems = [
  ...certificates.map((c) => ({ ...c, isAward: false })),
  ...awards.map((a) => ({ ...a, isAward: true, image: a.image || '/certificates/shaastra_ai.jpg' })),
];

const row1 = mergedItems.slice(0, Math.ceil(mergedItems.length / 2));
const row2 = mergedItems.slice(Math.ceil(mergedItems.length / 2));

/* ─── Infinite Marquee Row ─────────────────────────────────────────────── */
function MarqueeRow({ items, direction = 'left', speed = 35, onCardClick }) {
  const [paused, setPaused] = useState(false);
  // Triple the items for seamless loop
  const tripled = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex gap-5 w-max"
        animate={{ x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'] }}
        transition={{
          x: { duration: speed, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
        }}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {tripled.map((item, i) => (
          <MarqueeCard key={`${item.id}-${i}`} item={item} onClick={() => onCardClick(item)} />
        ))}
      </motion.div>
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#060911] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#060911] to-transparent pointer-events-none z-10" />
    </div>
  );
}

/* ─── Single Marquee Card ──────────────────────────────────────────────── */
function MarqueeCard({ item, onClick }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 220, damping: 26 });
  const sy = useSpring(my, { stiffness: 220, damping: 26 });
  const rotX = useTransform(sy, [0, 1], [6, -6]);
  const rotY = useTransform(sx, [0, 1], [-6, 6]);
  const glowX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glowY = useTransform(sy, [0, 1], ['0%', '100%']);

  const isAward = item.isAward;
  const accent = isAward ? '#fbbf24' : '#818cf8';

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group relative flex-shrink-0 w-[320px] sm:w-[380px] cursor-pointer select-none"
      style={{ perspective: '900px' }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden h-full"
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
      >
        {/* Border glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${accent}44, 0 0 30px -8px ${accent}22` }}
        />
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-30"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)' }}
        />

        {/* Cursor glow */}
        <motion.div
          className="absolute w-64 h-64 rounded-full pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{
            left: glowX, top: glowY, x: '-50%', y: '-50%',
            background: `radial-gradient(circle, ${accent}30 0%, transparent 65%)`,
            filter: 'blur(16px)',
          }}
        />

        {/* Image */}
        <div className="relative overflow-hidden bg-slate-950" style={{ aspectRatio: '16/10' }}>
          <motion.img
            src={item.image}
            alt={item.title}
            width="380" height="238"
            loading="lazy" decoding="async"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/20 to-transparent opacity-60 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none" />

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)' }}
          />

          {/* Type badge */}
          <div className="absolute top-3 left-3 z-20">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest backdrop-blur-md border"
              style={{ background: `${accent}18`, borderColor: `${accent}33`, color: accent }}
            >
              {isAward ? <Medal className="w-2.5 h-2.5" /> : <Award className="w-2.5 h-2.5" />}
              {isAward ? 'Award' : 'Cert'}
            </span>
          </div>

          {/* Expand icon */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            <div className="p-2 rounded-lg bg-white/[0.06] backdrop-blur-xl border border-white/10">
              <Maximize2 className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div
          className="relative z-10 p-4"
          style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #080d1a 100%)' }}
        >
          <h3 className="text-white font-bold text-sm leading-snug mb-1 line-clamp-1 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.1)] transition-all duration-300">
            {item.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <p className="text-slate-500 text-[11px] font-mono truncate">{item.issuer}</p>
            <span className="shrink-0 text-[10px] font-mono text-slate-600">{item.date}</span>
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
    <section id="certificates" className="py-28 relative overflow-hidden" style={{ background: '#060911' }}>
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

      {/* ─── Marquee Rows (full width) ─────────────────────────── */}
      <div className="space-y-5 relative z-10">
        <MarqueeRow items={row1} direction="left"  speed={40} onCardClick={setExpandedItem} />
        <MarqueeRow items={row2} direction="right" speed={45} onCardClick={setExpandedItem} />
      </div>

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
