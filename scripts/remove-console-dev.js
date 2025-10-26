#!/usr/bin/env node

/**
 * Development script to remove console statements from source files
 * Run with: node scripts/remove-console-dev.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src');

function removeConsoleFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove console statements but preserve console.error
    content = content
      // Remove simple console statements
      .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\([^\n]*?\)\s*;?/g, '')
      // Remove console statements with template literals
      .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\(`[^`]*`\)\s*;?/g, '')
      // Remove multiline console statements (more careful)
      .replace(/console\.(log|info|debug|warn|trace|table|group|groupEnd|time|timeEnd|count|clear)\s*\([\s\S]*?\)\s*;?(?=\n|$)/g, '')
      // Clean up empty lines and orphaned braces
      .replace(/^\s*[\r\n]/gm, '')
      .replace(/^\s*}\s*\$\{[^}]*\}[^;]*;?$/gm, '');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned: ${path.relative(srcDir, filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  let filesProcessed = 0;
  
  function walkDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        if (removeConsoleFromFile(filePath)) {
          filesProcessed++;
        }
      }
    }
  }
  
  walkDir(dir);
  return filesProcessed;
}

console.log('🧹 Removing console statements from source files...');
const processed = processDirectory(srcDir);
console.log(`\n✨ Complete! Processed ${processed} files.`);