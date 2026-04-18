import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

/**
 * MagneticButton — zero-reflow version.
 * Uses pointer offset math relative to the element's own bounding box
 * ONLY on mousemove (deferred), never on render or enter.
 * On mobile (hover:none), the magnetic effect is completely disabled.
 */
export default function MagneticButton({ children, className = '', href, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const transform = useMotionTemplate`translate(${x}px, ${y}px)`;

  // Read dimensions lazily from the cached rect — only when DOM is settled
  const rectRef = useRef(null);

  const handleMouseMove = (e) => {
    // On touch/mobile devices, skip entirely
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;

    // Read rect only once per gesture (cache until mouseleave)
    if (!rectRef.current && ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const moveX = (e.clientX - centerX) / 4;
    const moveY = (e.clientY - centerY) / 4;
    x.set(Math.max(-60, Math.min(60, moveX)));
    y.set(Math.max(-60, Math.min(60, moveY)));
  };

  const handleMouseLeave = () => {
    rectRef.current = null; // clear cache
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href || '#contact'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-[#3b82f6] hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-shadow ${className}`}
      whileHover={{
        scale: 1.05,
        y: -4,
        boxShadow: '0 15px 30px -5px rgba(59,130,246,0.5)',
      }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
