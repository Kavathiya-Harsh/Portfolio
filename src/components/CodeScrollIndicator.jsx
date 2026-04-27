import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function CodeScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const percentRef = useRef(null);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      if (percentRef.current) {
        percentRef.current.textContent = Math.round(v * 100);
      }
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 w-full z-[100] h-1.5 bg-[#0b1120]/50 backdrop-blur-sm border-b border-slate-700/30 flex items-center px-4">
      <motion.div 
        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
        style={{ scaleX: scrollYProgress, transformOrigin: 'left' }} 
      />
      
      {/* Percentage Tag */}
      <div className="absolute right-4 top-4 font-mono text-[10px] hidden md:flex items-center gap-1.5 opacity-60">
        <span className="text-slate-400">//</span>
        <span className="text-blue-400">current_progress:</span>
        <span className="text-white opacity-100">
          <span ref={percentRef}>0</span>%
        </span>
      </div>
    </div>
  );
}
