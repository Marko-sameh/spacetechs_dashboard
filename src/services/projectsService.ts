import { 
  getProjects as apiGetProjects, 
  createProject as apiCreateProject, 
  getProject as apiGetProject, 
  updateProject as apiUpdateProject, 
  deleteProject as apiDeleteProject, 
  updateProjectMedia, 
  deleteProjectMedia 
} from '../lib/apiClient';
import { buildQueryParams } from '../lib/buildQueryParams';
import { Project, ApiResponse, QueryParams, CreateProjectData } from '../types/models';

/**
 * Projects service - handles all project-related API operations
 * Matches API documentation exactly
 */
export class ProjectsService {
  /**
   * GET /projects/ - Get all projects
   */
  static async getProjects(params: QueryParams = {}): Promise<ApiResponse<{ projects: Project[] }>> {
    const queryString = buildQueryParams(params);
    const response = await apiGetProjects(queryString);
    return response.data;
  }

  /**
   * GET /projects/:id - Get single project by ID
   */
  static async getProject(id: string): Promise<Project> {
    const response = await apiGetProject(id);
    return response.data.data.project;
  }

  /**
   * POST /projects/ - Create a new project
   */
  static async createProject(data: CreateProjectData): Promise<Project> {
    const response = await apiCreateProject(data);
    return response.data.data.project;
  }

  /**
   * PATCH /projects/:id - Update project by ID
   */
  static async updateProject(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    const response = await apiUpdateProject(id, data);
    return response.data.data.project;
  }

  /**
   * DELETE /projects/:id - Delete project by ID
   */
  static async deleteProject(id: string): Promise<void> {
    await apiDeleteProject(id);
  }

  /**
   * PATCH /projects/:id/updateMedia - Upload or update project images/videos
   */
  static async updateMedia(id: string, formData: FormData): Promise<Project> {
    const response = await updateProjectMedia(id, formData);
    return response.data.data.project;
  }

  /**
   * DELETE /projects/:id/deleteMedia - Delete project media (images/videos)
   */
  static async deleteMedia(id: string, mediaData: { type: 'image' | 'video'; url: string }): Promise<Project> {
    const response = await deleteProjectMedia(id, mediaData);
    return response.data.data.project;
  }
}