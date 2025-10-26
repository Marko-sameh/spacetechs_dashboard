/**
 * Unified formatting utilities
 */
export const format = {
  date: (date: string | Date): string => {
    return new Date(date).toLocaleDateString();
  },

  dateTime: (date: string | Date): string => {
    return new Date(date).toLocaleString();
  },

  currency: (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  number: (num: number): string => {
    return new Intl.NumberFormat().format(num);
  },

  truncate: (text: string, length: number): string => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  },

  slug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  },
};