import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useDimensions } from '../hooks/useDimensions';

const MAX_TILT = 8;

export default function TiltCard({ children, className = '', ...props }) {
  const [measureRef, dimensions] = useDimensions();
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    if (dimensions.width === 0) return;
    
    const centerX = dimensions.left + dimensions.width / 2;
    const centerY = dimensions.top + dimensions.height / 2;
    const moveX = (e.clientX - centerX) / (dimensions.width / 2);
    const moveY = (e.clientY - centerY) / (dimensions.height / 2);
    x.set(Math.max(-1, Math.min(1, moveX)) * MAX_TILT);
    y.set(Math.max(-1, Math.min(1, moveY)) * -MAX_TILT);
    const px = ((e.clientX - dimensions.left) / dimensions.width) * 100;
    const py = ((e.clientY - dimensions.top) / dimensions.height) * 100;
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mx', `${px}%`);
      cardRef.current.style.setProperty('--my', `${py}%`);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mx', `50%`);
      cardRef.current.style.setProperty('--my', `50%`);
    }
  };

  const rotateX = useMotionTemplate`perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;

  return (
    <motion.div
      ref={(node) => {
        cardRef.current = node;
        measureRef(node);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: rotateX }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative group overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.08), transparent 60%), radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(59, 130, 246,0.14), transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(59, 130, 246,0.15), 0 20px 40px -20px rgba(59, 130, 246,0.25)',
        }}
      />
      {children}
    </motion.div>
  );
}
