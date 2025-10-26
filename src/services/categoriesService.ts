import { 
  getCategories as apiGetCategories, 
  createCategory as apiCreateCategory, 
  getCategory as apiGetCategory, 
  updateCategory as apiUpdateCategory, 
  deleteCategory as apiDeleteCategory, 
  updateCategoryIcon, 
  deleteCategoryIcon 
} from '../lib/apiClient';
import { buildQueryParams } from '../lib/buildQueryParams';
import { Category, ApiResponse, QueryParams, CreateCategoryData } from '../types/models';

/**
 * Categories service - handles all category-related API operations
 * Matches API documentation exactly
 */
export class CategoriesService {
  /**
   * GET /categories/ - Get all categories
   */
  static async getCategories(params: QueryParams = {}): Promise<ApiResponse<{ categories: Category[] }>> {
    const queryString = buildQueryParams(params);
    const response = await apiGetCategories(queryString);
    return response.data;
  }

  /**
   * GET /categories/:id - Get single category by ID
   */
  static async getCategory(id: string): Promise<Category> {
    const response = await apiGetCategory(id);
    return response.data.data.category;
  }

  /**
   * POST /categories/ - Create a new category
   */
  static async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await apiCreateCategory(data);
    return response.data.data.category;
  }

  /**
   * PATCH /categories/:id - Update category by ID
   */
  static async updateCategory(id: string, data: Partial<CreateCategoryData>): Promise<Category> {
    const response = await apiUpdateCategory(id, data);
    return response.data.data.category;
  }

  /**
   * DELETE /categories/:id - Delete category by ID
   */
  static async deleteCategory(id: string): Promise<void> {
    await apiDeleteCategory(id);
  }

  /**
   * PATCH /categories/:id/updateIcon - Upload or update category icon
   */
  static async updateIcon(id: string, formData: FormData): Promise<Category> {
    const response = await updateCategoryIcon(id, formData);
    return response.data.data.category;
  }

  /**
   * DELETE /categories/:id/deleteIcon - Delete category icon
   */
  static async deleteIcon(id: string): Promise<Category> {
    const response = await deleteCategoryIcon(id);
    return response.data.data.category;
  }
}