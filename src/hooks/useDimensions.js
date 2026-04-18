import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useDimensions - Hook to track an element's dimensions safely using ResizeObserver.
 * This avoids layout thrashing by reading dimensions only when they actually change.
 */
export function useDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const nodeRef = useRef(null);

  const measure = useCallback(() => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      });
    }
  }, []);

  const ref = useCallback((newNode) => {
    nodeRef.current = newNode;
    if (newNode) measure();
  }, [measure]);

  useEffect(() => {
    if (!nodeRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Still use rAF to batch with frame
      requestAnimationFrame(measure);
    });

    resizeObserver.observe(nodeRef.current);

    return () => resizeObserver.disconnect();
  }, [measure]);

  return [ref, dimensions, measure];
}
