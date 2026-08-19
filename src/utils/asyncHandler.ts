import { NextFunction, Request, Response } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

/**
 * Wraps an async Express handler so any rejected promise is forwarded to
 * next(err) instead of causing an unhandled rejection. Express 5 auto-catches
 * async handler errors, but this keeps the pattern explicit and consistent
 * for controllers/middleware and avoids relying on that implicit behavior.
 */
export function asyncHandler(fn: AsyncRequestHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
