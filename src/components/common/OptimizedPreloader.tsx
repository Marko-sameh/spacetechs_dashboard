import { useEffect } from 'react';

interface OptimizedPreloaderProps {
  criticalResources?: {
    images?: string[];
    fonts?: string[];
    scripts?: string[];
  };
}

/**
 * Optimized preloader that prevents network waterfall
 */
export const OptimizedPreloader: React.FC<OptimizedPreloaderProps> = ({
  criticalResources = {}
}) => {
  useEffect(() => {
    const { images = [], fonts = [], scripts = [] } = criticalResources;
    
    // Preload critical resources with proper priorities
    const preloadResource = (href: string, as: string, type?: string, crossOrigin?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = as;
      link.href = href;
      if (type) link.type = type;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      
      // Set fetch priority for critical resources
      if (as === 'image' || as === 'font') {
        (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = 'high';
      }
      
      document.head.appendChild(link);
    };

    // Preload critical images
    images.forEach(src => preloadResource(src, 'image'));
    
    // Preload fonts with crossorigin
    fonts.forEach(src => preloadResource(src, 'font', 'font/woff2', 'anonymous'));
    
    // Preload critical scripts
    scripts.forEach(src => preloadResource(src, 'script'));

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      if (domain.includes('gstatic')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });

    // DNS prefetch for other domains
    const dnsPrefetchDomains = [
      'https://api.example.com' // Replace with your API domain
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

  }, [criticalResources]);

  return null;
};