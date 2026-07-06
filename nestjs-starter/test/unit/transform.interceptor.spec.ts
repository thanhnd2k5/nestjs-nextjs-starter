import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

describe('TransformInterceptor', () => {
  const interceptor = new TransformInterceptor();

  const mockContext = (url: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ url }),
      }),
    }) as ExecutionContext;

  it('wraps plain data in success response', (done) => {
    const next: CallHandler = { handle: () => of({ hello: 'world' }) };

    interceptor.intercept(mockContext('/api'), next).subscribe((result) => {
      expect(result).toEqual({
        success: true,
        data: { hello: 'world' },
      });
      done();
    });
  });

  it('preserves paginated payload meta', (done) => {
    const payload = {
      items: [{ id: 1 }],
      meta: { total: 1, page: 1, pageSize: 20, totalPages: 1 },
    };
    const next: CallHandler = { handle: () => of(payload) };

    interceptor.intercept(mockContext('/words'), next).subscribe((result) => {
      expect(result).toEqual({
        success: true,
        data: payload.items,
        meta: payload.meta,
      });
      done();
    });
  });

  it('skips transform for health endpoint', (done) => {
    const health = { status: 'ok' };
    const next: CallHandler = { handle: () => of(health) };

    interceptor.intercept(mockContext('/health'), next).subscribe((result) => {
      expect(result).toEqual(health);
      done();
    });
  });
});
