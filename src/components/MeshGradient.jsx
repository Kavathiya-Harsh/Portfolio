import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function MeshGradient() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the cursor spotlight to prevent jitter
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden select-none pointer-events-none">
      {/* Deep Midnight Base */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Subtle Fractal Noise Overlay (Premium Grain) */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Primary Aurora — Deep Blue */}
      <motion.div
        className="absolute w-[120vw] h-[120vh] -left-[10vw] -top-[10vh]"
        style={{
          background: `radial-gradient(circle at 20% 30%, rgba(30, 58, 138, 0.25) 0%, transparent 60%)`,
        }}
        animate={{
          rotate: [0, 5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary Aurora — Soft Cyan */}
      <motion.div
        className="absolute w-[100vw] h-[100vh] -right-[10vw] -bottom-[10vh]"
        style={{
          background: `radial-gradient(circle at 80% 80%, rgba(8, 145, 178, 0.15) 0%, transparent 60%)`,
        }}
        animate={{
          rotate: [0, -8, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Accent Orb — Muted Violet */}
      <motion.div
        className="absolute w-[80vw] h-[80vh] left-[10vw] top-[20vh]"
        style={{
          background: `radial-gradient(circle at center, rgba(109, 40, 217, 0.08) 0%, transparent 50%)`,
        }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Animated Scanline/Grid Hybrid */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 100% 4px',
        }}
      />

      {/* High-Performance Cursor Spotlight */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: `radial-gradient(600px circle at var(--x) var(--y), rgba(59, 130, 246, 0.07), transparent 80%)`,
          '--x': smoothX,
          '--y': smoothY,
        }}
      />

      {/* Vignette for cinematic focus */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />
    </div>
  );
}
