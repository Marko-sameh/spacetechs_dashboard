import { useAuthStore } from '../store/authStore';
/**
 * Hook for accessing authentication state and actions
 */
export const useAuth = () => {
  return useAuthStore();
};