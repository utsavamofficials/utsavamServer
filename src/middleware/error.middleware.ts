import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { isProduction } from '../config/env';
import { logger } from '../utils/logger';

interface MongoServerErrorLike extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let errors: string[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof MongooseError.ValidationError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  } else if (err instanceof MongooseError.CastError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = `Invalid value for field '${err.path}'`;
  } else if (isMongoDuplicateKeyError(err)) {
    statusCode = HttpStatus.CONFLICT;
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    message = `Duplicate value for '${field}'`;
  } else if (err instanceof TokenExpiredError) {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = 'Token expired';
  } else if (err instanceof JsonWebTokenError) {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err instanceof Error) {
    message = isProduction ? message : err.message;
  }

  const isOperational = err instanceof ApiError ? err.isOperational : false;
  logger.error(message, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    isOperational,
    stack: err instanceof Error && !isProduction ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

function isMongoDuplicateKeyError(err: unknown): err is MongoServerErrorLike {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as MongoServerErrorLike).code === 11000
  );
}
