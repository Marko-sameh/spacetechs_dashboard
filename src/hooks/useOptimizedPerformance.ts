import { useCallback, useRef, useEffect } from 'react';
const domBatcher = { scheduleRead: (fn: any) => fn(), scheduleWrite: (fn: any) => fn() };
/**
 * Optimized performance hook to prevent forced reflows
 */
export const useOptimizedPerformance = () => {
  const rafRef = useRef<number>();
  const measurementsCache = useRef<Map<string, unknown>>(new Map());
  // Batch DOM reads to prevent forced reflows
  const batchDOMReads = useCallback((reads: Array<{ key: string; fn: () => unknown }>) => {
    reads.forEach(({ key, fn }) => {
      if (!measurementsCache.current.has(key)) {
        domBatcher?.scheduleRead(() => {
          measurementsCache.current.set(key, fn());
        });
      }
    });
  }, []);
  // Batch DOM writes to prevent layout thrashing
  const batchDOMWrites = useCallback((writes: (() => void)[]) => {
    writes.forEach(write => {
      domBatcher.scheduleWrite(write);
    });
  }, []);
  // Optimized animation frame scheduling
  const scheduleUpdate = useCallback((callback: () => void) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(callback);
  }, []);
  // Get cached measurement or schedule new one
  const getCachedMeasurement = useCallback((key: string, measureFn: () => unknown) => {
    if (measurementsCache.current.has(key)) {
      return measurementsCache.current.get(key);
    }
    domBatcher?.scheduleRead(() => {
      measurementsCache.current.set(key, measureFn());
    });
    return null;
  }, []);
  // Clear cache on unmount
  useEffect(() => {
    const cache = measurementsCache.current;
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      cache.clear();
    };
  }, []);
  return {
    batchDOMReads,
    batchDOMWrites,
    scheduleUpdate,
    getCachedMeasurement
  };
};