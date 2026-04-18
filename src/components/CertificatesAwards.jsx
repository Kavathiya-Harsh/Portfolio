import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Medal, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
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
    <section id="certificates" className="py-24 px-6 relative overflow-hidden bg-[#0b1120]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with text reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12, 0)}
          className="text-center mb-16"
        >
          <motion.div
            variants={textRevealUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4"
          >
            <Award className="w-3 h-3" />
            <span>Showcase & Recognition</span>
          </motion.div>
          <motion.h2
            variants={textRevealUp}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
          >
            Official <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Credentials</span>
          </motion.h2>
          <motion.p
            variants={textRevealUp}
            className="text-slate-400 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            A curated selection of hackathon wins, technical certifications, and industry recognitions.
          </motion.p>
        </motion.div>

        {/* Slider container with blurScaleIn entrance */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={blurScaleIn}
          className="relative min-h-[450px] md:min-h-[550px] flex items-center justify-center"
        >
          {/* Navigation Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-12 z-40 pointer-events-none">
            <button
              onClick={prev}
              className="p-5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all pointer-events-auto backdrop-blur-md shadow-2xl"
              aria-label="Previous certificate"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="p-5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all pointer-events-auto backdrop-blur-md shadow-2xl"
              aria-label="Next certificate"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Cards Stack */}
          <div className="relative w-full max-w-4xl h-[350px] md:h-[450px] flex items-center justify-center">
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
                  x = 0;
                  scale = 1;
                  zIndex = 30;
                  opacity = 1;
                } else if (isLeft) {
                  x = -250;
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.4;
                  rotateY = 25;
                } else if (isRight) {
                  x = 250;
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.4;
                  rotateY = -25;
                }

                // Mobile adjustments — handled via CSS responsive classes instead of JS
                // to avoid forced reflow from window.innerWidth in render path

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, x: isRight ? 200 : -200 }}
                    animate={{ 
                      opacity, 
                      scale, 
                      x, 
                      zIndex,
                      rotateY,
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: isLeft ? 200 : -200 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute w-[300px] sm:w-[500px] lg:w-[700px] h-full perspective-1000"
                    onClick={() => {
                        if (isCenter) {
                          setExpandedItem(item);
                        } else {
                          setCurrentIndex(index);
                        }
                    }}
                  >
                    <div className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900 group cursor-pointer">
                      <img
                        src={item.image}
                        alt={item.title}
                        width="700"
                        height="450"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Subtitle Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-tighter mb-1">
                          {item.isAward ? <Medal className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                          <span>{item.issuer}</span>
                        </div>
                        <h3 className="text-white text-lg md:text-xl font-bold line-clamp-1">{item.title}</h3>
                      </div>

                      {/* Click to Expand */}
                      <div className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                         <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-1 mt-16">
          {mergedItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to certificate ${i + 1}`}
              className="p-3 group"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-10 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'w-2 bg-slate-700 group-hover:bg-slate-600'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Certificate lightbox — minimal gallery viewer (image-first, slim caption) */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-lightbox-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[120] flex flex-col bg-[#020617] cursor-pointer"
            onClick={() => setExpandedItem(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/90 ring-1 ring-white/15 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:right-6 sm:top-6 sm:h-11 sm:w-11"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedItem(null);
              }}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 pb-6 pt-16 sm:px-6 sm:pb-10 sm:pt-20 lg:px-10">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="grid w-full max-w-6xl grid-cols-1 gap-0 overflow-hidden rounded-2xl ring-1 ring-white/[0.08] lg:grid-cols-2 lg:max-h-[min(88vh,920px)]"
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
                  <div
                    className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan-400/50 via-blue-500/30 to-transparent lg:block"
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
