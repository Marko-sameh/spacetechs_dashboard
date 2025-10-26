/**
 * Performance optimization utilities to prevent forced reflows
 */
// Batch DOM operations to prevent forced reflows
export class DOMBatcher {
  private readQueue: (() => void)[] = [];
  private writeQueue: (() => void)[] = [];
  private scheduled = false;
  scheduleRead(fn: () => void) {
    this.readQueue.push(fn);
    this.schedule();
  }
  scheduleWrite(fn: () => void) {
    this.writeQueue.push(fn);
    this.schedule();
  }
  private schedule() {
    if (this.scheduled) return;
    this.scheduled = true;
    requestAnimationFrame(() => {
      // Execute all reads first
      while (this.readQueue.length) {
        const read = this.readQueue.shift();
        read?.();
      }
      // Then execute all writes
      while (this.writeQueue.length) {
        const write = this.writeQueue.shift();
        write?.();
      }
      this.scheduled = false;
    });
  }
}
// Singleton instance
export const domBatcher = new DOMBatcher();
// Optimize geometric property access
export const getElementDimensions = (element: HTMLElement) => {
  return domBatcher.scheduleRead(() => ({
    width: element.offsetWidth,
    height: element.offsetHeight,
    top: element.offsetTop,
    left: element.offsetLeft
  }));
};
// Debounced resize observer
export const createOptimizedResizeObserver = (
  callback: (entries: ResizeObserverEntry[]) => void,
  debounceMs = 16
) => {
  let timeoutId: number;
  return new ResizeObserver((entries) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(entries), debounceMs);
  });
};
// Intersection observer with performance optimizations
export const createOptimizedIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: [0, 0.1, 0.5, 1],
    ...options
  });
};