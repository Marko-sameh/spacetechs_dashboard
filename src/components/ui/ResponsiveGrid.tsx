import { memo, ReactNode } from 'react';
interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  minItemWidth?: string;
}
const ResponsiveGrid = memo(({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 4 },
  gap = 'md',
  minItemWidth
}: ResponsiveGridProps) => {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8',
    xl: 'gap-6 sm:gap-8 lg:gap-10'
  };
  const getGridCols = () => {
    if (minItemWidth) {
      return `grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`;
    }
    return `
      grid-cols-${cols.mobile || 1}
      ${cols.tablet ? `md:grid-cols-${cols.tablet}` : ''}
      ${cols.desktop ? `lg:grid-cols-${cols.desktop}` : ''}
    `.trim();
  };
  return (
    <div className={`
      grid
      ${getGridCols()}
      ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  );
});
ResponsiveGrid.displayName = 'ResponsiveGrid';
export default ResponsiveGrid;