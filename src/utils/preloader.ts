// Preload critical resources only when they exist
export const preloadCriticalResources = () => {
  // Only preload if images exist
  const img = new Image();
  img.onload = () => {
    const logoLink = document.createElement('link');
    logoLink.rel = 'preload';
    logoLink.as = 'image';
    logoLink.href = '/images/dark_logo_wbg.png';
    document.head.appendChild(logoLink);
  };
  img.src = '/images/dark_logo_wbg.png';
};
// Initialize preloader only in production
if (import.meta.env.PROD) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
  } else {
    preloadCriticalResources();
  }
}