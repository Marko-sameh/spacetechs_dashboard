/**
 * Network optimization utilities to reduce critical path latency
 */

// Minimal resource hints - only critical origins
export const addResourceHints = () => {
  // Only preconnect to fonts.gstatic.com (actual font files)
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://fonts.gstatic.com';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

// Preload critical resources with proper priorities
export const preloadCriticalResources = (resources: {
  fonts?: string[];
  images?: string[];
  scripts?: string[];
}) => {
  const { fonts = [], images = [], scripts = [] } = resources;

  // Preload fonts with high priority
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = font;
    link.crossOrigin = 'anonymous';
    (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // Preload critical images
  images.forEach(image => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = image;
    (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // Preload critical scripts
  scripts.forEach(script => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = script;
    document.head.appendChild(link);
  });
};

// Optimize font loading
export const optimizeFontLoading = () => {
  // Add font-display: swap to existing font faces
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Outfit';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Service Worker for caching critical resources
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
    } catch (error) {
      console.log('SW registration failed:', error);
    }
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// Lazy load non-critical CSS
export const loadNonCriticalCSS = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  document.head.appendChild(link);
};