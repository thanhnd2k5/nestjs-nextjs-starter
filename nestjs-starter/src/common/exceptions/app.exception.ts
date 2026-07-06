import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes';

export class AppException extends HttpException {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    status: HttpStatus,
    public readonly details?: Record<string, unknown>,
  ) {
    super({ code, message, details }, status);
  }
}

export class NotFoundAppException extends AppException {
  constructor(message = 'Resource not found', details?: Record<string, unknown>) {
    super('NOT_FOUND', message, HttpStatus.NOT_FOUND, details);
  }
}

export class ConflictAppException extends AppException {
  constructor(message = 'Resource conflict', details?: Record<string, unknown>) {
    super('CONFLICT', message, HttpStatus.CONFLICT, details);
  }
}

export class UnauthorizedAppException extends AppException {
  constructor(message = 'Unauthorized', details?: Record<string, unknown>) {
    super('UNAUTHORIZED', message, HttpStatus.UNAUTHORIZED, details);
  }
}

export class InvalidCredentialsException extends AppException {
  constructor(message = 'Invalid credentials') {
    super('INVALID_CREDENTIALS', message, HttpStatus.UNAUTHORIZED);
  }
}
