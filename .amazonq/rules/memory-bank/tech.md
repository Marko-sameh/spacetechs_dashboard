# SpaceTechs React - Technology Stack

## Core Technologies

### Frontend Framework
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5.7.2** - Static type checking
- **React DOM 19.0.0** - DOM rendering
- **React Router 7.1.5** - Client-side routing

### Build System & Development
- **Vite 6.1.0** - Fast build tool and dev server
- **@vitejs/plugin-react 4.3.4** - React support for Vite
- **vite-plugin-svgr 4.3.0** - SVG as React components

### Styling & UI
- **Tailwind CSS 4.0.8** - Utility-first CSS framework
- **@tailwindcss/postcss 4.0.8** - PostCSS integration
- **PostCSS 8.5.2** - CSS processing
- **tailwind-merge 3.0.1** - Conditional class merging
- **clsx 2.1.1** - Conditional class names

### State Management
- **Zustand 5.0.8** - Lightweight state management
- **@tanstack/react-query 5.90.2** - Server state management
- **React Context** - Built-in state management

### Data Visualization
- **ApexCharts 4.1.0** - Modern charting library
- **react-apexcharts 1.7.0** - React wrapper for ApexCharts
- **@react-jvectormap/core 1.0.4** - Vector maps
- **@react-jvectormap/world 1.1.2** - World map data

### Calendar & Date Handling
- **@fullcalendar/react 6.1.15** - Calendar component
- **@fullcalendar/core 6.1.15** - Core calendar functionality
- **@fullcalendar/daygrid 6.1.15** - Day grid view
- **@fullcalendar/timegrid 6.1.15** - Time grid view
- **@fullcalendar/interaction 6.1.15** - User interactions
- **@fullcalendar/list 6.1.15** - List view
- **flatpickr 4.6.13** - Date picker
- **react-datepicker 8.7.0** - React date picker

### UI Components & Interactions
- **react-dnd 16.0.1** - Drag and drop
- **react-dnd-html5-backend 16.0.1** - HTML5 drag backend
- **react-dropzone 14.3.5** - File upload dropzone
- **swiper 11.2.3** - Touch slider

### HTTP & API
- **axios 1.12.2** - HTTP client
- **react-helmet-async 2.0.5** - Document head management

### Code Quality & Linting
- **ESLint 9.19.0** - JavaScript/TypeScript linting
- **@eslint/js 9.19.0** - ESLint JavaScript rules
- **typescript-eslint 8.22.0** - TypeScript ESLint rules
- **eslint-plugin-react-hooks 5.0.0** - React hooks linting
- **eslint-plugin-react-refresh 0.4.18** - React refresh linting
- **globals 15.14.0** - Global variables for ESLint

### Type Definitions
- **@types/react 19.0.12** - React type definitions
- **@types/react-dom 19.0.4** - React DOM types
- **@types/react-datepicker 6.2.0** - Date picker types

## Development Commands

### Primary Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Development Workflow
1. **Development**: `npm run dev` starts Vite dev server with HMR
2. **Type Checking**: TypeScript compilation with `tsc -b`
3. **Linting**: ESLint with React-specific rules
4. **Building**: Vite production build with optimization

## Configuration Files

### TypeScript Configuration
- `tsconfig.json` - Main TypeScript config
- `tsconfig.app.json` - Application-specific config
- `tsconfig.node.json` - Node.js environment config

### Build Configuration
- `vite.config.ts` - Main Vite configuration
- `vite.config.proxy.ts` - Proxy configuration for API

### Styling Configuration
- `postcss.config.js` - PostCSS with Tailwind
- Tailwind CSS v4 with modern features

### Code Quality
- `eslint.config.js` - ESLint configuration with TypeScript support

## Environment Requirements

### Node.js
- **Minimum**: Node.js 18.x
- **Recommended**: Node.js 20.x or later

### Package Management
- **npm** - Default package manager
- **yarn** - Alternative package manager support
- **Legacy peer deps**: Use `--legacy-peer-deps` if needed

## Browser Support
- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Features
- **Hot Module Replacement (HMR)** - Instant updates during development
- **TypeScript Support** - Full type checking and IntelliSense
- **SVG as Components** - Import SVGs as React components
- **Path Aliases** - Simplified import paths
- **Environment Variables** - `.env` file support