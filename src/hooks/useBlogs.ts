import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDashboardStore } from '../store/dashboardStore';
import { BlogsService } from '../services/blogsService';
import { Blog, QueryParams, CreateBlogData } from '../types/models';
import { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

interface UseBlogsOptions {
  enabled?: boolean;
  overrides?: Partial<QueryParams>;
}

/**
 * Blogs hook - manages blog data with content management features and global state
 */
export function useBlogs(options: UseBlogsOptions = {}) {
  const queryClient = useQueryClient();
  const { filters, sort, search, page, limit } = useDashboardStore();
  const { isAuthenticated } = useAuthStore();
  
  const queryParams = useMemo(() => ({
    ...filters,
    sort,
    search: search || undefined,
    page,
    limit,
    ...options.overrides,
  }), [filters, sort, search, page, limit, options.overrides]);

  // Fetch blogs query
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['blogs', queryParams],
    queryFn: () => BlogsService.getBlogs(queryParams),
    enabled: options.enabled === true && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    retry: 1,
    select: (data) => ({
      blogs: data.data.blogs,
      pagination: data.pagination,
      total: data.results || 0,
    }),
  });

  // Create blog mutation
  const createMutation = useMutation({
    mutationFn: BlogsService.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  // Update blog mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Blog> }) =>
      BlogsService.updateBlog(id, {
        ...data,
        category: typeof data.category === 'object' ? data.category?._id : data.category
      } as Partial<CreateBlogData>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: BlogsService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  // Update cover mutation
  const updateCoverMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      BlogsService.updateCover(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  return {
    // Data
    blogs: response?.blogs || [],
    paginationMeta: response?.pagination,
    total: response?.total || 0,
    
    // States
    isLoading,
    isError,
    error,
    isFetching,
    
    // Actions
    refetch,
    createBlog: createMutation.mutate,
    updateBlog: updateMutation.mutate,
    deleteBlog: deleteMutation.mutate,
    updateCover: updateCoverMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdatingCover: updateCoverMutation.isPending,
    
    // Mutation errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}

/**
 * Hook to fetch single blog by ID
 */
export function useBlog(id: string, enabled = true) {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['blogs', id],
    queryFn: () => BlogsService.getBlog(id),
    enabled: enabled && !!id && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}