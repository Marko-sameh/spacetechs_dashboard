export const getOptimizedImageSrc = (src: string, format: 'webp' | 'avif' = 'webp') => {
  const extension = src.split('.').pop();
  return src.replace(`.${extension}`, `.${format}`);
};
export const createImageSrcSet = (baseSrc: string, sizes: number[] = [1, 2]) => {
  return sizes.map(size => {
    const extension = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${extension}`, '');
    return `${baseName}${size > 1 ? `@${size}x` : ''}.webp ${size}x`;
  }).join(', ');
};
export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};