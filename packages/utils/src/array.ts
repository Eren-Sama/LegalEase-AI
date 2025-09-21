// Array utility functions

/**
 * Remove duplicates from array
 */
export function uniqueArray<T>(array: T[]): T[] {
  return array.filter((item, index) => array.indexOf(item) === index);
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array randomly
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const item = shuffled[j];
    if (temp !== undefined && item !== undefined) {
      shuffled[i] = item;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 */
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Find item by key-value pair
 */
export function findBy<T>(array: T[], key: keyof T, value: any): T | undefined {
  return array.find(item => item[key] === value);
}

/**
 * Remove item from array
 */
export function removeItem<T>(array: T[], item: T): T[] {
  return array.filter(arrayItem => arrayItem !== item);
}

/**
 * Move item in array
 */
export function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const newArray = [...array];
  const item = newArray.splice(fromIndex, 1)[0];
  if (item !== undefined) {
    newArray.splice(toIndex, 0, item);
  }
  return newArray;
}

/**
 * Get intersection of two arrays
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => array2.indexOf(item) !== -1);
}

/**
 * Get difference of two arrays
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => array2.indexOf(item) === -1);
}

/**
 * Check if arrays are equal
 */
export function arraysEqual<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) return false;
  return array1.every((item, index) => item === array2[index]);
}

/**
 * Flatten nested arrays
 */
export function flattenArray<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random items from array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

/**
 * Paginate array
 */
export function paginateArray<T>(array: T[], page: number, limit: number): {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
} {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = array.slice(startIndex, endIndex);
  
  return {
    items,
    total: array.length,
    page,
    limit,
    hasMore: endIndex < array.length
  };
}