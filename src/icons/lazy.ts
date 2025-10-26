import React, { lazy } from 'react';
// Critical icons only - inline SVGs to avoid network requests
export const GridIcon = ({ className }: { className?: string }) => React.createElement('svg', {
  className,
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, React.createElement('path', {
  d: 'M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z'
}));
export const BoxCubeIcon = ({ className }: { className?: string }) => React.createElement('svg', {
  className,
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, React.createElement('path', {
  d: 'M10 2L3 6v8l7 4 7-4V6l-7-4zM5 7.5L10 5l5 2.5v5L10 15l-5-2.5v-5z'
}));
export const UserCircleIcon = ({ className }: { className?: string }) => React.createElement('svg', {
  className,
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  React.createElement('circle', { key: '1', cx: 10, cy: 10, r: 8 }),
  React.createElement('circle', { key: '2', cx: 10, cy: 7, r: 2, fill: 'white' }),
  React.createElement('path', { key: '3', d: 'M6 15c0-2 2-3 4-3s4 1 4 3', fill: 'white' })
]);
export const ChevronDownIcon = ({ className }: { className?: string }) => React.createElement('svg', {
  className,
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, React.createElement('path', {
  d: 'M6 8l4 4 4-4'
}));
export const HorizontaLDots = ({ className }: { className?: string }) => React.createElement('svg', {
  className,
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  React.createElement('circle', { key: '1', cx: 4, cy: 10, r: 1.5 }),
  React.createElement('circle', { key: '2', cx: 10, cy: 10, r: 1.5 }),
  React.createElement('circle', { key: '3', cx: 16, cy: 10, r: 1.5 })
]);
// Lazy-loaded icons for non-critical use
export const PlusIcon = lazy(() => import('./plus.svg?react').then(m => ({ default: m.ReactComponent })));
export const TrashBinIcon = lazy(() => import('./trash.svg?react').then(m => ({ default: m.ReactComponent })));
export const PencilIcon = lazy(() => import('./pencil.svg?react').then(m => ({ default: m.ReactComponent })));