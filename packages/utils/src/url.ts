// URL utilities
export function buildUrl(base: string, params?: Record<string, any>): string {
  if (!params) return base;
  
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  
  return url.toString();
}

export function parseUrl(url: string): {
  protocol: string;
  host: string;
  pathname: string;
  search: string;
  hash: string;
} {
  const parsed = new URL(url);
  return {
    protocol: parsed.protocol,
    host: parsed.host,
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash
  };
}

export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}