import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { isHealthPath } from '@/bootstrap/app-routes';

export interface PaginatedPayload<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    if (isHealthPath(request.url)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
          const paginated = data as PaginatedPayload<unknown>;
          return {
            success: true,
            data: paginated.items,
            meta: paginated.meta,
          };
        }

        return {
          success: true,
          data: data ?? null,
        };
      }),
    );
  }
}
