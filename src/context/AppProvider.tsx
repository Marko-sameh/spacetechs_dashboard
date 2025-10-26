import React, { ReactNode } from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { CategoriesProvider } from './CategoriesContext';
import { BlogsProvider } from './BlogsContext';
import { UserProvider } from './UserContext';
import { SidebarProvider } from './SidebarContext';
import { ThemeProvider } from './ThemeContext';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Unified app provider that combines all context providers
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <ProjectsProvider>
          <CategoriesProvider>
            <BlogsProvider>
              <UserProvider>
                {children}
              </UserProvider>
            </BlogsProvider>
          </CategoriesProvider>
        </ProjectsProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
};