import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PerformanceContext = createContext();

/**
 * Detects if the current device is likely low-end using multiple signals:
 * - navigator.hardwareConcurrency (CPU cores)
 * - navigator.deviceMemory (RAM, Chrome only)
 * - navigator.connection (network speed)
 * - prefers-reduced-motion OS setting
 */
function detectLowEndDevice() {
  try {
    // Honour OS reduced-motion preference first
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

    // Low CPU core count
    const cores = navigator.hardwareConcurrency;
    if (cores && cores <= 2) return true;

    // Low RAM (Chrome / Android)
    const memory = navigator.deviceMemory;
    if (memory && memory <= 2) return true;

    // Slow or save-data connection
    const conn = navigator.connection;
    if (conn) {
      if (conn.saveData) return true;
      if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function PerformanceProvider({ children }) {
  const [isLowPower, setIsLowPower] = useState(() => {
    // 1. Check manual override saved in localStorage
    const saved = localStorage.getItem('portfolio-low-power');
    if (saved !== null) return JSON.parse(saved);
    // 2. Otherwise auto-detect
    return detectLowEndDevice();
  });

  // Track whether user has manually overridden the auto setting
  const manualOverride = useRef(localStorage.getItem('portfolio-low-power') !== null);

  useEffect(() => {
    // Apply body class for CSS-level optimisations
    if (isLowPower) {
      document.documentElement.classList.add('low-power');
    } else {
      document.documentElement.classList.remove('low-power');
    }
  }, [isLowPower]);

  useEffect(() => {
    // Only update on OS change if no manual override
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => {
      if (!manualOverride.current) setIsLowPower(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleLowPower = () => {
    manualOverride.current = true;
    setIsLowPower(prev => {
      const next = !prev;
      localStorage.setItem('portfolio-low-power', JSON.stringify(next));
      return next;
    });
  };

  const resetToAuto = () => {
    manualOverride.current = false;
    localStorage.removeItem('portfolio-low-power');
    setIsLowPower(detectLowEndDevice());
  };

  return (
    <PerformanceContext.Provider value={{ isLowPower, toggleLowPower, resetToAuto }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) throw new Error('usePerformance must be used within a PerformanceProvider');
  return context;
};
