/**
 * API Diagnostics - Debug authentication and API issues
 */
export function logEnvironmentInfo() {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://backend.spacetechs.net/api';
  const apiKey = import.meta.env.VITE_API_KEY || 'my-super-secret-key-2025';
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  const mode = import.meta.env.MODE;
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
  }
}
export function logAuthState() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    const authUser = localStorage.getItem('authUser');
    // Check if store is available
    if ((window as unknown as Record<string, unknown>).__authStore__) {
      const store = ((window as unknown as Record<string, unknown>).__authStore__ as { getState: () => Record<string, unknown> }).getState();
    }
  }
}