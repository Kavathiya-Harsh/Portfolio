import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MouseGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const setPos = (e) => {
      gsap.to(glow, {
        x: e.clientX - 150,
        y: e.clientY - 150,
        duration: 0.4,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', setPos);
    return () => window.removeEventListener('mousemove', setPos);
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)',
        mixBlendMode: 'screen',
        opacity: 0.6,
        willChange: 'transform',
        zIndex: 0,
      }}
    />
  );
}
