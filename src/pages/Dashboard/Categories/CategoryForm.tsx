import React, { useState, useEffect, useCallback } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import { Category, CreateCategoryData } from '../../../types/models';

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess }) => {
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    slug: '',
    description: '',
    imageIcon: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { addCategory, editCategory } = useCategories();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        imageIcon: category.imageIcon || '',
      });
      if (category.imageIcon) {
        setImagePreview(category.imageIcon);
      }
    }
  }, [category]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        imageIcon: formData.imageIcon,
      };
      
      if (category) {
        await editCategory(category._id, submitData);
      } else {
        await addCategory(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to save category. The server returned an error. Please check your data and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [category, formData, editCategory, addCategory, onSuccess]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Icon
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result as string;
                setFormData(prev => ({ ...prev, imageIcon: base64 }));
                setImagePreview(base64);
              };
              reader.readAsDataURL(file);
            }
          }, [])}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Icon preview" className="w-16 h-16 object-cover rounded" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
          }, [])}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Slug
        </label>
        <input
          type="text"
          value={formData.slug || ''}
          onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, slug: e.target.value }));
          }, [])}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="URL-friendly version of name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData(prev => ({ ...prev, description: e.target.value }));
          }, [])}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;