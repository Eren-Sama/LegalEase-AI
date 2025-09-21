// Storage utilities
export function setItem(key: string, value: any): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export function getItem<T>(key: string): T | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
  }
  return null;
}

export function removeItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
}

export function clearStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}