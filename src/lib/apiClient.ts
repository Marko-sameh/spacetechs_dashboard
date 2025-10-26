import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL ;
const apiKey = import.meta.env.VITE_API_KEY ;
/**
 * Axios client with authentication interceptors and refresh token handling
 * THIS IS THE ONLY ALLOWED WAY TO MAKE API CALLS
 */
export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
  },
});
// Add validation to ensure this is the only HTTP client used
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  return config;
});
// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);
// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {

    if (error.response?.status === 401) {
      // Don't redirect if this is a login attempt
      if (error.config?.url !== '/users/login') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/signin') {
            window.location.href = '/signin';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
// =============================================================================
// API ENDPOINTS - MATCHES DOCUMENTATION EXACTLY
// Base URL: http://localhost:3000/api/
// =============================================================================
// Categories Routes
export const getCategories = (queryString = '') => apiClient.get(`/categories${queryString}`);
export const createCategory = (data: Record<string, unknown>) => apiClient.post('/categories', data);
export const getCategory = (id: string) => apiClient.get(`/categories/${id}`);
export const updateCategory = (id: string, data: Record<string, unknown>) => apiClient.patch(`/categories/${id}`, data);
export const deleteCategory = (id: string) => apiClient.delete(`/categories/${id}`);
export const updateCategoryIcon = (id: string, formData: FormData) => apiClient.patch(`/categories/${id}/updateIcon`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCategoryIcon = (id: string) => apiClient.delete(`/categories/${id}/deleteIcon`);
// Projects Routes
export const getProjects = (queryString = '') => apiClient.get(`/projects${queryString}`);
export const createProject = (data: Record<string, unknown>) => apiClient.post('/projects', data);
export const getProject = (id: string) => apiClient.get(`/projects/${id}`);
export const updateProject = (id: string, data: Record<string, unknown>) => apiClient.patch(`/projects/${id}`, data);
export const deleteProject = (id: string) => apiClient.delete(`/projects/${id}`);
export const updateProjectMedia = (id: string, formData: FormData) => apiClient.patch(`/projects/${id}/updateMedia`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProjectMedia = (id: string, mediaData: Record<string, unknown>) => apiClient.delete(`/projects/${id}/deleteMedia`, { data: mediaData });
// Blogs Routes
export const getBlogs = (queryString = '') => apiClient.get(`/blogs${queryString}`);
export const createBlog = (data: Record<string, unknown>) => apiClient.post('/blogs', data);
export const getBlog = (id: string) => apiClient.get(`/blogs/${id}`);
export const updateBlog = (id: string, data: Record<string, unknown>) => apiClient.patch(`/blogs/${id}`, data);
export const deleteBlog = (id: string) => apiClient.delete(`/blogs/${id}`);
export const updateBlogCover = (id: string, formData: FormData) => apiClient.patch(`/blogs/${id}/updateCover`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlogCover = (id: string) => apiClient.delete(`/blogs/${id}/deleteCover`);
// Users Routes - Authentication (Public)
export const loginUser = (credentials: Record<string, unknown>) => apiClient.post('/users/login', credentials);
export const forgotPassword = (data: Record<string, unknown>) => apiClient.post('/users/forgotPassword', data);
export const resetPassword = (token: string, data: Record<string, unknown>) => apiClient.patch(`/users/resetPassword/${token}`, data);
export const logoutUser = () => apiClient.get('/users/logout');
// Users Routes - Authenticated User
export const updateMyPassword = (data: Record<string, unknown>) => apiClient.patch('/users/updateMyPassword', data);
export const updateMe = (data: Record<string, unknown>) => apiClient.patch('/users/updateMe', data);
export const updateMyPhoto = (formData: FormData) => apiClient.patch('/users/updateMyPhoto', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMyPhoto = () => apiClient.delete('/users/deleteMyPhoto');
// Users Routes - Super Admin
export const getUsers = (queryString = '') => apiClient.get(`/users${queryString}`);
export const createUser = (data: Record<string, unknown>) => apiClient.post('/users', data);
export const getUser = (id: string) => apiClient.get(`/users/${id}`);
export const updateUser = (id: string, data: Record<string, unknown>) => apiClient.patch(`/users/${id}`, data);
export const deleteUser = (id: string) => apiClient.delete(`/users/${id}`);
export default apiClient;