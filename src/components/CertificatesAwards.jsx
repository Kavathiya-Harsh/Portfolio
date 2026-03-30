import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Medal, ChevronLeft, ChevronRight, Maximize2, ExternalLink } from 'lucide-react';
import { certificates, awards } from '../data/certificates';
import {
  textRevealUp,
  blurScaleIn,
  staggerContainer,
  viewportOnce,
  transitionSlow,
} from '../utils/motion';

// Merge both into one professional collection
const mergedItems = [
  ...certificates.map(c => ({ ...c, isAward: false })),
  ...awards.map(a => ({ ...a, isAward: true, image: a.image || '/certificates/shaastra_ai.jpg' }))
];

export default function CertificatesAwards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
              className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all pointer-events-auto backdrop-blur-md shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all pointer-events-auto backdrop-blur-md shadow-2xl"
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

                // Mobile adjustments
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  x = isCenter ? 0 : (isLeft ? -100 : 100);
                  scale = isCenter ? 1 : 0.7;
                }

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
                          setSelectedImage(item.image);
                          setIsFullscreen(true);
                        } else {
                          setCurrentIndex(index);
                        }
                    }}
                  >
                    <div className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900 group cursor-pointer">
                      <img
                        src={item.image}
                        alt={item.title}
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
        <div className="flex justify-center gap-2.5 mt-16">
          {mergedItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-10 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, filter: 'blur(8px)' }}
              animate={{ scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ scale: 0.9, y: 20, filter: 'blur(8px)' }}
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
            >
              <img
                src={selectedImage}
                alt="Certificate Fullscreen"
                className="max-h-full object-contain rounded-lg shadow-2xl"
              />
              <button
                className="absolute top-0 right-0 p-4 text-white/50 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
              >
                Close (ESC)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
