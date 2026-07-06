import { isHealthPath } from '@/bootstrap/app-routes';

describe('app-routes', () => {
  it('detects health paths with or without query string', () => {
    expect(isHealthPath('/health')).toBe(true);
    expect(isHealthPath('/health?verbose=1')).toBe(true);
    expect(isHealthPath('/health/live')).toBe(true);
    expect(isHealthPath('/api/users')).toBe(false);
  });
});
