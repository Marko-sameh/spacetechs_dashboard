import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { zeroReflow } from '../../../utils/extremePerformanceOptimizer';
import { useProjects } from '../../../hooks/useProjects';
import { useCategories } from '../../../hooks/useCategories';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import { Modal } from '../../../components/ui/modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/badge/Badge';
import Alert from '../../../components/ui/alert/Alert';
import { ListPageHeader } from '../../../components/common/ListPageHeader';
import { OptimizedLazyImage } from '../../../components/common/OptimizedLazyImage';
import { Pagination } from '../../../components/common/Pagination';
import ProjectForm from './ProjectForm';
interface Project {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  category?: string | Category;
  client?: string;
  technologies?: string[];
  status?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  images?: string[];
  videos?: string[];
  createdAt?: string;
  updatedAt?: string;
}
interface Category {
  _id: string;
  name: string;
}
// Memoized mobile card component for better performance
const ProjectMobileCard = memo(({ project, onEdit, onDelete }: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
    <div className="flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {project.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {project.client || 'No client'}
        </p>
      </div>
      <Badge 
        color={project.status === 'Completed' ? 'success' : project.status === 'Ongoing' ? 'info' : 'warning'}
        variant="light"
        className="ml-2 flex-shrink-0"
      >
        {project.status}
      </Badge>
    </div>
    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
      {project.description}
    </p>
    <div className="flex flex-wrap gap-1">
      {project.technologies?.slice(0, 3).map((tech: string, index: number) => (
        <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
          {tech}
        </span>
      ))}
      {project.technologies && project.technologies.length > 3 && (
        <span className="text-xs text-gray-400">+{project.technologies.length - 3}</span>
      )}
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
      <div className="flex space-x-2 text-xs">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            GitHub
          </a>
        )}
        {project.liveDemoUrl && (
          <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" 
             className="text-green-600 hover:text-green-800 dark:text-green-400">
            Demo
          </a>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(project)}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 px-2 py-1"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project)}
          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 px-2 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
));
ProjectMobileCard.displayName = 'ProjectMobileCard';
// Memoized desktop table row component
const ProjectTableRow = memo(({ project, onEdit, onDelete }: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) => (
  <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
      <div className="max-w-[200px] truncate">{project.title}</div>
    </td>
    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      <div className="max-w-[150px] truncate">{project.client || '-'}</div>
    </td>
    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      {typeof project.category === 'object' ? (project.category as Category)?.name : project.category || '-'}
    </td>
    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      <div className="max-w-[200px] truncate">{project.description}</div>
    </td>
    <td className="px-4 py-3 text-sm">
      <Badge 
        color={project.status === 'Completed' ? 'success' : project.status === 'Ongoing' ? 'info' : 'warning'}
        variant="light"
      >
        {project.status}
      </Badge>
    </td>
    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex flex-wrap gap-1 max-w-[150px]">
        {project.technologies?.slice(0, 2).map((tech: string, index: number) => (
          <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
            {tech}
          </span>
        ))}
        {project.technologies && project.technologies.length > 2 && (
          <span className="text-xs text-gray-400">+{project.technologies.length - 2}</span>
        )}
      </div>
    </td>
    <td className="px-4 py-3 text-sm">
      <Badge color={project.featured ? 'success' : 'light'} variant="light">
        {project.featured ? 'Featured' : 'Regular'}
      </Badge>
    </td>
    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
    </td>
    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
    </td>
    <td className="px-4 py-3 text-sm">
      <div className="flex space-x-2">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            GitHub
          </a>
        )}
        {project.liveDemoUrl && (
          <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" 
             className="text-green-600 hover:text-green-800 dark:text-green-400">
            Demo
          </a>
        )}
      </div>
    </td>
    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center space-x-2">
        {project.images && project.images.length > 0 && (
          <div className="flex items-center space-x-1">
            <OptimizedLazyImage
              src={project.images[0]}
              alt={project.title}
              className="w-8 h-8 rounded object-cover"
              priority={false}
            />
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
              {project.images.length}
            </span>
          </div>
        )}
        {project.videos && project.videos.length > 0 && (
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
            {project.videos.length} vid
          </span>
        )}
      </div>
    </td>
    <td className="px-4 py-3 text-sm space-x-2">
      <button
        onClick={() => onEdit(project)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(project)}
        className="text-red-600 hover:text-red-800 dark:text-red-400"
      >
        Delete
      </button>
    </td>
  </tr>
));
ProjectTableRow.displayName = 'ProjectTableRow';
const ProjectsList: React.FC = () => {
  const [filters, setFilters] = useState({ category: '', featured: '', search: '' });
  const [sortField, setSortField] = useState<keyof Project>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { projects, loading, error, removeProject, refreshProjects } = useProjects();
  const { categories, refreshCategories } = useCategories();
  // Zero reflow resize handling
  useEffect(() => {
    const handleResize = () => {
      zeroReflow.read('viewport', () => {
        const width = window.innerWidth;
        zeroReflow.write(() => setIsMobile(width < 768));
        return width;
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    refreshProjects();
    refreshCategories();
  }, [refreshProjects, refreshCategories]);
  const filteredAndSortedProjects = useMemo(() => {
    if (!projects) return [];
    const filtered = projects.filter((project) => {
      const matchesSearch = !filters.search || 
        project.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.status?.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.technologies?.some((tech: string) => tech.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesCategory = !filters.category || (typeof project.category === 'string' ? project.category === filters.category : (project.category as any)?._id === filters.category);
      const matchesFeatured = !filters.featured || project.featured?.toString() === filters.featured;
      return matchesSearch && matchesCategory && matchesFeatured;
    });
    return filtered.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField] || '';
      const bVal = (b as unknown as Record<string, unknown>)[sortField] || '';
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [projects, filters, sortField, sortDirection]);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProjects, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const handleSort = useCallback((field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);
  const handleEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  }, []);
  const handleDeleteClick = useCallback((project: Project) => {
    setDeleteConfirm(project);
  }, []);
  const handleDelete = useCallback(async (id: string) => {
    try {
      await removeProject(id);
      setDeleteConfirm(null);
      setAlert({ type: 'success', message: 'Project deleted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Delete failed:', error);
      setAlert({ type: 'error', message: 'Failed to delete project. Please try again.' });
      setTimeout(() => setAlert(null), 5000);
    }
  }, [removeProject]);
  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="p-4 sm:p-6">
      <ErrorMessage message={`Failed to load projects: ${error}`} />
      <button 
        onClick={() => refreshProjects()} 
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );
  return (
    <div className="p-3 sm:p-4 lg:p-6">
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
        title="Projects"
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        searchPlaceholder="Search projects..."
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
          placeholder: 'All Projects'
        }}
        onAddClick={() => setIsFormOpen(true)}
        addButtonText="Add Project"
      />
      {/* Projects List */}
      {paginatedProjects.length === 0 ? (
        <EmptyState
          title={filters.search ? 'No projects found' : 'No projects yet'}
          description={filters.search ? `No projects match your search criteria` : 'Create your first project to get started.'}
          action={{
            label: 'Add Project',
            onClick: () => setIsFormOpen(true)
          }}
        />
      ) : (
        <>
          {/* Mobile View - Cards */}
          {isMobile ? (
            <div className="space-y-3 sm:space-y-4">
              {paginatedProjects.map((project) => (
                <ProjectMobileCard
                  key={project._id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            /* Desktop View - Table */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                          onClick={() => handleSort('title')}>
                        Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                          onClick={() => handleSort('client')}>
                        Client {sortField === 'client' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                          onClick={() => handleSort('status')}>
                        Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Technologies</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                          onClick={() => handleSort('featured')}>
                        Featured {sortField === 'featured' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                          onClick={() => handleSort('startDate')}>
                        Start Date {sortField === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                          onClick={() => handleSort('endDate')}>
                        End Date {sortField === 'endDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Links</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Media</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {paginatedProjects.map((project) => (
                      <ProjectTableRow
                        key={project._id}
                        project={project}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      {/* Pagination */}
      {filteredAndSortedProjects.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            limit={itemsPerPage}
            total={filteredAndSortedProjects.length}
            onPageChange={setCurrentPage}
            onLimitChange={(newLimit) => {
              setItemsPerPage(newLimit);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        className="max-w-2xl mx-4 p-4 sm:p-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingProject ? 'Edit Project' : 'Add Project'}
          </h3>
          <ProjectForm
            project={editingProject as any}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingProject(null);
              setAlert({ type: 'success', message: `Project ${editingProject ? 'updated' : 'created'} successfully!` });
              setTimeout(() => setAlert(null), 3000);
            }}
          />
        </div>
      </Modal>
      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        className="max-w-md mx-4 p-4 sm:p-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete "{deleteConfirm?.title}"?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm._id)}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ProjectsList;