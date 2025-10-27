// import type { Plugin } from 'vite';

// /**
//  * Vite plugin to remove console statements in production builds
//  */
// export function removeConsolePlugin(): Plugin {
//   return {
//     name: 'remove-console',
//     apply: 'build', // Only apply during build
//     transform(code: string, id: string) {
//       // Skip node_modules
//       if (id.includes('node_modules')) {
//         return null;
//       }

//       // Remove console statements but preserve console.error for critical errors
//       const transformedCode = code
//         .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\([^)]*\);?/g, '')
//         .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\([^)]*\)\s*;?/g, '')
//         // Remove multiline console statements
//         .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\(\s*[\s\S]*?\)\s*;?/g, '')
//         // Clean up empty lines left by removed console statements
//         .replace(/^\s*[\r\n]/gm, '');

//       return {
//         code: transformedCode,
//         map: null
//       };
//     }
//   };
// }



import type { Plugin } from 'vite';

/**
 * Vite plugin to remove console statements (except console.error) in production builds
 */
export function removeConsolePlugin(): Plugin {
  const consoleRegex =
    /console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\([\s\S]*?\)\s*;?/g;

  return {
    name: 'remove-console',
    apply: 'build', // Run only in build mode
    enforce: 'post', // Ensure it runs after other transforms
    transform(code: string, id: string) {
      // Skip dependencies
      if (id.includes('node_modules')) return null;

      // Skip JSON or assets
      if (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('.tsx') && !id.endsWith('.jsx')) {
        return null;
      }

      // Remove console statements (keep console.error)
      const transformedCode = code.replace(consoleRegex, '').replace(/^\s*[\r\n]/gm, '');

      return {
        code: transformedCode,
        map: null
      };
    }
  };
}
