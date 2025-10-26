# SpaceTechs React - Free Admin Dashboard Template

<div align="center">

![SpaceTechs React Dashboard](./banner.png)

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.8-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE.md)

**A modern, feature-rich admin dashboard template built with React 19, TypeScript, and Tailwind CSS v4**

[Live Demo](https://free-react-demo.spacetechs.com/) • [Documentation](https://spacetechs.com/docs) • [Pro Version](https://spacetechs.com/pricing)

</div>

## 🚀 Features

### ✨ Modern Tech Stack
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety and IntelliSense
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool and dev server

### 🎨 UI Components
- **400+ Components** - Pre-built dashboard components
- **Dark Mode** - Built-in theme switching
- **Responsive Design** - Mobile-first approach
- **ApexCharts** - Interactive data visualization
- **FullCalendar** - Advanced calendar integration

### 📊 Dashboard Features
- **Analytics Dashboard** - Real-time data visualization
- **Project Management** - Task tracking and organization
- **User Management** - Complete user profile system
- **Authentication** - JWT-based auth with protected routes
- **Blog System** - Content management capabilities

### 🛠 Developer Experience
- **Hot Module Replacement** - Instant development updates
- **ESLint & TypeScript** - Code quality and type checking
- **Component Library** - Reusable UI components
- **Custom Hooks** - Efficient state management

## 📦 Quick Start

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SpaceTechs/free-react-tailwind-admin-dashboard.git
   cd free-react-tailwind-admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── form/           # Form elements
│   └── ui/             # Base UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── layout/             # Layout components
├── pages/              # Page components
├── services/           # API services
├── store/              # State management
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url
VITE_APP_NAME=SpaceTechs
```

### Tailwind CSS
The project uses Tailwind CSS v4. Configuration is in `tailwind.config.js`.

### TypeScript
TypeScript configuration is split across:
- `tsconfig.json` - Main configuration
- `tsconfig.app.json` - App-specific settings
- `tsconfig.node.json` - Node environment

## 📱 Responsive Design

SpaceTechs is built with a mobile-first approach:
- **Mobile** - Optimized for phones and small tablets
- **Tablet** - Enhanced layout for medium screens
- **Desktop** - Full-featured dashboard experience

## 🎨 Customization

### Theme Configuration
Customize colors, fonts, and spacing in `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Component Styling
All components use Tailwind CSS classes and support dark mode out of the box.

## 🔐 Authentication

The template includes a complete authentication system:
- JWT token management
- Protected routes
- User profile management
- Password reset functionality

## 📊 Data Visualization

Integrated charting capabilities:
- **ApexCharts** - Line, bar, pie, and area charts
- **Interactive** - Hover effects and animations
- **Responsive** - Adapts to screen sizes
- **Customizable** - Easy theme integration

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Documentation**: [spacetechs.com/docs](https://spacetechs.com/docs)
- **Issues**: [GitHub Issues](https://github.com/SpaceTechs/free-react-tailwind-admin-dashboard/issues)
- **Community**: [Discord Server](https://discord.gg/spacetechs)

## 🚀 Pro Version

Upgrade to SpaceTechs Pro for additional features:

### Pro Features
- **5 Unique Dashboards** - Analytics, E-commerce, Marketing, CRM, Stocks
- **400+ Components** - Extended component library
- **Advanced Charts** - More visualization options
- **Premium Support** - Priority email support
- **Figma Files** - Complete design system

[Get Pro Version](https://spacetechs.com/pricing)

## 🔄 Changelog

### Version 2.0.2 - [March 25, 2025]
- ✅ Upgraded to React 19
- ✅ Fixed peer dependency issues
- ✅ Migrated to flatpickr for React 19 support

### Version 2.0.1 - [February 27, 2025]
- ✅ Upgraded to Tailwind CSS v4
- ✅ Improved performance and efficiency
- ✅ Updated class syntax

### Version 2.0.0 - [February 2025]
- ✅ Complete UI redesign
- ✅ New collapsible sidebar
- ✅ Enhanced navigation
- ✅ ApexCharts integration
- ✅ Calendar with drag-and-drop

[View Full Changelog](https://spacetechs.com/docs/update-logs/react)

## ⭐ Show Your Support

If you find this project helpful, please consider:
- Giving it a ⭐ on GitHub
- Sharing it with your network
- Contributing to the project

---

<div align="center">

**Built with ❤️ by the SpaceTechs Team**

[Website](https://spacetechs.com) • [Twitter](https://twitter.com/spacetechs) • [LinkedIn](https://linkedin.com/company/spacetechs)

</div>