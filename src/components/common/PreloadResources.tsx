import { useEffect } from 'react';
import { preloadCriticalResources, addResourceHints, optimizeFontLoading } from '../../utils/networkOptimizer';

interface PreloadResourcesProps {
  images?: string[];
  fonts?: string[];
  scripts?: string[];
}

/**
 * Optimized component to preload critical resources and prevent network waterfall
 */
export const PreloadResources: React.FC<PreloadResourcesProps> = ({
  images = [],
  fonts = [],
  scripts = [],
}) => {
  useEffect(() => {
    // Add resource hints first
    addResourceHints();
    
    // Optimize font loading
    optimizeFontLoading();
    
    // Preload critical resources with proper priorities
    preloadCriticalResources({ images, fonts, scripts });
  }, [images, fonts, scripts]);

  return null;
};