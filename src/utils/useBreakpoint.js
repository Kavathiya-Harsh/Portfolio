import { useState, useEffect } from 'react';

/**
 * useBreakpoint - Simple hook to detect if we're on mobile/tablet (below 1024px).
 *
 * This value is used to disable heavy scroll animations and parallax effects
 * on smaller devices for better performance.
 */
export function useBreakpoint(width = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    const mql = window.matchMedia(`(max-width: ${width}px)`);
    setIsMobile(mql.matches);

    // Watch for changes
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, [width]);

  return isMobile;
}
