import React, { memo } from 'react';
/**
 * Higher-order component for memoization
 */
export function withMemo<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return memo(Component, areEqual);
}
/**
 * Generic memoized wrapper component
 */
const MemoizedComponent = memo(<T extends Record<string, unknown>>({
  component: Component,
  ...props
}: {
  component: React.ComponentType<T>;
} & T) => {
  return <Component {...(props as unknown as T)} />;
});
export { MemoizedComponent };