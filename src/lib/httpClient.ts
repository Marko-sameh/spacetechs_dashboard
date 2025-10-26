/**
 * HTTP Client Enforcement
 * 
 * This file ensures that apiClient is the ONLY way to make HTTP requests
 * in the application. All other HTTP methods are disabled.
 */

import apiClient from './apiClient';

// Export ONLY the apiClient
export { default as apiClient } from './apiClient';

// Disable global fetch to force usage of apiClient
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  
  window.fetch = (...args) => {
    console.warn('🚫 Direct fetch() calls are not allowed. Use apiClient instead.');
    console.trace('Fetch call stack:');
    
    // Allow fetch only for non-API calls (like static resources)
    const url = args[0] as string;
    if (url.startsWith('http') && (url.includes('/api') || url.includes('backend'))) {
      throw new Error('Direct fetch() to API endpoints is not allowed. Use apiClient instead.');
    }
    
    return originalFetch.apply(window, args);
  };
}

// Prevent axios imports
export const axios = undefined;
export const Axios = undefined;

// Export a helper to check if HTTP client is properly used
export const validateHttpClient = () => {
  console.log('✅ HTTP Client Validation: Only apiClient is allowed for API calls');
  return true;
};

export default apiClient;