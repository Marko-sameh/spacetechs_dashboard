import { 
  getUsers as apiGetUsers, 
  createUser as apiCreateUser, 
  getUser as apiGetUser, 
  updateUser as apiUpdateUser, 
  deleteUser as apiDeleteUser 
} from '../lib/apiClient';
import { buildQueryParams } from '../lib/buildQueryParams';
import { 
  ApiResponse, 
  User, 
  CreateUserData,
  QueryParams
} from '../types/models';

/**
 * User service - handles user management API operations (Admin only)
 * Authentication is handled separately in authStore
 * Matches API documentation exactly
 */
export class UserService {
  /**
   * GET /users/ - Fetches all users (Super Admin only)
   */
  static async getUsers(params: QueryParams = {}): Promise<ApiResponse<{ users: User[] }>> {
    const queryString = buildQueryParams(params);
    const response = await apiGetUsers(queryString);
    return response.data;
  }

  /**
   * POST /users/ - Creates a new user (Super Admin only)
   */
  static async createUser(data: CreateUserData): Promise<User> {
    const response = await apiCreateUser(data);
    return response.data.data.user;
  }

  /**
   * GET /users/:id - Fetches a single user by ID (Super Admin only)
   */
  static async getUser(id: string): Promise<User> {
    const response = await apiGetUser(id);
    return response.data.data.user;
  }

  /**
   * PATCH /users/:id - Updates user by ID (Super Admin only)
   */
  static async updateUser(id: string, data: Partial<CreateUserData>): Promise<User> {
    const response = await apiUpdateUser(id, data);
    return response.data.data.user;
  }

  /**
   * DELETE /users/:id - Deletes user by ID (Super Admin only)
   */
  static async deleteUser(id: string): Promise<void> {
    await apiDeleteUser(id);
  }
}