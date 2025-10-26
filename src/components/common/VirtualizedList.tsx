import { memo, useMemo } from 'react';
interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
}
export const VirtualizedList = memo(<T,>({ 
  items, 
  renderItem, 
  itemHeight = 50,
  containerHeight = 300 
}: VirtualizedListProps<T>) => {
  const visibleItems = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
    return items.slice(0, Math.min(visibleCount, items.length));
  }, [items, itemHeight, containerHeight]);
  return (
    <div style={{ height: containerHeight, overflow: 'auto' }}>
      {visibleItems.map((item, index) => (
        <div key={index} style={{ height: itemHeight }}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
});