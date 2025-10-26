import { useContext } from 'react';
import { ProjectsContext } from '../context/ProjectsContext';
/**
 * Hook for accessing projects context
 */
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};