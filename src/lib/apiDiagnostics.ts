/**
 * API Diagnostics - Debug authentication and API issues
 */

export function logEnvironmentInfo() {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://backend.spacetechs.net/api';
  const apiKey = import.meta.env.VITE_API_KEY || 'my-super-secret-key-2025';
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  const mode = import.meta.env.MODE;

  console.log('🌍 Environment Information:');
  console.log(`apiDiagnostics.ts:128 - Base URL: ${baseURL}`);
  console.log(`apiDiagnostics.ts:129 - API Key: ${apiKey ? '[PRESENT]' : '[MISSING]'}`);
  console.log(`apiDiagnostics.ts:130 - Mode: ${mode}`);
  console.log(`apiDiagnostics.ts:131 - Dev: ${isDev}`);
  console.log(`apiDiagnostics.ts:132 - Prod: ${isProd}`);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log(`apiDiagnostics.ts:133 - Token: ${token ? '[PRESENT]' : '[MISSING]'}`);
    console.log(`apiDiagnostics.ts:134 - User: ${user ? '[PRESENT]' : '[MISSING]'}`);
  }
}

export function logAuthState() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    const authUser = localStorage.getItem('authUser');
    
    console.log('🔐 Auth State:');
    console.log('- token:', token ? '[PRESENT]' : '[MISSING]');
    console.log('- authToken:', authToken ? '[PRESENT]' : '[MISSING]');
    console.log('- user:', user ? '[PRESENT]' : '[MISSING]');
    console.log('- authUser:', authUser ? '[PRESENT]' : '[MISSING]');
    
    // Check if store is available
    if ((window as unknown as Record<string, unknown>).__authStore__) {
      const store = ((window as unknown as Record<string, unknown>).__authStore__ as { getState: () => Record<string, unknown> }).getState();
      console.log('- Store user:', store.user ? '[PRESENT]' : '[MISSING]');
      console.log('- Store token:', store.accessToken ? '[PRESENT]' : '[MISSING]');
      console.log('- Store authenticated:', store.isAuthenticated);
    }
  }
}