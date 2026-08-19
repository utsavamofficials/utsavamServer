import { ActorType, Role } from '../constants/roles';

export interface AuthContext {
  id: string;
  actorType: ActorType;
  role?: Role;
  // Present only for EVENT_ORGANIZER / COLLECTION_EXECUTIVE actors — used by
  // authorization middleware to verify hierarchy ownership from the DB.
  seasonId?: string;
  eventId?: string;
  eventOrganizerId?: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export {};
