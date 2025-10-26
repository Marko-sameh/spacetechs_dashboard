import { useState, useCallback } from 'react';
/**
 * Generic API hook for handling loading states and errors
 */
export function useApi<T = unknown, P = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const execute = useCallback(async (apiCall: (params?: P) => Promise<T>, params?: P) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall(params);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);
  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}