import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDashboardStore } from '../store/dashboardStore';
import { UserService } from '../services/userService';
import { User, QueryParams } from '../types/models';
import { useMemo } from 'react';

interface UseUsersOptions {
  enabled?: boolean;
  overrides?: Partial<QueryParams>;
}

/**
 * Users hook - manages user data with admin functionality and global state
 */
export function useUsers(options: UseUsersOptions = {}) {
  const queryClient = useQueryClient();
  const { filters, sort, search, page, limit } = useDashboardStore();
  
  const queryParams = useMemo(() => ({
    ...filters,
    sort,
    search: search || undefined,
    page,
    limit,
    ...options.overrides,
  }), [filters, sort, search, page, limit, options.overrides]);

  // Fetch users query
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => UserService.getUsers(queryParams),
    enabled: options.enabled !== false,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    retry: 1,
    select: (data) => ({
      users: data.data.users,
      pagination: data.pagination,
      total: data.results || 0,
    }),
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      UserService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    // Data
    users: response?.users || [],
    paginationMeta: response?.pagination,
    total: response?.total || 0,
    
    // States
    isLoading,
    isError,
    error,
    isFetching,
    
    // Actions
    refetch,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Mutation errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}

/**
 * Hook to fetch single user by ID
 */
export function useUser(id: string, enabled = true) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => UserService.getUser(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}