import { BaseApiService } from './base';
import { apiClient } from './client';
import { getErrorMessage } from './base';
import { Project, ApiResponse } from '../types/models';
/**
 * Projects API service
 */
export class ProjectsApi extends BaseApiService<Project> {
  protected endpoint = '/projects';
  /**
   * Update project media (images/videos)
   */
  async updateMedia(id: string, formData: FormData): Promise<Project> {
    try {
      const response = await apiClient.patch<ApiResponse<{ project: Project }>>(
        `${this.endpoint}/${id}/updateMedia`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data.project;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update project media'));
    }
  }
  /**
   * Delete project media
   */
  async deleteMedia(id: string, mediaData: { type: 'image' | 'video'; url: string }): Promise<Project> {
    try {
      const response = await apiClient.delete<ApiResponse<{ project: Project }>>(
        `${this.endpoint}/${id}/deleteMedia`, 
        { data: mediaData }
      );
      return response.data.data.project;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete project media'));
    }
  }
}
export const projectsApi = new ProjectsApi();