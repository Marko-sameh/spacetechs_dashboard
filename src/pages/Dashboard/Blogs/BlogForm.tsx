import React, { useState, useEffect } from 'react';
import { useBlogs } from '../../../context/BlogsContext';
import { useCategories } from '../../../hooks/useCategories';
import { Blog, Category, CreateBlogData } from '../../../types/models';
interface BlogFormProps {
  blog?: Blog | null;
  onSuccess: () => void;
}
const BlogForm: React.FC<BlogFormProps> = ({ blog, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    tags: '',
    author: '',
    featured: false,
  });
  const { categories } = useCategories();
  const { addBlog, editBlog } = useBlogs();
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        summary: blog.summary || '',
        content: blog.content,
        category: typeof blog.category === 'string' ? blog.category : blog.category._id,
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
        author: blog.author || '',
        featured: blog.featured,
      });
    }
  }, [blog]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData: CreateBlogData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: formData.author,
        featured: formData.featured,
      };
      if (!formData.category) {
        alert('Please select a category');
        return;
      }
      if (blog) {
        await editBlog(blog._id, submitData);
      } else {
        await addBlog(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to save blog. The server returned an error. Please check your data and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Summary
        </label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Brief summary of the blog post"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
          rows={8}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          {categories?.map((cat: Category) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="react, javascript, tutorial"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Author
        </label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Author name"
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Featured
        </label>
      </div>
      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
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
          className="px-4 py-2 text-white rounded hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#273469' }}
        >
          {isLoading ? 'Saving...' : blog ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};
export default BlogForm;