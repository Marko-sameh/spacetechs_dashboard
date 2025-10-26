export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageIcon?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string | Category;
  technologies: string[];
  client?: string;
  startDate?: string;
  endDate?: string;
  status: 'Ongoing' | 'Completed' | 'Paused';
  images?: string[];
  videos?: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  author: string;
  category: string | Category;
  summary?: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  readTime: number;
  views: number;
  likes: number;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  gender: 'male' | 'female';
  photo: string;
  role: 'admin' | 'superAdmin';
  passwordChangedAt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
// Create interfaces for API requests
export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  imageIcon?: string;
  [key: string]: unknown;
}
export interface CreateProjectData {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  client?: string;
  startDate?: string;
  endDate?: string;
  status?: 'Ongoing' | 'Completed' | 'Paused';
  images?: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  [key: string]: unknown;
}
export interface CreateBlogData {
  title: string;
  category: string;
  summary?: string;
  content: string;
  tags?: string[];
  featured?: boolean;
  [key: string]: unknown;
}
export interface CreateUserData {
  name: string;
  email: string;
  gender?: 'male' | 'female';
  role?: 'admin' | 'superAdmin';
  photo?: string;
  password: string;
  passwordConfirm: string;
  [key: string]: unknown;
}
export interface UpdatePasswordData {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
  [key: string]: unknown;
}
export interface ForgotPasswordData {
  email: string;
  [key: string]: unknown;
}
export interface ResetPasswordData {
  password: string;
  passwordConfirm: string;
  [key: string]: unknown;
}
export interface ApiResponse<T> {
  status: 'success' | 'error';
  results?: number;
  data: T;
  pagination?: {
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
  [key: string]: unknown;
}
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}