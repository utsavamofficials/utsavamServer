import { eventOrganizerRepository } from '../repositories/eventOrganizer.repository';
import { eventService } from './event.service';
import { ApiError } from '../utils/ApiError';
import { hashPassword } from '../utils/password';
import { excludeSoftDeleted, ParsedPagination } from '../utils/queryBuilder';
import { IEventOrganizer } from '../models/eventOrganizer.model';
import { Gender } from '../constants/roles';
import { eventRepository } from '../repositories/event.repository';

export interface CreateEventOrganizerInput {
  seasonId: string;
  fullName: string;
  username: string;
  password: string;
  email?: string;
  contactNumber: string;
  alternateContactNumber?: string;
  age?: number;
  gender?: Gender;
  permanentAddress?: string;
  currentAddress?: string;
}

export type UpdateEventOrganizerInput = Partial<
  Omit<CreateEventOrganizerInput, 'seasonId' | 'username' | 'password'>
>;

export const eventOrganizerService = {
  async create(input: CreateEventOrganizerInput): Promise<IEventOrganizer> {
    // Verify the hierarchy: the event must actually belong to the given season.
    await eventService.assertBelongsToSeason(input.seasonId);

    const existing = await eventOrganizerRepository.findByUsernameWithPassword(input.username);
    if (existing) throw ApiError.conflict('Username already in use');

    const passwordHash = await hashPassword(input.password);
    return eventOrganizerRepository.create({
      ...input,
      username: input.username.toLowerCase(),
      passwordHash,
    });
  },

  async list(pagination: ParsedPagination, filters: { seasonId?: string; search?: string }) {
    const filter: Record<string, unknown> = { ...excludeSoftDeleted<IEventOrganizer>() };
    if (filters.seasonId) filter.seasonId = filters.seasonId;
    if (filters.search) {
      filter.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { username: { $regex: filters.search, $options: 'i' } },
      ];
    }
    return eventOrganizerRepository.findMany(filter, pagination);
  },

  async getById(id: string): Promise<IEventOrganizer> {
    const organizer = await eventOrganizerRepository.findById(id);
    if (!organizer) throw ApiError.notFound('Event organizer not found');
    return organizer;
  },

  async update(id: string, input: UpdateEventOrganizerInput): Promise<IEventOrganizer> {
    const updated = await eventOrganizerRepository.updateById(id, input);
    if (!updated) throw ApiError.notFound('Event organizer not found');
    return updated;
  },

  async setActive(id: string, isActive: boolean): Promise<IEventOrganizer> {
    const organizer = await eventOrganizerRepository.setActive(id, isActive);
    if (!organizer) throw ApiError.notFound('Event organizer not found');
    return organizer;
  },

  async softDelete(id: string): Promise<void> {
    const organizer = await eventOrganizerRepository.softDeleteById(id);
    if (!organizer) throw ApiError.notFound('Event organizer not found');
  },

  /** Used by collectionExecutive.service to verify the organizer truly owns this event/season. */
  async assertBelongsToEvent(organizerId: string, seasonId: string): Promise<IEventOrganizer> {
    const organizer = await eventOrganizerRepository.findByIdWithinEvent(organizerId, seasonId);
    if (!organizer) throw ApiError.badRequest('Event organizer does not belong to the specified event/season');
    return organizer;
  },

  async assertOwnsEvent(organizerId: string, eventId: string): Promise<IEventOrganizer> {
    const organizer = await this.getById(organizerId);
    const event = await eventRepository.findById(eventId);
    if (!event || event.eventOrganizerId.toString() !== organizerId) {
      throw ApiError.badRequest('Event does not belong to this organizer');
    }
    return organizer;
  }
};
