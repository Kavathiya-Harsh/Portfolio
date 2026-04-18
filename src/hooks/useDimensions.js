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
  }, []);

  useEffect(() => {
    if (!nodeRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height, left, top } = entry.contentRect;
        setDimensions({ width, height, left, top });
      }
    });

    resizeObserver.observe(nodeRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return [ref, dimensions, measure];
}
