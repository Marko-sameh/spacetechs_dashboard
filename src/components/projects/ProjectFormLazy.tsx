import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const ProjectForm = lazy(() => import('../../pages/Dashboard/Projects/ProjectForm'));

export const ProjectFormLazy = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <ProjectForm {...props} />
  </Suspense>
);