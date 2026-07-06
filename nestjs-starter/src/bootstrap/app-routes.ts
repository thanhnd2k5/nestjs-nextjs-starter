/** Routes excluded from API_PREFIX — always served at root */
export const ROUTES_EXCLUDED_FROM_PREFIX = ['health', 'docs'] as const;

export function isHealthPath(url: string): boolean {
  const path = url.split('?')[0];
  return path === '/health' || path.startsWith('/health/');
}
