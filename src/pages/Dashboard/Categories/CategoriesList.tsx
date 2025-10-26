import React, { useState, useEffect, useMemo } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import { Modal } from '../../../components/ui/modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import Alert from '../../../components/ui/alert/Alert';
import { ListPageHeader } from '../../../components/common/ListPageHeader';
import CategoryForm from './CategoryForm';
import { Category } from '../../../types/models';
const CategoriesList: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Category>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  const { categories, loading, error, removeCategory, refreshCategories } = useCategories();
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);
  const filteredAndSortedCategories = useMemo(() => {
    if (!categories) return [];
    const filtered = categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.slug.toLowerCase().includes(search.toLowerCase()) ||
        (category.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesDate = !dateFilter || 
        (dateFilter === 'recent' && new Date(category.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === 'older' && new Date(category.createdAt) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      return matchesSearch && matchesDate;
    });
    return filtered.sort((a, b) => {
      let aVal: string | number | Date;
      let bVal: string | number | Date;
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aVal = new Date(a[sortField] as string);
        bVal = new Date(b[sortField] as string);
        const comparison = aVal.getTime() - bVal.getTime();
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        aVal = (a[sortField] || '').toString().toLowerCase();
        bVal = (b[sortField] || '').toString().toLowerCase();
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });
  }, [categories, search, sortField, sortDirection, dateFilter]);
  const handleSort = (field: keyof Category) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await removeCategory(id);
      setDeleteConfirm(null);
      setAlert({ type: 'success', message: 'Category deleted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Delete failed:', error);
      setAlert({ type: 'error', message: 'Failed to delete category. Please try again.' });
      setTimeout(() => setAlert(null), 5000);
    }
  };
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load categories" />;
  return (
    <div className="p-6">
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
        title="Categories"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories..."
        filter1={{
          value: `${sortField}-${sortDirection}`,
          onChange: (value: string) => {
            const [field, direction] = value.split('-') as [keyof Category, 'asc' | 'desc'];
            setSortField(field);
            setSortDirection(direction);
          },
          options: [
            { value: 'name-asc', label: 'Name (A-Z)' },
            { value: 'name-desc', label: 'Name (Z-A)' },
            { value: 'createdAt-desc', label: 'Newest First' },
            { value: 'createdAt-asc', label: 'Oldest First' },
            { value: 'updatedAt-desc', label: 'Recently Updated' },
            { value: 'updatedAt-asc', label: 'Least Recently Updated' }
          ],
          placeholder: 'Sort by'
        }}
        filter2={{
          value: dateFilter,
          onChange: setDateFilter,
          options: [
            { value: 'recent', label: 'Recent (7 days)' },
            { value: 'older', label: 'Older than 7 days' }
          ],
          placeholder: 'Filter by Date'
        }}
        onAddClick={() => setIsFormOpen(true)}
        addButtonText="Add Category"
      />
      {filteredAndSortedCategories.length === 0 ? (
        <EmptyState
          title={search ? 'No categories found' : 'No categories yet'}
          description={search ? `No categories match "${search}"` : 'Create your first category to get started.'}
          action={{
            label: 'Add Category',
            onClick: () => setIsFormOpen(true)
          }}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('slug')}>
                  Slug {sortField === 'slug' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('createdAt')}>
                  Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('updatedAt')}>
                  Updated {sortField === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredAndSortedCategories.map((category: Category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 text-sm">
                    {category.imageIcon && (
                      <img src={category.imageIcon} alt={category.name} className="w-8 h-8 rounded" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setIsFormOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        className="max-w-md mx-4 p-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </h3>
          <CategoryForm
            category={editingCategory}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingCategory(null);
              setAlert({ type: 'success', message: `Category ${editingCategory ? 'updated' : 'created'} successfully!` });
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
          <p className="mb-4">Are you sure you want to delete "{deleteConfirm?.name}"?</p>
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
      {/* <UserInfoCard></UserInfoCard> */}
    </div>
  );
};
export default CategoriesList;