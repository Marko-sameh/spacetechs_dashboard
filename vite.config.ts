import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
        // Optimize SVGs
        svgoConfig: {
          plugins: [
            'preset-default'
          ],
        },
      },
    }),
  ],

  // Performance optimizations
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router', 'axios', 'zustand']
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging
    sourcemap: false,
    // Enable aggressive minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 5,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        hoist_funs: true,
        hoist_vars: true,
        reduce_vars: true,
        reduce_funcs: true
      },
      mangle: {
        safari10: true,
        toplevel: true
      },
      format: {
        comments: false
      }
    },
    cssMinify: true,
  },

  // Extreme dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['react-apexcharts', '@fullcalendar/react', 'react-datepicker'],
    esbuildOptions: {
      target: 'es2022',
      treeShaking: true,
      minify: true,
      drop: ['console', 'debugger'],
      pure: ['console.log', 'console.warn', 'console.info'],
      ignoreAnnotations: true
    }
  },

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },

  // Development server optimizations
  server: {
    hmr: {
      overlay: false,
    },
    // Preconnect to external domains
    headers: {
      'Link': '<https://fonts.googleapis.com>; rel=preconnect, <https://fonts.gstatic.com>; rel=preconnect; crossorigin'
    }
  },

  define: {
    // Ensure environment variables are available
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'https://backend.spacetechs.net/api'),
    'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.API_KEY || 'my-super-secret-key-2025'),
  },
});