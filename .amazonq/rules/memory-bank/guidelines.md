# SpaceTechs React - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict typing**: All components use explicit TypeScript interfaces
- **Interface definitions**: Define interfaces for props, state, and API responses
- **Type safety**: Use union types for status values (`'Ongoing' | 'Paused' | 'Completed'`)
- **Optional properties**: Mark optional fields with `?` in interfaces
- **Generic types**: Use generics for reusable components and utilities

### Component Architecture
- **Functional components**: Use React.FC with explicit prop typing
- **Props interface**: Define interface above component for all props
- **Default exports**: Export components as default, contexts as named exports
- **Component naming**: Use PascalCase for component names and files

### Import Organization
```typescript
// External libraries first
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';

// Internal imports by category
import { AuthService } from '../services/authService';
import { User, LoginCredentials } from '../types/models';
import { useSidebar } from '../context/SidebarContext';
```

### Error Handling Patterns
- **Try-catch blocks**: Wrap async operations in try-catch
- **Error logging**: Use `console.error()` for error logging
- **Graceful degradation**: Handle errors without breaking UI
- **Loading states**: Manage loading states during async operations

## React Patterns & Best Practices

### State Management
- **useState**: Local component state with proper typing
- **useEffect**: Dependency arrays and cleanup functions
- **useCallback**: Memoize event handlers and functions
- **Context providers**: Centralized state with proper typing

### Event Handlers
```typescript
// Inline useCallback for form inputs
onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({ ...prev, title: e.target.value }));
}, [])}

// Separate handler functions for complex logic
const handleSubmit = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form submission
}, [formData, project, editProject, addProject, onSuccess]);
```

### Form Handling
- **Controlled components**: All form inputs are controlled
- **Form validation**: Client-side validation with required attributes
- **Data transformation**: Transform data before API submission
- **File handling**: Proper file validation and base64 conversion

### Conditional Rendering
```typescript
// Ternary operators for simple conditions
{isExpanded || isHovered || isMobileOpen ? (
  <span className="menu-item-text">{nav.name}</span>
) : null}

// Logical AND for existence checks
{formData.images && (
  <div className="mt-2 flex flex-wrap gap-2">
    {/* Image previews */}
  </div>
)}
```

## Styling Conventions

### Tailwind CSS Patterns
- **Responsive design**: Use `md:`, `lg:` prefixes for breakpoints
- **Dark mode**: Include `dark:` variants for all styled elements
- **Component variants**: Create reusable class combinations
- **Conditional classes**: Use template literals for dynamic styling

### Class Organization
```typescript
className={`menu-item group ${
  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
} ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
```

### Color System
- **Semantic colors**: Use color-coded badges for different states
- **Consistent palette**: Maintain consistent color usage across components
- **Accessibility**: Ensure proper contrast ratios

## API Integration Patterns

### Service Layer Architecture
- **Dedicated services**: Separate service files for each domain
- **Consistent methods**: CRUD operations follow same pattern
- **Error handling**: Centralized error handling in services
- **Type safety**: Typed request/response interfaces

### HTTP Client Usage
```typescript
// Axios configuration with interceptors
// Consistent error handling across all requests
// Request/response transformation
```

### Data Fetching
- **Custom hooks**: Use custom hooks for data operations
- **Loading states**: Manage loading states consistently
- **Error states**: Handle and display errors appropriately
- **Caching**: Implement appropriate caching strategies

## Testing & Quality Assurance

### API Testing
- **Integration tests**: Comprehensive API endpoint testing
- **Test suites**: Organized test classes with proper structure
- **Result tracking**: Detailed test result logging and reporting
- **Error scenarios**: Test both success and failure cases

### Code Documentation
- **JSDoc comments**: Document complex functions and classes
- **Interface documentation**: Clear interface descriptions
- **API documentation**: Comprehensive endpoint documentation
- **Code examples**: Provide usage examples in documentation

## Performance Optimization

### React Optimization
- **useCallback**: Memoize event handlers and functions
- **Conditional rendering**: Optimize rendering with proper conditions
- **Component splitting**: Break large components into smaller ones
- **Lazy loading**: Implement lazy loading for heavy components

### File Handling
- **File validation**: Validate file types and sizes
- **Size limits**: Enforce reasonable file size limits
- **Error handling**: Graceful handling of file processing errors
- **Preview generation**: Efficient image/video preview generation

## Security Best Practices

### Authentication
- **Token management**: Secure token storage and cleanup
- **Route protection**: Implement protected routes
- **Session handling**: Proper session initialization and cleanup
- **Data validation**: Validate all user inputs

### Data Handling
- **Input sanitization**: Sanitize user inputs
- **File validation**: Strict file type and size validation
- **Error messages**: Avoid exposing sensitive information in errors
- **Local storage**: Secure handling of localStorage data

## Development Workflow

### Code Organization
- **Feature-based structure**: Organize code by features/domains
- **Consistent naming**: Use consistent naming conventions
- **Import paths**: Use relative imports appropriately
- **File structure**: Maintain clean and logical file structure

### Git Practices
- **Commit messages**: Clear and descriptive commit messages
- **Branch naming**: Consistent branch naming conventions
- **Code reviews**: Thorough code review process
- **Testing**: Test changes before committing