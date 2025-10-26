/**
 * Ultimate performance optimizer - eliminates all reflows and optimizes critical path
 */
// Eliminate forced reflows completely
class ReflowEliminator {
  private static instance: ReflowEliminator;
  private measurements = new Map<string, unknown>();
  private rafId: number | null = null;
  private readQueue: (() => void)[] = [];
  private writeQueue: (() => void)[] = [];
  static getInstance() {
    if (!ReflowEliminator.instance) {
      ReflowEliminator.instance = new ReflowEliminator();
    }
    return ReflowEliminator.instance;
  }
  read(key: string, fn: () => unknown) {
    if (this.measurements.has(key)) {
      return this.measurements.get(key);
    }
    this.readQueue.push(() => {
      this.measurements.set(key, fn());
    });
    this.schedule();
    return null;
  }
  write(fn: () => void) {
    this.writeQueue.push(fn);
    this.schedule();
  }
  private schedule() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      // Execute all reads first
      this.readQueue.forEach(read => read());
      this.readQueue = [];
      // Then all writes
      this.writeQueue.forEach(write => write());
      this.writeQueue = [];
      this.rafId = null;
    });
  }
}
export const reflowEliminator = ReflowEliminator.getInstance();
// Critical path optimizer
export const optimizeCriticalPath = () => {
  // Inline critical CSS immediately
  const style = document.createElement('style');
  style.textContent = `
    .sidebar{width:70px;transition:width 300ms ease;contain:layout style}
    .sidebar-expanded{width:290px}
    .menu-item{display:flex;align-items:center;padding:8px 12px;border-radius:8px;will-change:auto}
    .logo{width:60px;height:60px;contain:layout}
    body{font-display:swap}
  `;
  document.head.appendChild(style);
  // Preload only critical LCP image
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = './images/dark_logo_wbg.png';
  (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = 'high';
  document.head.appendChild(link);
};
// Remove all unnecessary preconnects
export const optimizePreconnects = () => {
  // Remove existing preconnects
  document.querySelectorAll('link[rel="preconnect"]').forEach(link => link.remove());
  // Add only essential one
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://fonts.gstatic.com';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};