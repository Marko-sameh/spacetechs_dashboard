import { create } from 'zustand';
import { forgotPassword, resetPassword, updateMyPassword, updateMe, updateMyPhoto, deleteMyPhoto } from '../lib/apiClient';
import apiClient from '../lib/apiClient';
import { User, LoginCredentials, ForgotPasswordData, ResetPasswordData, UpdatePasswordData } from '../types/models';
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}
interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (token: string, data: ResetPasswordData) => Promise<void>;
  updatePassword: (data: UpdatePasswordData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePhoto: (file: File) => Promise<void>;
  deletePhoto: () => Promise<void>;
  initialize: () => void;
}
function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string }, status?: number } }).response;
    if (response?.status === 401) {
      return 'Invalid credentials';
    }
    return response?.data?.message || 'An error occurred';
  }
  if (error && typeof error === 'object' && 'status' in error && (error as Record<string, unknown>).status === 401) {
    return 'Invalid credentials';
  }
  return error instanceof Error ? error.message : 'An error occurred';
}
/**
 * Unified authentication store - single source of truth
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  initialize: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && typeof user === 'object' && user._id) {
          set({ user, token, isAuthenticated: true });
        } else {
          localStorage.clear();
          set({ user: null, token: null, isAuthenticated: false });
        }
      } catch {
        localStorage.clear();
        set({ user: null, token: null, isAuthenticated: false });
      }
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post('/users/login', credentials);
      if (response.data.status === 'success') {
        const { user, token } = { user: response.data.data.user, token: response.data.token };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      } else {
        throw new Error('Login failed');
      }
    } catch (error: unknown) {
      throw error;
    }
  },
  logout: () => {
    localStorage.clear();
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = '/signin';
  },
  forgotPassword: async (data: ForgotPasswordData) => {
    try {
      await forgotPassword(data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  resetPassword: async (resetToken: string, data: ResetPasswordData) => {
    try {
      const response = await resetPassword(resetToken, data);
      const { user, token } = { user: response.data.data.user, token: response.data.token };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  updatePassword: async (data: UpdatePasswordData) => {
    try {
      const response = await updateMyPassword(data);
      const updatedUser = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  updateProfile: async (data: Partial<Pick<User, 'name' | 'email'>>) => {
    try {
      const response = await updateMe(data);
      const updatedUser = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  updatePhoto: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await updateMyPhoto(formData);
      const updatedUser = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  deletePhoto: async () => {
    try {
      const response = await deleteMyPhoto();
      const updatedUser = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
}));
// Initialize auth state on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}