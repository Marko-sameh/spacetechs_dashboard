import React, { useEffect, memo, useMemo } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useCategories } from "../../hooks/useCategories";
import { useBlogs } from "../../hooks/useBlogs";
import { useUsers } from "../../hooks/useUsers";
import PageMeta from "../../components/common/PageMeta";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import ResponsiveContainer from "../../components/ui/ResponsiveContainer";
import ResponsiveGrid from "../../components/ui/ResponsiveGrid";
// Inline SVG icons to avoid lucide-react dependency
const FolderCheck = () => (
  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const Boxes = () => (
  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const NotebookTabs = () => (
  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const Users = () => (
  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// Memoized stat card component for performance
const StatCard = memo(({ icon, title, value, subtitle, color = "brand" }: {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle?: string;
  color?: string;
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-${color}-50 dark:bg-${color}-800/30`}>
      {icon}
    </div>
    <div className="mt-1.5 sm:mt-2 flex items-end justify-between">
      <div>
        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
          {value}
        </h4>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{title}</span>
      </div>
      {subtitle && (
        <span className={`flex items-center gap-1 text-xs font-medium text-${color}-500 dark:text-${color}-400`}>
          {subtitle}
        </span>
      )}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

// Memoized recent items component
const RecentItemsCard = memo(({ title, items, renderItem }: {
  title: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <h4 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
      {title}
    </h4>
    <div className="space-y-2 sm:space-y-3">
      {items.slice(0, 5).map(renderItem)}
    </div>
  </div>
));

RecentItemsCard.displayName = 'RecentItemsCard';

export default function Home() {
  const { projects, loading: projectsLoading, refreshProjects } = useProjects();
  const { categories, loading: categoriesLoading, refreshCategories } = useCategories();
  const { blogs, isLoading: blogsLoading } = useBlogs({ enabled: true });
  const { users, isLoading: usersLoading } = useUsers({ enabled: true });

  useEffect(() => {
    refreshProjects();
    refreshCategories();
  }, [refreshProjects, refreshCategories]);

  const isLoading = projectsLoading || categoriesLoading || blogsLoading || usersLoading;

  // Memoize stats calculation for performance
  const stats = useMemo(() => ({
    totalProjects: projects.length,
    featuredProjects: projects.filter(p => p.featured).length,
    totalCategories: categories.length,
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter(b => b.published).length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.active).length
  }), [projects, categories, blogs, users]);

  // Memoized render functions for performance
  const renderProjectItem = useMemo(() => (project: any) => (
    <div key={project._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 gap-2 sm:gap-4">
      <div className="min-w-0 flex-1">
        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
          {project.title}
        </h5>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{project.status}</p>
      </div>
      <div className="flex-shrink-0">
        <p className="text-xs text-brand-500 dark:text-brand-400">
          {project.technologies?.slice?.(0, 2)?.join?.(', ') || ''}
        </p>
      </div>
    </div>
  ), []);

  const renderBlogItem = useMemo(() => (blog: any) => (
    <div key={blog._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 gap-2 sm:gap-4">
      <div className="min-w-0 flex-1">
        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
          {blog.title}
        </h5>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {blog.published ? 'Published' : 'Draft'}
        </p>
      </div>
      <div className="flex-shrink-0">
        <p className="text-xs text-brand-500 dark:text-brand-400">
          {blog.views || 0} views
        </p>
      </div>
    </div>
  ), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ResponsiveContainer maxWidth="full" padding="md">
      <PageMeta
        title="Dashboard | SpaceTechs - React.js Admin Dashboard"
        description="Admin Dashboard Overview"
      />

      {/* Stats Grid - Responsive */}
      <ResponsiveGrid
        cols={{ mobile: 1, tablet: 2, desktop: 4 }}
        gap="md"
        className="mb-6"
        minItemWidth=""
      >
        <StatCard
          icon={<FolderCheck />}
          title="Total Projects"
          value={stats.totalProjects}
          subtitle={`${stats.featuredProjects} Featured`}
        />

        <StatCard
          icon={<Boxes />}
          title="Categories"
          value={stats.totalCategories}
        />

        <StatCard
          icon={<NotebookTabs />}
          title="Blog Posts"
          value={stats.totalBlogs}
          subtitle={`${stats.publishedBlogs} Published`}
        />

        <StatCard
          icon={<Users />}
          title="Total Users"
          value={stats.totalUsers}
        />
      </ResponsiveGrid>

      {/* Recent Activity - Responsive Grid */}
      <ResponsiveGrid
        cols={{ mobile: 1, tablet: 1, desktop: 2 }}
        gap="lg"
      >
        <RecentItemsCard
          title="Recent Projects"
          items={projects}
          renderItem={renderProjectItem}
        />

        <RecentItemsCard
          title="Recent Blogs"
          items={blogs}
          renderItem={renderBlogItem}
        />
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
}