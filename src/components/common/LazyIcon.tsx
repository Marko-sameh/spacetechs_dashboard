import { Suspense, ComponentType } from 'react';

interface LazyIconProps {
  icon: ComponentType<{ className?: string }>;
  fallback?: ComponentType<{ className?: string }>;
  className?: string;
}

const DefaultFallback = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

export const LazyIcon: React.FC<LazyIconProps> = ({ 
  icon: Icon, 
  fallback: Fallback = DefaultFallback,
  className 
}) => (
  <Suspense fallback={<Fallback className={className} />}>
    <Icon className={className} />
  </Suspense>
);