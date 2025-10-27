import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
  const processFiles = useCallback(async (files: File[]) => {
    const maxImages = 10;
    if (formData.images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    const newImages: string[] = [];
    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) {
        alert(`${file.name}: ${validationError}`);
        continue;
      }
      try {
        const compressedBase64 = await compressImage(file);
        newImages.push(compressedBase64);
      } catch (error) {
        console.error('Image compression failed:', error);
        alert(`Failed to process ${file.name}`);
      }
    }
    
    if (newImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  }, [formData.images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 10,
    onDrop: processFiles,
    disabled: formData.images.length >= 10
  });
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
      // Validate required fields
      if (!formData.title.trim()) {
        alert('Title is required');
        return;
      }
      if (!formData.description.trim()) {
        alert('Description is required');
        return;
      }
      if (!formData.category) {
        alert('Category is required');
        return;
      }

      const submitData: CreateProjectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        technologies: formData.technologies ? formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech) : [],
        client: formData.client?.trim() || undefined,
        status: formData.status,
        images: formData.images.length > 0 ? formData.images : undefined,
        githubUrl: formData.githubUrl?.trim() || undefined,
        liveDemoUrl: formData.liveDemoUrl?.trim() || undefined,
        featured: formData.featured,
        startDate: formData.startDate ? formData.startDate.toISOString() : undefined,
        endDate: formData.endDate ? formData.endDate.toISOString() : undefined,
      };
      
      console.log('Form data being submitted:', submitData);
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
          Project Images ({formData.images.length}/10)
        </label>
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          } ${formData.images.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isDragActive ? (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Drop images here...</p>
            ) : (
              <>
                <p className="text-sm">Drag & drop images here, or click to select</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 3MB each (max 10 images)</p>
              </>
            )}
          </div>
        </div>
        
        {formData.images && formData.images.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group aspect-square animate-fadeIn">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-600 transition-transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
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