# SpaceTechs React - Project Structure

## Directory Architecture

### Root Level Configuration
```
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS v4 configuration
├── eslint.config.js      # ESLint configuration
└── postcss.config.js     # PostCSS configuration
```

### Source Code Organization (`src/`)

#### Core Application Files
- `main.tsx` - Application entry point with React 19
- `App.tsx` - Main app component with routing
- `index.css` - Global styles and Tailwind imports

#### Components Architecture (`components/`)
```
components/
├── auth/           # Authentication forms and components
├── common/         # Shared/reusable components
├── form/           # Form elements and inputs
├── header/         # Header-specific components
├── projects/       # Project management components
├── tables/         # Data table components
├── ui/             # Base UI components
└── UserProfile/    # User profile management
```

#### Context & State Management (`context/`)
- `AuthContext.tsx` - Authentication state management
- `ProjectsContext.tsx` - Project data management
- `ThemeContext.tsx` - Theme and dark mode
- `SidebarContext.tsx` - Sidebar state
- `BlogsContext.tsx` - Blog/content management
- `CategoriesContext.tsx` - Category management
- `UserContext.tsx` - User data management

#### Custom Hooks (`hooks/`)
- `useAuth.ts` - Authentication logic
- `useProjects.ts` - Project operations
- `useModal.ts` - Modal state management
- `useGoBack.ts` - Navigation utilities
- `useBlogs.ts` - Blog operations
- `useCategories.ts` - Category operations
- `useUsers.ts` - User management

#### Layout System (`layout/`)
- `AppLayout.tsx` - Main application layout wrapper
- `AppHeader.tsx` - Top navigation header
- `AppSidebar.tsx` - Collapsible sidebar navigation
- `Backdrop.tsx` - Modal backdrop component
- `SidebarWidget.tsx` - Sidebar widget components

#### Pages Structure (`pages/`)
```
pages/
├── AuthPages/      # Login, signup, password reset
├── Dashboard/      # Main dashboard views
├── OtherPage/      # Additional pages
├── Blank.tsx       # Blank page template
└── UserProfiles.tsx # User profile pages
```

#### Services Layer (`services/`)
- `authService.ts` - Authentication API calls
- `projectsService.ts` - Project CRUD operations
- `blogsService.ts` - Blog/content API
- `categoriesService.ts` - Category management API

#### State Management (`store/`)
- `authStore.ts` - Zustand auth store
- `dashboardStore.ts` - Dashboard state management

#### Utilities (`utils/`)
- `apiIntegrationTest.ts` - API testing utilities
- `apiDebug.ts` - API debugging tools
- `apiDiagnostics.ts` - API health checks
- `authTest.ts` - Authentication testing

#### Type Definitions (`types/`)
- `models.ts` - TypeScript interfaces and types

#### API Layer (`lib/`)
- `apiClient.ts` - Axios HTTP client configuration
- `apiDiagnostics.ts` - API monitoring
- `buildQueryParams.ts` - Query parameter utilities

### Assets & Resources

#### Icons (`icons/`)
- SVG icon collection with TypeScript index
- Comprehensive icon set for UI components

#### Public Assets (`public/`)
```
public/
├── images/         # Static images organized by category
│   ├── brand/      # Brand assets
│   ├── user/       # User avatars
│   ├── product/    # Product images
│   └── icons/      # Icon assets
└── favicon.png     # Site favicon
```

## Architectural Patterns

### Component Architecture
- **Functional Components**: React 19 with hooks
- **Context Providers**: Centralized state management
- **Custom Hooks**: Reusable business logic
- **Compound Components**: Complex UI patterns

### State Management Strategy
- **React Context**: Global application state
- **Zustand**: Lightweight state management
- **Local State**: Component-specific state with useState
- **Server State**: React Query for API data

### Routing Structure
- **React Router v7**: Client-side routing
- **Protected Routes**: Authentication-based access
- **Nested Routing**: Hierarchical page structure
- **Dynamic Routes**: Parameter-based navigation

### API Integration
- **Axios Client**: HTTP request handling
- **Service Layer**: API abstraction
- **Error Handling**: Centralized error management
- **Request Interceptors**: Token management

### Styling Architecture
- **Tailwind CSS v4**: Utility-first styling
- **Component Variants**: Reusable style patterns
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching support