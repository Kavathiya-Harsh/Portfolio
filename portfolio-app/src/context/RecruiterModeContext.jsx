import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

const RecruiterModeContext = createContext(null);

export function RecruiterModeProvider({ children }) {
  const [recruiterMode, setRecruiterMode] = useState(false);

  const enterRecruiterMode = useCallback(() => {
    setRecruiterMode(true);

    // Confetti burst
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#3b82f6', '#06b6d4', '#fff', '#bfdbfe'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // Scroll to projects section smoothly
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }, []);

  const exitRecruiterMode = useCallback(() => {
    setRecruiterMode(false);
  }, []);

  return (
    <RecruiterModeContext.Provider value={{ recruiterMode, enterRecruiterMode, exitRecruiterMode }}>
      {children}
    </RecruiterModeContext.Provider>
  );
}

export function useRecruiterMode() {
  const ctx = useContext(RecruiterModeContext);
  if (!ctx) throw new Error('useRecruiterMode must be used within RecruiterModeProvider');
  return ctx;
}
