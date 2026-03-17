import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function CodeScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);

  // Smooth out the percentage display
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return scrollYProgress.onChange((v) => setPercent(Math.round(v * 100)));
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 w-full z-[100] h-1.5 bg-[#0b1120]/50 backdrop-blur-sm border-b border-slate-700/30 flex items-center px-4">
      <motion.div 
        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
        style={{ scaleX: scrollYProgress, transformOrigin: 'left' }} 
      />
      
      {/* Percentage Tag */}
      <div className="absolute right-4 top-4 font-mono text-[10px] hidden md:flex items-center gap-1.5 opacity-60">
        <span className="text-slate-500">//</span>
        <span className="text-blue-400">current_progress:</span>
        <span className={`text-white transition-all duration-300 ${percent > 0 ? 'opacity-100' : 'opacity-0'}`}>
          {percent}%
        </span>
      </div>
    </div>
  );
}
