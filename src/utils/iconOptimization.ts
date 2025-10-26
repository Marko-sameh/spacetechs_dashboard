// Icon optimization utilities
export const createInlineIcon = (path: string, size = 20) => ({
  width: size,
  height: size,
  viewBox: `0 0 ${size} ${size}`,
  fill: 'currentColor',
  children: path
});
// Common icon paths for reuse
export const ICON_PATHS = {
  grid: 'M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z',
  user: 'M10 2C6.686 2 4 4.686 4 8c0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4 0-3.314-2.686-6-6-6zM6 14c-2.21 0-4 1.79-4 4v2h16v-2c0-2.21-1.79-4-4-4H6z',
  chevronDown: 'M6 8l4 4 4-4',
  plus: 'M10 4v12M4 10h12',
  trash: 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6'
};