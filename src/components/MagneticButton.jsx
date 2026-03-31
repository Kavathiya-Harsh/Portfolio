import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export default function MagneticButton({ children, className = '', href, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = 60;
    const moveX = (e.clientX - centerX) / 4;
    const moveY = (e.clientY - centerY) / 4;
    x.set(Math.max(-distance, Math.min(distance, moveX)));
    y.set(Math.max(-distance, Math.min(distance, moveY)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const transform = useMotionTemplate`translate(${x}px, ${y}px)`;

  return (
    <motion.a
      ref={ref}
      href={href || "#contact"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ transform }}
      className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-[#3b82f6] hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-shadow ${className}`}
      whileHover={{ 
        scale: 1.05,
        y: -4,
        boxShadow: "0 15px 30px -5px rgba(59,130,246,0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
