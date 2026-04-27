import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Award, Medal, ChevronLeft, ChevronRight, Maximize2, X, Sparkles } from 'lucide-react';
import { certificates, awards } from '../data/certificates';
import {
  textRevealUp,
  blurScaleIn,
  staggerContainer,
  viewportOnce,
} from '../utils/motion';

// Merge both into one professional collection
const mergedItems = [
  ...certificates.map(c => ({ ...c, isAward: false })),
  ...awards.map(a => ({ ...a, isAward: true, image: a.image || '/certificates/shaastra_ai.jpg' }))
];

/* ─── 3D Tilt Card with Cursor Glow ─────────────────────────────────── */
function TiltCertCard({ item, isCenter, onClick }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);
  const glowX = useTransform(mouseX, [0, 1], [0, 100]);
  const glowY = useTransform(mouseY, [0, 1], [0, 100]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !isCenter) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="w-full h-full cursor-pointer"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="w-full h-full relative rounded-2xl overflow-hidden group"
        style={{
          rotateX: isCenter ? rotateX : 0,
          rotateY: isCenter ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Glass Border Effect */}
        <div className="absolute inset-0 rounded-2xl border border-white/[0.08] z-30 pointer-events-none 
                        group-hover:border-cyan-500/30 transition-colors duration-500" />
        
        {/* Cursor-tracking Glow Orb (only on center card) */}
        {isCenter && (
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
            style={{
              left: glowX,
              top: glowY,
              x: '-50%',
              y: '-50%',
              background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        )}

        {/* Image */}
        <div className="w-full h-full overflow-hidden bg-slate-950">
          <motion.img
            src={item.image}
            alt={item.title}
            width="700"
            height="450"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            whileHover={isCenter ? { scale: 1.06 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Bottom Gradient Overlay — always visible but more opaque on hover */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                        opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none" />

        {/* Title & Issuer — slide up on hover */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-20 flex flex-col gap-2
                        translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          {/* Type Badge */}
          <motion.div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest
                             backdrop-blur-md border transition-all duration-300
                             ${item.isAward 
                               ? 'bg-amber-500/10 border-amber-500/20 text-amber-300 group-hover:border-amber-400/40 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
                               : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                             }`}>
              {item.isAward ? <Medal className="w-3 h-3" /> : <Award className="w-3 h-3" />}
              {item.isAward ? 'Award' : 'Certificate'}
            </span>
          </motion.div>

          {/* Title with shimmer on hover */}
          <h3 className="text-white text-base md:text-lg font-bold line-clamp-1 
                         group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300">
            {item.title}
          </h3>

          {/* Issuer — fades in on hover */}
          <p className="text-slate-400 text-xs font-mono opacity-0 group-hover:opacity-100 
                        -translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
            {item.issuer}
          </p>
        </div>

        {/* Expand Icon — appears on hover with a glow pulse */}
        <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 
                        transition-all duration-300">
          <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 
                          hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]
                          transition-all duration-300">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Subtle scan line effect on hover */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function CertificatesAwards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  /** Full item while lightbox open — drives image + caption */
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    if (!expandedItem) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setExpandedItem(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [expandedItem]);

  if (mergedItems.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % mergedItems.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + mergedItems.length) % mergedItems.length);

  const activeItem = mergedItems[currentIndex];

  return (
    <section id="certificates" className="py-28 px-6 relative overflow-hidden">
      {/* Background ambient glow — dual orbs */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-blue-500/[0.04] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-cyan-500/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── Section Header ─── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12, 0)}
          className="text-center mb-20"
        >
          <motion.div
            variants={textRevealUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/8 border border-blue-500/15 text-blue-400 text-xs font-mono uppercase tracking-[0.2em] mb-5"
          >
            <Sparkles className="w-3 h-3" />
            <span>Showcase & Recognition</span>
          </motion.div>
          <motion.h2
            variants={textRevealUp}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.08]"
          >
            Official{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Credentials
              </span>
              {/* Underline glow */}
              <motion.span 
                className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #22d3ee, #3b82f6, transparent)' }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </motion.h2>
          <motion.p
            variants={textRevealUp}
            className="text-slate-400 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            A curated selection of hackathon wins, technical certifications, and industry recognitions.
          </motion.p>
        </motion.div>

        {/* ─── 3D Card Slider ─── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={blurScaleIn}
          className="relative min-h-[450px] md:min-h-[550px] flex items-center justify-center"
        >
          {/* Navigation Controls — glass morphism buttons */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-4 md:px-8 z-40 pointer-events-none">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white 
                         hover:bg-white/[0.08] hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]
                         transition-all duration-300 pointer-events-auto backdrop-blur-xl"
              aria-label="Previous certificate"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.15, x: 4 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white 
                         hover:bg-white/[0.08] hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]
                         transition-all duration-300 pointer-events-auto backdrop-blur-xl"
              aria-label="Next certificate"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </div>

          {/* Cards Stack */}
          <div className="relative w-full max-w-4xl h-[350px] md:h-[450px] flex items-center justify-center" style={{ perspective: '1200px' }}>
            <AnimatePresence mode="popLayout">
              {mergedItems.map((item, index) => {
                const isCenter = index === currentIndex;
                const isLeft = index === (currentIndex - 1 + mergedItems.length) % mergedItems.length;
                const isRight = index === (currentIndex + 1) % mergedItems.length;

                if (!isCenter && !isLeft && !isRight) return null;

                let x = 0;
                let scale = 0.8;
                let zIndex = 10;
                let opacity = 0;
                let rotateY = 0;

                if (isCenter) {
                  x = 0; scale = 1; zIndex = 30; opacity = 1;
                } else if (isLeft) {
                  x = -260; scale = 0.82; zIndex = 20; opacity = 0.35; rotateY = 20;
                } else if (isRight) {
                  x = 260; scale = 0.82; zIndex = 20; opacity = 0.35; rotateY = -20;
                }

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, x: isRight ? 200 : -200 }}
                    animate={{ opacity, scale, x, zIndex, rotateY }}
                    exit={{ opacity: 0, scale: 0.8, x: isLeft ? 200 : -200 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="absolute w-[300px] sm:w-[500px] lg:w-[700px] h-full"
                  >
                    <TiltCertCard
                      item={item}
                      isCenter={isCenter}
                      onClick={() => {
                        if (isCenter) {
                          setExpandedItem(item);
                        } else {
                          setCurrentIndex(index);
                        }
                      }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ─── Dots Indicator — modern pill style ─── */}
        <div className="flex justify-center gap-1.5 mt-14">
          {mergedItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to certificate ${i + 1}`}
              className="p-2.5 group"
            >
              <motion.span 
                style={{ display: 'block', borderRadius: '9999px', width: 8, height: 6, backgroundColor: 'rgba(255,255,255,0.12)', boxShadow: '0 0 0px rgba(34,211,238,0)' }}
                animate={{
                  width: i === currentIndex ? 32 : 8,
                  backgroundColor: i === currentIndex ? '#22d3ee' : 'rgba(255,255,255,0.12)',
                  boxShadow: i === currentIndex ? '0 0 18px rgba(34,211,238,0.5)' : '0 0 0px rgba(34,211,238,0)',
                }}
                whileHover={{ backgroundColor: i === currentIndex ? '#22d3ee' : 'rgba(255,255,255,0.25)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-lightbox-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] flex flex-col bg-black/90 backdrop-blur-xl cursor-pointer"
            onClick={() => setExpandedItem(null)}
          >
            {/* Close Button */}
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl 
                         bg-white/5 text-white/80 border border-white/10 
                         hover:bg-white/10 hover:text-white hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]
                         transition-all duration-300 focus:outline-none sm:right-6 sm:top-6"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedItem(null);
              }}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </motion.button>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 pb-6 pt-16 sm:px-6 sm:pb-10 sm:pt-20 lg:px-10">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid w-full max-w-6xl grid-cols-1 gap-0 overflow-hidden rounded-2xl 
                           ring-1 ring-white/[0.08] lg:grid-cols-2 lg:max-h-[min(88vh,920px)]
                           shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left — certificate image */}
                <div className="relative flex min-h-[220px] items-center justify-center bg-[#050a14] p-4 sm:p-6 lg:p-8">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.4]"
                    style={{
                      backgroundImage:
                        'radial-gradient(ellipse 90% 80% at 30% 40%, rgba(59,130,246,0.12), transparent 55%)',
                    }}
                    aria-hidden
                  />
                  <figure className="relative z-[1] w-full">
                    <div className="overflow-hidden rounded-lg border border-white/[0.1] bg-slate-950 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <img
                        src={expandedItem.image}
                        alt={expandedItem.title}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        className="mx-auto block max-h-[min(52vh,560px)] w-full object-contain lg:max-h-[min(78vh,820px)]"
                      />
                    </div>
                  </figure>
                </div>

                {/* Right — description panel */}
                <aside className="relative flex flex-col border-t border-white/[0.06] bg-gradient-to-b from-slate-900/95 via-[#0c1222] to-[#060911] lg:border-l lg:border-t-0">
                  {/* Accent line */}
                  <div
                    className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan-400/50 via-blue-500/30 to-transparent hidden lg:block"
                    aria-hidden
                  />
                  <div className="relative flex flex-1 flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10 lg:pl-11">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-300/90 ring-1 ring-cyan-500/20">
                          {expandedItem.isAward ? (
                            <>
                              <Medal className="h-3.5 w-3.5" aria-hidden />
                              Award
                            </>
                          ) : (
                            <>
                              <Award className="h-3.5 w-3.5" aria-hidden />
                              Certificate
                            </>
                          )}
                        </span>
                        <span className="font-mono text-[11px] tabular-nums text-slate-600">
                          {currentIndex + 1} / {mergedItems.length}
                        </span>
                      </div>

                      <h3
                        id="certificate-lightbox-title"
                        className="font-heading mt-6 text-2xl font-bold leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-[1.85rem] xl:text-[2rem]"
                      >
                        {expandedItem.title}
                      </h3>

                      <div className="mt-6 flex items-start gap-4 border-l-2 border-cyan-500/40 pl-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">Issued by</p>
                          <p className="text-sm font-medium leading-snug text-slate-200 sm:text-base">
                            {expandedItem.issuer}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 inline-flex items-baseline gap-2 rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Date</span>
                        <span className="font-mono text-sm tabular-nums text-cyan-200/90">{expandedItem.date}</span>
                      </div>

                      {expandedItem.description ? (
                        <div className="mt-8 border-t border-white/[0.06] pt-8">
                          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500">About</p>
                          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-[15px]">
                            {expandedItem.description}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <p className="text-[11px] text-slate-600 lg:text-slate-500">
                      Tap outside or press <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">Esc</kbd> to close
                    </p>
                  </div>
                </aside>
              </motion.div>
            </div>

            <div className="shrink-0 border-t border-white/[0.06] bg-black/40 px-4 py-3 text-center lg:hidden sm:py-4">
              <p className="text-[11px] text-slate-600">Tap backdrop to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
