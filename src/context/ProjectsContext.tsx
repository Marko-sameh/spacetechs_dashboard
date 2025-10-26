import React, { createContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { ProjectsService } from '../services/projectsService';
import { Project, QueryParams, CreateProjectData } from '../types/models';
interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalPages: number;
}
interface MediaData {
  type: 'image' | 'video';
  url: string;
}
interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  pagination?: PaginationInfo;
  addProject: (project: CreateProjectData) => Promise<void>;
  editProject: (id: string, project: Partial<CreateProjectData>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  refreshProjects: (params?: QueryParams) => Promise<void>;
  updateMedia: (id: string, files: FileList) => Promise<void>;
  deleteMedia: (id: string, mediaData: MediaData) => Promise<void>;
}
const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);
export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>();
  const fetchProjects = useCallback(async (params: QueryParams = {}) => {
    try {
      setLoading(true);
      const response = await ProjectsService.getProjects(params);
      setProjects(response.data.projects);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      console.error('Projects fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);
  const addProject = async (project: CreateProjectData) => {
    try {
      const newProject = await ProjectsService.createProject(project);
      setProjects(prev => [...prev, newProject]);
    } catch (err) {
      console.error('Failed to add project:', err);
      throw err;
    }
  };
  const editProject = async (id: string, project: Partial<CreateProjectData>) => {
    try {
      const updatedProject = await ProjectsService.updateProject(id, project);
      setProjects(prev => prev.map(p => p._id === id ? updatedProject : p));
    } catch (err) {
      console.error('Failed to update project:', err);
      throw err;
    }
  };
  const removeProject = async (id: string) => {
    await ProjectsService.deleteProject(id);
    setProjects(prev => prev.filter(p => p._id !== id));
  };
  const updateMedia = async (id: string, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        formData.append('images', file);
      } else if (file.type.startsWith('video/')) {
        formData.append('videos', file);
      }
    });
    const updatedProject = await ProjectsService.updateMedia(id, formData);
    setProjects(prev => prev.map(p => p._id === id ? updatedProject : p));
  };
  const deleteMedia = async (id: string, mediaData: MediaData) => {
    const updatedProject = await ProjectsService.deleteMedia(id, mediaData);
    setProjects(prev => prev.map(p => p._id === id ? updatedProject : p));
  };
  // Disabled automatic fetching - use hooks instead
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     fetchProjects();
  //   }
  // }, []);
  const contextValue = useMemo(() => ({
    projects,
    loading,
    error,
    pagination,
    addProject,
    editProject,
    removeProject,
    refreshProjects: fetchProjects,
    updateMedia,
    deleteMedia
  }), [projects, loading, error, pagination, fetchProjects]);
  return (
    <ProjectsContext.Provider value={contextValue}>
      {children}
    </ProjectsContext.Provider>
  );
};
export { ProjectsContext };