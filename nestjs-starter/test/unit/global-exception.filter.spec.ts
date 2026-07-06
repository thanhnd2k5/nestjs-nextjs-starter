import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { AppException } from '@/common/exceptions/app.exception';
import { EnvConfig } from '@/config/env.schema';

describe('GlobalExceptionFilter', () => {
  const logger = { setContext: jest.fn(), error: jest.fn() } as unknown as PinoLogger;

  function createFilter(nodeEnv: EnvConfig['NODE_ENV'] = 'test') {
    const env = { NODE_ENV: nodeEnv } as EnvConfig;
    return new GlobalExceptionFilter(logger, env);
  }

  it('maps AppException to standard error response', () => {
    const filter = createFilter();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: '/test' }),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(
      new AppException('NOT_FOUND', 'Not found', HttpStatus.NOT_FOUND, { id: '1' }),
      host,
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Not found',
        details: { id: '1' },
      },
    });
  });

  it('hides internal error details in production', () => {
    const filter = createFilter('production');
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: '/test' }),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(new Error('database connection leaked'), host);

    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  });
});
