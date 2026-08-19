import { HttpStatus } from '../constants/httpStatus';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: string[];
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, errors: string[] = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', errors: string[] = []): ApiError {
    return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(HttpStatus.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(HttpStatus.FORBIDDEN, message);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  static conflict(message = 'Resource conflict', errors: string[] = []): ApiError {
    return new ApiError(HttpStatus.CONFLICT, message, errors);
  }

  static unprocessable(message = 'Unprocessable entity', errors: string[] = []): ApiError {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, [], false);
  }
}
