import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyAccessToken } from '../utils/jwt';

/**
 * requireAuth: verifies the bearer JWT and attaches req.auth.
 * Does NOT check role or hierarchy — see authorization.middleware.ts for that.
 */
export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Missing or invalid Authorization header');
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);
    const auth: import('../types/express').AuthContext = {
      id: payload.id,
      actorType: payload.actorType,
    };
    if (payload.role !== undefined) auth.role = payload.role;
    if (payload.seasonId !== undefined) auth.seasonId = payload.seasonId;
    if (payload.eventId !== undefined) auth.eventId = payload.eventId;
    if (payload.eventOrganizerId !== undefined) auth.eventOrganizerId = payload.eventOrganizerId;

    req.auth = auth;
    next();
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }
});
