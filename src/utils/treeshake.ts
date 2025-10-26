// Tree-shaking optimizations
export const loadContextsLazy = () => ({
  ProjectsContext: () => import('../context/ProjectsContext'),
  CategoriesContext: () => import('../context/CategoriesContext'), 
  BlogsContext: () => import('../context/BlogsContext'),
  UserContext: () => import('../context/UserContext')
});

export const loadComponentsLazy = () => ({
  ResponsiveImage: () => import('../components/ui/ResponsiveImage'),
  ResponsiveGrid: () => import('../components/ui/ResponsiveGrid'),
  Modal: () => import('../components/ui/modal'),
  Alert: () => import('../components/ui/alert/Alert')
});