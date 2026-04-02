import React, { createContext, useContext, useState, useEffect } from 'react';

const PerformanceContext = createContext();

export function PerformanceProvider({ children }) {
  // Initialize from localStorage or default to system preference
  const [isLowPower, setIsLowPower] = useState(() => {
    const saved = localStorage.getItem('portfolio-low-power');
    if (saved !== null) return JSON.parse(saved);
    
    // Default to system preference if no saved setting
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    // Sync with localStorage
    localStorage.setItem('portfolio-low-power', JSON.stringify(isLowPower));
    
    // Update body class for CSS-level optimizations
    if (isLowPower) {
      document.documentElement.classList.add('low-power');
    } else {
      document.documentElement.classList.remove('low-power');
    }
  }, [isLowPower]);

  // Listen for system changes ONLY if user hasn't manually set a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (e) => {
      // Only auto-switch if no manual override exists in storage
      if (localStorage.getItem('portfolio-low-power') === null) {
        setIsLowPower(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    return () => mediaQuery.removeEventListener('change', handleReducedMotionChange);
  }, []);

  const toggleLowPower = () => setIsLowPower(prev => !prev);

  return (
    <PerformanceContext.Provider value={{ isLowPower, toggleLowPower }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
