import { apiClient } from './client';
import { ApiResponse, QueryParams } from '../types/models';
/**
 * Generic error handler for API responses
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  return fallback;
}
/**
 * Build query string from parameters
 */
export function buildQueryParams(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
/**
 * Base API service class with common CRUD operations
 */
export abstract class BaseApiService<T> {
  protected abstract endpoint: string;
  async getAll(params: QueryParams = {}): Promise<ApiResponse<{ [key: string]: T[] }>> {
    try {
      const queryString = buildQueryParams(params);
      const response = await apiClient.get(`${this.endpoint}${queryString}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, `Failed to fetch ${this.endpoint}`));
    }
  }
  async getById(id: string): Promise<T> {
    try {
      const response = await apiClient.get(`${this.endpoint}/${id}`);
      return response.data.data[Object.keys(response.data.data)[0]];
    } catch (error) {
      throw new Error(getErrorMessage(error, `Failed to fetch ${this.endpoint} item`));
    }
  }
  async create(data: Partial<T>): Promise<T> {
    try {
      const response = await apiClient.post(this.endpoint, data);
      return response.data.data[Object.keys(response.data.data)[0]];
    } catch (error) {
      throw new Error(getErrorMessage(error, `Failed to create ${this.endpoint} item`));
    }
  }
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const response = await apiClient.patch(`${this.endpoint}/${id}`, data);
      return response.data.data[Object.keys(response.data.data)[0]];
    } catch (error) {
      throw new Error(getErrorMessage(error, `Failed to update ${this.endpoint} item`));
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, `Failed to delete ${this.endpoint} item`));
    }
  }
}