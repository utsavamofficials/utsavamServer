import { ApiError } from '../utils/ApiError';
import { comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { userRepository } from '../repositories/user.repository';
import { eventOrganizerRepository } from '../repositories/eventOrganizer.repository';
import { collectionExecutiveRepository } from '../repositories/collectionExecutive.repository';
import { ActorType } from '../constants/roles';
import { JwtPayload, LoginResult } from '../types/auth.types';

async function loginAsUser(username: string, password: string): Promise<LoginResult | null> {
  const user = await userRepository.findByUsernameWithPassword(username);
  if (!user || !user.isActive) return null;

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return null;

  const payload: JwtPayload = { id: user._id.toString(), actorType: ActorType.USER, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    actor: { id: user._id.toString(), actorType: ActorType.USER, fullName: user.fullName, role: user.role },
  };
}

async function loginAsEventOrganizer(username: string, password: string): Promise<LoginResult | null> {
  const organizer = await eventOrganizerRepository.findByUsernameWithPassword(username);
  if (!organizer || !organizer.isActive) return null;

  const valid = await comparePassword(password, organizer.passwordHash);
  if (!valid) return null;

  const payload: JwtPayload = {
    id: organizer._id.toString(),
    actorType: ActorType.EVENT_ORGANIZER,
    seasonId: organizer.seasonId.toString(),
    eventId: organizer.eventId.toString(),
  };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    actor: { id: organizer._id.toString(), actorType: ActorType.EVENT_ORGANIZER, fullName: organizer.fullName },
  };
}

async function loginAsCollectionExecutive(username: string, password: string): Promise<LoginResult | null> {
  const executive = await collectionExecutiveRepository.findByUsernameWithPassword(username);
  if (!executive || !executive.isActive) return null;

  const valid = await comparePassword(password, executive.passwordHash);
  if (!valid) return null;

  const payload: JwtPayload = {
    id: executive._id.toString(),
    actorType: ActorType.COLLECTION_EXECUTIVE,
    seasonId: executive.seasonId.toString(),
    eventId: executive.eventId.toString(),
    eventOrganizerId: executive.eventOrganizerId.toString(),
  };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    actor: {
      id: executive._id.toString(),
      actorType: ActorType.COLLECTION_EXECUTIVE,
      fullName: executive.fullName,
    },
  };
}

export const authService = {
  /**
   * Tries each principal collection in turn since usernames are unique only
   * within their own collection, not globally across the three. First match
   * with a correct password wins.
   */
  async login(username: string, password: string): Promise<LoginResult> {
    const result =
      (await loginAsUser(username, password)) ||
      (await loginAsEventOrganizer(username, password)) ||
      (await loginAsCollectionExecutive(username, password));

    if (!result) {
      throw ApiError.unauthorized('Invalid username or password');
    }
    return result;
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
    // Re-verify the underlying account still exists and is active before reissuing.
    const { id, actorType, role, seasonId, eventId, eventOrganizerId } = payload;

    if (actorType === ActorType.USER) {
      const user = await userRepository.findById(id);
      if (!user || !user.isActive || user.isDeleted) throw ApiError.unauthorized('Account no longer active');
    } else if (actorType === ActorType.EVENT_ORGANIZER) {
      const org = await eventOrganizerRepository.findById(id);
      if (!org || !org.isActive || org.isDeleted) throw ApiError.unauthorized('Account no longer active');
    } else {
      const exec = await collectionExecutiveRepository.findById(id);
      if (!exec || !exec.isActive || exec.isDeleted) throw ApiError.unauthorized('Account no longer active');
    }

    return { accessToken: signAccessToken({ id, actorType, role, seasonId, eventId, eventOrganizerId }) };
  },
};
