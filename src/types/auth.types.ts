import { ActorType, Role } from '../constants/roles';
import { Types } from 'mongoose';

/**
 * Shape of the JWT payload. Deliberately minimal — never place password
 * hashes, secrets, or full documents in here.
 */
export interface JwtPayload {
  id: string;
  actorType: ActorType;
  role?: Role;
  seasonId?: string;
  eventId?: string;
  eventOrganizerId?: string;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  actor: {
    id: string;
    actorType: ActorType;
    fullName: string;
    role?: Role;
    seasonId?: Types.ObjectId;
    eventId?: Types.ObjectId;
    eventOrganizerId?: Types.ObjectId;
  };
}
