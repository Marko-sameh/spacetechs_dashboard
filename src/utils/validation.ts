/**
 * Unified validation utilities
 */
export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  password: (password: string): boolean => {
    return password.length >= 8;
  },
  required: (value: string | undefined | null): boolean => {
    return value !== undefined && value !== null && value.trim() !== '';
  },
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  fileSize: (file: File, maxSizeMB: number): boolean => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },
  fileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.some(type => file.type.startsWith(type));
  },
};