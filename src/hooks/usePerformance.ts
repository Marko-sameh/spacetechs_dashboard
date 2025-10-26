import { useCallback, useRef } from 'react';
const domBatcher = { scheduleRead: (fn: any) => fn(), scheduleWrite: (fn: any) => fn() };
/**
 * @deprecated Use useOptimizedPerformance instead for better performance
 */
export const usePerformance = () => {
  const rafRef = useRef<number>();
  const scheduleUpdate = useCallback((callback: () => void) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(callback);
  }, []);
  const batchDOMReads = useCallback((reads: (() => void)[]) => {
    reads.forEach(read => domBatcher?.scheduleRead(read));
  }, []);
  const batchDOMWrites = useCallback((writes: (() => void)[]) => {
    writes.forEach(write => domBatcher?.scheduleWrite(write));
  }, []);
  return { scheduleUpdate, batchDOMReads, batchDOMWrites };
};