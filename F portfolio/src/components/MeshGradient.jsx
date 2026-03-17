import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function getTimeTheme() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      name: 'sunrise',
      primary: 'rgba(59, 130, 246, 0.25)',
      secondary: 'rgba(14, 165, 233, 0.2)',
      accent: 'rgba(34, 211, 238, 0.15)',
      orb: 'rgba(59, 130, 246, 0.2)',
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      name: 'daylight',
      primary: 'rgba(34, 211, 238, 0.2)',
      secondary: 'rgba(59, 130, 246, 0.2)',
      accent: 'rgba(16, 185, 129, 0.15)',
      orb: 'rgba(34, 211, 238, 0.2)',
    };
  }
  if (hour >= 17 && hour < 21) {
    return {
      name: 'sunset',
      primary: 'rgba(59, 130, 246, 0.25)',
      secondary: 'rgba(14, 165, 233, 0.2)',
      accent: 'rgba(34, 211, 238, 0.15)',
      orb: 'rgba(59, 130, 246, 0.2)',
    };
  }
  return {
    name: 'midnight',
    primary: 'rgba(59, 130, 246, 0.2)',
    secondary: 'rgba(34, 211, 238, 0.15)',
    accent: 'rgba(14, 165, 233, 0.1)',
    orb: 'rgba(59, 130, 246, 0.18)',
  };
}

export default function MeshGradient() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [theme] = useState(() => getTimeTheme());

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Clean dark base */}
      <div className="absolute inset-0 bg-[#0b1120]" />

      {/* Subtle dot grid — gives depth without clutter */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(148,163,184,0.5) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient glow — top left */}
      <motion.div
        className="absolute w-[800px] h-[500px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.primary}, transparent 70%)`,
          left: '-5%',
          top: '-10%',
        }}
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Ambient glow — bottom right */}
      <motion.div
        className="absolute w-[600px] h-[400px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.accent}, transparent 70%)`,
          right: '-5%',
          bottom: '5%',
        }}
        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', delay: 5 }}
      />

      {/* Center breath */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 35% at 50% 50%, ${theme.secondary}, transparent 70%)`,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-[background] duration-200"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.06), transparent 70%)`,
        }}
      />
    </div>
  );
}
