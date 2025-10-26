/**
 * Builds URL query parameters from an object, supporting nested filters and operators
 * @param params - Object containing query parameters
 * @returns Query string with proper encoding
 */
export function buildQueryParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Handle nested operators like price[gte]=100
      Object.entries(value).forEach(([operator, operatorValue]) => {
        if (operatorValue !== undefined && operatorValue !== null) {
          searchParams.append(`${key}[${operator}]`, String(operatorValue));
        }
      });
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach(item => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}