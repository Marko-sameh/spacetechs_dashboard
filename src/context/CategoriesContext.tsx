import React, { createContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { CategoriesService } from '../services/categoriesService';
import { Category, QueryParams, CreateCategoryData } from '../types/models';
interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalPages: number;
}
interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination?: PaginationInfo;
  addCategory: (category: CreateCategoryData) => Promise<void>;
  editCategory: (id: string, category: Partial<CreateCategoryData>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  refreshCategories: (params?: QueryParams) => Promise<void>;
  updateIcon: (id: string, file: File) => Promise<void>;
  deleteIcon: (id: string) => Promise<void>;
}
const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);
export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>();
  const fetchCategories = useCallback(async (params: QueryParams = {}) => {
    try {
      setLoading(true);
      const response = await CategoriesService.getCategories(params);
      setCategories(response.data.categories);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      console.error('Categories fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);
  const addCategory = async (category: CreateCategoryData) => {
    const newCategory = await CategoriesService.createCategory(category);
    setCategories(prev => [...prev, newCategory]);
  };
  const editCategory = async (id: string, category: Partial<CreateCategoryData>) => {
    try {
      const updatedCategory = await CategoriesService.updateCategory(id, category);
      setCategories(prev => prev.map(c => c._id === id ? updatedCategory : c));
    } catch (err) {
      console.error('Failed to update category:', err);
      throw err;
    }
  };
  const removeCategory = async (id: string) => {
    await CategoriesService.deleteCategory(id);
    setCategories(prev => prev.filter(c => c._id !== id));
  };
  const updateIcon = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('imageIcon', file);
    const updatedCategory = await CategoriesService.updateIcon(id, formData);
    setCategories(prev => prev.map(c => c._id === id ? updatedCategory : c));
  };
  const deleteIcon = async (id: string) => {
    const updatedCategory = await CategoriesService.deleteIcon(id);
    setCategories(prev => prev.map(c => c._id === id ? updatedCategory : c));
  };
  // Disabled automatic fetching - use hooks instead
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     fetchCategories();
  //   }
  // }, []);
  const contextValue = useMemo(() => ({
    categories,
    loading,
    error,
    pagination,
    addCategory,
    editCategory,
    removeCategory,
    refreshCategories: fetchCategories,
    updateIcon,
    deleteIcon
  }), [categories, loading, error, pagination, fetchCategories]);
  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
};
export { CategoriesContext };