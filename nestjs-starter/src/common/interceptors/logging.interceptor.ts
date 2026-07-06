import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { REQUEST_ID_HEADER } from '../constants/http.constants';

type RequestWithId = Request & { id?: string };

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const response = context.switchToHttp().getResponse<Response>();
    const start = Date.now();
    const requestId = request.id ?? crypto.randomUUID();

    response.setHeader(REQUEST_ID_HEADER, requestId);

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info({
            requestId,
            method: request.method,
            path: request.url,
            statusCode: response.statusCode,
            durationMs: Date.now() - start,
          });
        },
        error: (error: Error) => {
          this.logger.error({
            requestId,
            method: request.method,
            path: request.url,
            statusCode: response.statusCode,
            durationMs: Date.now() - start,
            error: error.message,
          });
        },
      }),
    );
  }
}
