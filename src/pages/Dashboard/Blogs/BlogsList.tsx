import React, { useState, useMemo, useEffect } from 'react';
import { useBlogs } from '../../../context/BlogsContext';
import { useCategories } from '../../../hooks/useCategories';
import { Blog, Category } from '../../../types/models';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import { Modal } from '../../../components/ui/modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/badge/Badge';
import Alert from '../../../components/ui/alert/Alert';
import { ListPageHeader } from '../../../components/common/ListPageHeader';
import { Pagination } from '../../../components/common/Pagination';
import BlogForm from './BlogForm';
// Memoized table row component for better performance
const BlogTableRow = React.memo(({ blog, onEdit, onDelete }: {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}) => (
  <tr key={blog._id}>
    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{blog.title}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{blog.slug}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{blog.author}</td>
    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{blog.content}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{typeof blog.category === 'object' ? blog.category?.name : blog.category}</td>
    <td className="px-6 py-4 text-sm text-gray-500">
      {blog.tags ? blog.tags.join(', ') : 'No tags'}
    </td>
    <td className="px-6 py-4 text-sm">
      <Badge color={blog.featured ? 'success' : 'light'} variant="light">
        {blog.featured ? 'Featured' : 'Regular'}
      </Badge>
    </td>
    <td className="px-6 py-4 text-sm">
      <Badge color={blog.published ? 'info' : 'warning'} variant="light">
        {blog.published ? 'Published' : 'Draft'}
      </Badge>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">{blog.views}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{blog.likes}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{blog.readTime} min</td>
    <td className="px-6 py-4 text-sm text-gray-500">
      {new Date(blog.createdAt).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 text-sm space-x-2">
      <button
        onClick={() => onEdit(blog)}
        className="text-blue-600 hover:text-blue-800"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(blog)}
        className="text-red-600 hover:text-red-800"
      >
        Delete
      </button>
    </td>
  </tr>
));
BlogTableRow.displayName = 'BlogTableRow';
const BlogsList: React.FC = () => {
  const [filters, setFilters] = useState({ category: '', featured: '', tags: '', search: '' });
  const [sortField, setSortField] = useState<string>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { blogs, loading, error, removeBlog, refreshBlogs } = useBlogs();
  const { categories } = useCategories();
  useEffect(() => {
    refreshBlogs();
  },[]);
  const filteredAndSortedBlogs = useMemo(() => {
    if (!blogs) return [];
    const filtered = blogs.filter((blog: Blog) => {
      const matchesSearch = !filters.search || 
        blog.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        blog.content?.toLowerCase().includes(filters.search.toLowerCase()) ||
        blog.author?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || blog.category === filters.category;
      const matchesFeatured = !filters.featured || blog.featured?.toString() === filters.featured;
      const matchesTags = !filters.tags || blog.tags?.some((tag: string) => tag.toLowerCase().includes(filters.tags.toLowerCase()));
      return matchesSearch && matchesCategory && matchesFeatured && matchesTags;
    });
    return filtered.sort((a: Blog, b: Blog) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField] || '';
      const bVal = (b as unknown as Record<string, unknown>)[sortField] || '';
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [blogs, filters, sortField, sortDirection]);
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedBlogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedBlogs, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(filteredAndSortedBlogs.length / itemsPerPage);
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await removeBlog(id);
      setDeleteConfirm(null);
      setAlert({ type: 'success', message: 'Blog deleted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Delete failed:', error);
      setAlert({ type: 'error', message: 'Failed to delete blog. Please try again.' });
      setTimeout(() => setAlert(null), 5000);
    }
  };
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <div className="p-6 w-[100%]">
      {alert && (
        <div className="mb-4">
          <Alert
            variant={alert.type}
            title={alert.type === 'success' ? 'Success' : 'Error'}
            message={alert.message}
          />
        </div>
      )}
      <ListPageHeader
        title="Blogs"
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        searchPlaceholder="Search blogs..."
        filter1={{
          value: filters.category,
          onChange: (value) => setFilters({ ...filters, category: value }),
          options: categories?.map((cat: Category) => ({ value: cat._id, label: cat.name })) || [],
          placeholder: 'All Categories'
        }}
        filter2={{
          value: filters.featured,
          onChange: (value) => setFilters({ ...filters, featured: value }),
          options: [
            { value: 'true', label: 'Featured Only' },
            { value: 'false', label: 'Regular Only' }
          ],
          placeholder: 'All Blogs'
        }}
        onAddClick={() => setIsFormOpen(true)}
        addButtonText="Add Blog"
      />
      {paginatedBlogs.length === 0 ? (
        <EmptyState
          title={filters.search ? 'No blogs found' : 'No blogs yet'}
          description={filters.search ? `No blogs match your search criteria` : 'Create your first blog to get started.'}
          action={{
            label: 'Add Blog',
            onClick: () => setIsFormOpen(true)
          }}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-scroll">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('title')}>
                Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('slug')}>
                Slug {sortField === 'slug' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('author')}>
                Author {sortField === 'author' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('featured')}>
                Featured {sortField === 'featured' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('published')}>
                Published {sortField === 'published' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('views')}>
                Views {sortField === 'views' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('likes')}>
                Likes {sortField === 'likes' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('readTime')}>
                Read Time {sortField === 'readTime' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('createdAt')}>
                Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {paginatedBlogs.map((blog: Blog) => (
              <BlogTableRow
                key={blog._id}
                blog={blog}
                onEdit={(blog) => {
                  setEditingBlog(blog);
                  setIsFormOpen(true);
                }}
                onDelete={setDeleteConfirm}
              />
            ))}
          </tbody>
        </table>
        </div>
      )}
      {/* Pagination */}
      {filteredAndSortedBlogs.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            limit={itemsPerPage}
            total={filteredAndSortedBlogs.length}
            onPageChange={setCurrentPage}
            onLimitChange={(newLimit) => {
              setItemsPerPage(newLimit);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }}
        className="max-w-md mx-4 p-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 ">
            {editingBlog ? 'Edit Blog' : 'Add Blog'}
          </h3>
          <BlogForm
            blog={editingBlog}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingBlog(null);
              setAlert({ type: 'success', message: `Blog ${editingBlog ? 'updated' : 'created'} successfully!` });
              setTimeout(() => setAlert(null), 3000);
            }}
          />
        </div>
      </Modal>
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        className="max-w-md mx-4 p-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
          <p className="mb-4">Are you sure you want to delete "{deleteConfirm?.title}"?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm._id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default BlogsList;