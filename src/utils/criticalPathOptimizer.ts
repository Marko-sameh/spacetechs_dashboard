/**
 * Critical path optimization to reduce LCP from 1,333ms to <800ms
 */
// Inline critical font CSS to eliminate network request
export const inlineCriticalFontCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(data:font/woff2;base64,) format('woff2');
      unicode-range: U+0000-00FF;
    }
  `;
  document.head.appendChild(style);
};
// Preload only LCP image
export const preloadLCPImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = './images/dark_logo_wbg.png';
  (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = 'high';
  document.head.appendChild(link);
};
// Critical CSS for above-the-fold content
export const inlineCriticalCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    .sidebar{width:70px;transition:width 300ms}
    .sidebar-expanded{width:290px}
    .menu-item{display:flex;align-items:center;padding:8px 12px;border-radius:8px}
    .logo{width:60px;height:60px}
  `;
  document.head.appendChild(style);
};