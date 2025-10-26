import React, { useState, useEffect, useCallback } from 'react';
import { useProjects } from '../../../hooks/useProjects';
import { useCategories } from '../../../hooks/useCategories';
import { Project, Category, CreateProjectData } from '../../../types/models';
import { compressImage, validateImageFile } from '../../../utils/imageUtils';
import Select from '../../../components/form/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
}
const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: '',
    client: '',
    status: 'Ongoing' as 'Ongoing' | 'Completed' | 'Paused',
    githubUrl: '',
    liveDemoUrl: '',
    featured: false,
    startDate: null as Date | null,
    endDate: null as Date | null,
    images: [] as string[],
  });
  const { categories } = useCategories();
  const { addProject, editProject } = useProjects();
  const [isLoading, setIsLoading] = useState(false);
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const validationError = validateImageFile(file);
      if (validationError) {
        alert(validationError);
        continue;
      }
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, compressedBase64]
        }));
      } catch (error) {
        console.error('Image compression failed:', error);
        alert('Failed to process image. Please try again.');
      }
    }
  }, []);
  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        category: typeof project.category === 'string' ? project.category : project.category._id,
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
        client: project.client || '',
        status: project.status as 'Ongoing' | 'Completed' | 'Paused',
        githubUrl: project.githubUrl || '',
        liveDemoUrl: project.liveDemoUrl || '',
        featured: project.featured,
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        images: project.images || [],
      });
    }
  }, [project]);
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData: CreateProjectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        client: formData.client || undefined,
        status: formData.status,
        images: formData.images.length > 0 ? formData.images : undefined,
        githubUrl: formData.githubUrl || undefined,
        liveDemoUrl: formData.liveDemoUrl || undefined,
        featured: formData.featured,
        startDate: formData.startDate ? formData.startDate.toISOString() : undefined,
        endDate: formData.endDate ? formData.endDate.toISOString() : undefined,
      };
      if (project) {
        await editProject(project._id, submitData);
      } else {
        await addProject(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, project, editProject, addProject, onSuccess]);
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData(prev => ({ ...prev, title: e.target.value }));
            }, [])}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Client
        </label>
        <input
          type="text"
          value={formData.client}
          onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, client: e.target.value }));
          }, [])}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Client name (optional)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData(prev => ({ ...prev, description: e.target.value }));
          }, [])}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
              setFormData(prev => ({ ...prev, category: e.target.value }));
            }, [])}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Status
          </label>
          <select
            value={formData.status}
            onChange={useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
              setFormData(prev => ({ ...prev, status: e.target.value as 'Ongoing' | 'Completed' | 'Paused' }));
            }, [])}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Technologies
        </label>
        <input
          type="text"
          value={formData.technologies}
          onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, technologies: e.target.value }));
          }, [])}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter technologies separated by commas (e.g., React, Node.js, MongoDB)"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <DatePicker
            selected={formData.startDate instanceof Date ? formData.startDate : null}
            onChange={useCallback((date: Date | null) => {
              setFormData(prev => ({ ...prev, startDate: date }));
            }, [])}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select start date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <DatePicker
            selected={formData.endDate instanceof Date ? formData.endDate : null}
            onChange={useCallback((date: Date | null) => {
              setFormData(prev => ({ ...prev, endDate: date }));
            }, [])}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select end date"
            minDate={formData.startDate instanceof Date ? formData.startDate : undefined}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Max 1MB per image. Images will be compressed to 800x600px. Supports JPG, PNG, GIF, WebP</p>
        {formData.images && formData.images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData(prev => ({ ...prev, githubUrl: e.target.value }));
            }, [])}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Live Demo URL
          </label>
          <input
            type="url"
            value={formData.liveDemoUrl}
            onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData(prev => ({ ...prev, liveDemoUrl: e.target.value }));
            }, [])}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, featured: e.target.checked }));
          }, [])}
          className="mr-2"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Featured Project
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
          {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};
export default ProjectForm;