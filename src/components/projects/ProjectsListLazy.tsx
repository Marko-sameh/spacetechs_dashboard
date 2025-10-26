import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
const ProjectsList = lazy(() => import('../../pages/Dashboard/Projects/ProjectsList'));
export const ProjectsListLazy = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <ProjectsList />
  </Suspense>
);