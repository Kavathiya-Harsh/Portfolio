import React, { useEffect, useState, useMemo } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useBreakpoint } from '../utils/useBreakpoint';

export default React.memo(function MeshGradient() {
  const isMobile = useBreakpoint(1024);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the cursor spotlight to prevent jitter
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isMobile) return;

    let rafId;
    const handleMouseMove = (e) => {
      // Throttle mouse movement to animation frames
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY, isMobile]);

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

      {/* Primary Aurora — Deep Blue (static gradient, composited animation only) */}
      <motion.div
        className="absolute w-[120vw] h-[120vh] -left-[10vw] -top-[10vh]"
        style={{
          background: `radial-gradient(circle at 20% 30%, rgba(30, 58, 138, 0.25) 0%, transparent 60%)`,
        }}
        animate={isMobile ? false : {
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary Aurora — Soft Cyan (static gradient, composited animation only) */}
      <motion.div
        className="absolute w-[100vw] h-[100vh] -right-[10vw] -bottom-[10vh]"
        style={{
          background: `radial-gradient(circle at 80% 80%, rgba(8, 145, 178, 0.15) 0%, transparent 60%)`,
        }}
        animate={isMobile ? false : {
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Accent Orb — Muted Violet (composited transform only) */}
      <motion.div
        className="absolute w-[80vw] h-[80vh] left-[10vw] top-[20vh]"
        style={{
          background: `radial-gradient(circle at center, rgba(109, 40, 217, 0.08) 0%, transparent 50%)`,
        }}
        animate={isMobile ? false : {
          opacity: [0.5, 1, 0.5],
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

      {/* High-Performance Cursor Spotlight - Only for desktop */}
      {/* High-Performance GPU-Accelerated Cursor Spotlight - Only for desktop */}
      {!isMobile && (
        <motion.div
          className="absolute pointer-events-none -z-10"
          style={{
            width: '1200px',
            height: '1200px',
            left: '-600px',
            top: '-600px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%)',
            x: smoothX,
            y: smoothY,
            willChange: 'transform',
          }}
        />
      )}

      {/* Vignette for cinematic focus */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />
    </div>
  );
});
