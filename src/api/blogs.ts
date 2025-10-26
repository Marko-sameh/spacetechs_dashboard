import { BaseApiService } from './base';
import { apiClient } from './client';
import { getErrorMessage } from './base';
import { Blog, ApiResponse } from '../types/models';

/**
 * Blogs API service
 */
export class BlogsApi extends BaseApiService<Blog> {
  protected endpoint = '/blogs';

  /**
   * Update blog cover image
   */
  async updateCover(id: string, formData: FormData): Promise<Blog> {
    try {
      const response = await apiClient.patch<ApiResponse<{ blog: Blog }>>(
        `${this.endpoint}/${id}/updateCover`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data.blog;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update blog cover'));
    }
  }

  /**
   * Delete blog cover image
   */
  async deleteCover(id: string): Promise<Blog> {
    try {
      const response = await apiClient.delete<ApiResponse<{ blog: Blog }>>(
        `${this.endpoint}/${id}/deleteCover`
      );
      return response.data.data.blog;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete blog cover'));
    }
  }
}

export const blogsApi = new BlogsApi();