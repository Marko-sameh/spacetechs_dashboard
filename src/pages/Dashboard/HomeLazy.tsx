import { lazy, Suspense } from 'react';
const Home = lazy(() => import('./Home'));
export const HomeLazy = () => (
  <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded" />}>
    <Home />
  </Suspense>
);
export default HomeLazy;