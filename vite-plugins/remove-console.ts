import type { Plugin } from 'vite';

/**
 * Vite plugin to remove console statements in production builds
 */
export function removeConsolePlugin(): Plugin {
  return {
    name: 'remove-console',
    apply: 'build', // Only apply during build
    transform(code: string, id: string) {
      // Skip node_modules
      if (id.includes('node_modules')) {
        return null;
      }

      // Remove console statements but preserve console.error for critical errors
      const transformedCode = code
        .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\([^)]*\);?/g, '')
        .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\([^)]*\)\s*;?/g, '')
        // Remove multiline console statements
        .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\(\s*[\s\S]*?\)\s*;?/g, '')
        // Clean up empty lines left by removed console statements
        .replace(/^\s*[\r\n]/gm, '');

      return {
        code: transformedCode,
        map: null
      };
    }
  };
}