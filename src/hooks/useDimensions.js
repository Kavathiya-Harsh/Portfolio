import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useDimensions - Hook to track an element's dimensions safely using ResizeObserver.
 * This avoids layout thrashing by reading dimensions only when they actually change.
 */
export function useDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const [node, setNode] = useState(null);

  const ref = useCallback((newNode) => {
    setNode(newNode);
  }, []);

  useEffect(() => {
    if (!node) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      });
    };

    // Initial measurement
    measure();

    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to batch measurements with the browser's render cycle
      requestAnimationFrame(measure);
    });

    resizeObserver.observe(node);

    // Also measure on scroll if position (left/top) is needed
    const handleScroll = () => requestAnimationFrame(measure);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [node]);

  return [ref, dimensions];
}
