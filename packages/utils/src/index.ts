// Export utility functions from working modules
export * from './date';
export * from './validation';
export * from './formatting';
export * from './crypto';
export * from './file';
export * from './url';
export * from './object';

// Export with renamed functions to avoid conflicts
export { 
  getItem as getStorageItem, 
  setItem as setStorageItem, 
  removeItem as removeStorageItem, 
  clearStorage
} from './storage';

export {
  chunkArray as chunk,
  uniqueArray as unique,
  intersection,
  difference,
  removeItem as removeArrayItem,
  groupBy,
  sortBy,
  flattenArray as flatten
} from './array';

export {
  capitalize,
  truncate,
  countWords as countStringWords
} from './string';

export {
  formatCurrency as formatNumberCurrency,
  formatPercentage as formatNumberPercentage,
  formatFileSize as formatNumberFileSize,
  clamp,
  isEven,
  isOdd
} from './number';