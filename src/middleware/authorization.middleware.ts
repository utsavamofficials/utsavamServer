import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { Role, ActorType } from '../constants/roles';

/**
 * requireRole: restricts an endpoint to specific SUPER_ADMIN/AFFILIATE roles.
 * Must run after requireAuth. Only applies to ActorType.USER principals —
 * Event Organizers / Collection Executives should use requireActorType and
 * the hierarchy guards below instead of a role check.
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw ApiError.unauthorized('Authentication required');
    }
    if (req.auth.actorType !== ActorType.USER || !req.auth.role || !allowedRoles.includes(req.auth.role)) {
      throw ApiError.forbidden('You do not have permission to perform this action');
    }
    next();
  };
}

/**
 * requireActorType: restricts an endpoint to specific principal types
 * (e.g. only Collection Executives may create donations).
 */
export function requireActorType(...allowedTypes: ActorType[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw ApiError.unauthorized('Authentication required');
    }
    if (!allowedTypes.includes(req.auth.actorType)) {
      throw ApiError.forbidden('You do not have permission to perform this action');
    }
    next();
  };
}

/**
 * requireOwnEvent: for EVENT_ORGANIZER / COLLECTION_EXECUTIVE principals,
 * ensures the eventId on the authenticated token matches the eventId being
 * acted on (from params or body). This is the first line of defense against
 * a caller supplying another event's ID — see requireVerifiedHierarchy in
 * each module's service layer for the full DB-backed check that also covers
 * SUPER_ADMIN/AFFILIATE-issued requests acting on behalf of a hierarchy.
 *
 * NOTE: this is a fast token-based check only. It intentionally does not
 * hit the database — services must still re-verify the full season → event
 * → organizer → executive chain against the DB before mutating data, since
 * token claims can go stale (e.g. an executive reassigned to another event
 * before their token expires).
 */
export function requireOwnEvent(eventIdSource: 'params' | 'body' = 'params') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw ApiError.unauthorized('Authentication required');
    }

    // SUPER_ADMIN / AFFILIATE users are not scoped to a single event.
    if (req.auth.actorType === ActorType.USER) {
      next();
      return;
    }

    const requestedEventId =
      eventIdSource === 'params' ? req.params.eventId : (req.body as { eventId?: string }).eventId;

    if (requestedEventId && req.auth.eventId && requestedEventId !== req.auth.eventId) {
      throw ApiError.forbidden('You do not have access to this event');
    }

    next();
  };
}
