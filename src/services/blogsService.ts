import { 
  getBlogs as apiGetBlogs, 
  createBlog as apiCreateBlog, 
  getBlog as apiGetBlog, 
  updateBlog as apiUpdateBlog, 
  deleteBlog as apiDeleteBlog, 
  updateBlogCover, 
  deleteBlogCover 
} from '../lib/apiClient';
import { buildQueryParams } from '../lib/buildQueryParams';
import { Blog, ApiResponse, QueryParams, CreateBlogData } from '../types/models';
/**
 * Blogs service - handles all blog-related API operations
 * Matches API documentation exactly
 */
export class BlogsService {
  /**
   * GET /blogs/ - Get all blog posts
   */
  static async getBlogs(params: QueryParams = {}): Promise<ApiResponse<{ blogs: Blog[] }>> {
    const queryString = buildQueryParams(params);
    const response = await apiGetBlogs(queryString);
    return response.data;
  }
  /**
   * GET /blogs/:id - Get a single blog post by ID
   */
  static async getBlog(id: string): Promise<Blog> {
    const response = await apiGetBlog(id);
    return response.data.data.blog;
  }
  /**
   * POST /blogs/ - Create a new blog post
   */
  static async createBlog(data: CreateBlogData): Promise<Blog> {
    const response = await apiCreateBlog(data);
    return response.data.data.blog;
  }
  /**
   * PATCH /blogs/:id - Update a blog post
   */
  static async updateBlog(id: string, data: Partial<CreateBlogData>): Promise<Blog> {
    const response = await apiUpdateBlog(id, data);
    return response.data.data.blog;
  }
  /**
   * DELETE /blogs/:id - Delete a blog post
   */
  static async deleteBlog(id: string): Promise<void> {
    await apiDeleteBlog(id);
  }
  /**
   * PATCH /blogs/:id/updateCover - Upload or update blog cover image
   */
  static async updateCover(id: string, formData: FormData): Promise<Blog> {
    const response = await updateBlogCover(id, formData);
    return response.data.data.blog;
  }
  /**
   * DELETE /blogs/:id/deleteCover - Delete blog cover image
   */
  static async deleteCover(id: string): Promise<Blog> {
    const response = await deleteBlogCover(id);
    return response.data.data.blog;
  }
}