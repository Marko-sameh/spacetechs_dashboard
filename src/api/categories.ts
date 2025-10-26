import { BaseApiService } from './base';
import { apiClient } from './client';
import { getErrorMessage } from './base';
import { Category, ApiResponse } from '../types/models';

/**
 * Categories API service
 */
export class CategoriesApi extends BaseApiService<Category> {
  protected endpoint = '/categories';

  /**
   * Update category icon
   */
  async updateIcon(id: string, formData: FormData): Promise<Category> {
    try {
      const response = await apiClient.patch<ApiResponse<{ category: Category }>>(
        `${this.endpoint}/${id}/updateIcon`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data.category;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update category icon'));
    }
  }

  /**
   * Delete category icon
   */
  async deleteIcon(id: string): Promise<Category> {
    try {
      const response = await apiClient.delete<ApiResponse<{ category: Category }>>(
        `${this.endpoint}/${id}/deleteIcon`
      );
      return response.data.data.category;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete category icon'));
    }
  }
}

export const categoriesApi = new CategoriesApi();