import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal — Reusable scroll-triggered reveal wrapper.
 *
 * Props:
 *   direction  — 'up' | 'down' | 'left' | 'right' (default: 'up')
 *   blur       — add blur-to-sharp transition (default: false)
 *   scale      — add scale-in (default: false)
 *   delay      — extra delay in seconds (default: 0)
 *   duration   — animation duration (default: 0.7)
 *   distance   — translation distance in px (default: 40)
 *   className  — passes through
 *   children   — content to reveal
 *   once       — animate only once (default: true)
 *   as         — HTML element type (default: 'div')
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  blur = false,
  scale = false,
  delay = 0,
  duration = 0.7,
  distance = 40,
  className = '',
  once = true,
  as = 'div',
  style = {},
  ...rest
}) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  const initial = {
    opacity: 0,
    ...directionMap[direction],
    ...(scale ? { scale: 0.9 } : {}),
  };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(scale ? { scale: 1 } : {}),
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
