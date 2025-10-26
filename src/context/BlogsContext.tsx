import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BlogsService } from '../services/blogsService';
import { Blog, QueryParams, CreateBlogData } from '../types/models';

interface BlogsContextType {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    limit: number;
    totalPages: number;
  };
  addBlog: (blog: CreateBlogData) => Promise<void>;
  editBlog: (id: string, blog: Partial<CreateBlogData>) => Promise<void>;
  removeBlog: (id: string) => Promise<void>;
  refreshBlogs: (params?: QueryParams) => Promise<void>;
  updateCover: (id: string, file: File) => Promise<void>;
  deleteCover: (id: string) => Promise<void>;
}

const BlogsContext = createContext<BlogsContextType | undefined>(undefined);

export const BlogsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{ currentPage: number; limit: number; totalPages: number }>();

  const fetchBlogs = async (params: QueryParams = {}) => {
    try {
      setLoading(true);
      const response = await BlogsService.getBlogs(params);
      setBlogs(response.data.blogs);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      console.error('Blogs fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const addBlog = async (blog: CreateBlogData) => {
    const newBlog = await BlogsService.createBlog(blog);
    setBlogs(prev => [...prev, newBlog]);
  };

  const editBlog = async (id: string, blog: Partial<CreateBlogData>) => {
    const updatedBlog = await BlogsService.updateBlog(id, blog);
    setBlogs(prev => prev.map(b => b._id === id ? updatedBlog : b));
  };

  const removeBlog = async (id: string) => {
    await BlogsService.deleteBlog(id);
    setBlogs(prev => prev.filter(b => b._id !== id));
  };

  const updateCover = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    const updatedBlog = await BlogsService.updateCover(id, formData);
    setBlogs(prev => prev.map(b => b._id === id ? updatedBlog : b));
  };

  const deleteCover = async (id: string) => {
    const updatedBlog = await BlogsService.deleteCover(id);
    setBlogs(prev => prev.map(b => b._id === id ? updatedBlog : b));
  };

  // Disabled automatic fetching - use hooks instead
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     fetchBlogs();
  //   }
  // }, []);

  return (
    <BlogsContext.Provider value={{
      blogs,
      loading,
      error,
      pagination,
      addBlog,
      editBlog,
      removeBlog,
      refreshBlogs: fetchBlogs,
      updateCover,
      deleteCover
    }}>
      {children}
    </BlogsContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogsContext);
  if (context === undefined) {
    throw new Error('useBlogs must be used within a BlogsProvider');
  }
  return context;
};

export { BlogsContext };