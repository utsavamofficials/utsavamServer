import { collectionExecutiveRepository } from '../repositories/collectionExecutive.repository';
import { eventOrganizerService } from './eventOrganizer.service';
import { ApiError } from '../utils/ApiError';
import { hashPassword } from '../utils/password';
import { excludeSoftDeleted, ParsedPagination } from '../utils/queryBuilder';
import { ICollectionExecutive } from '../models/collectionExecutive.model';

export interface CreateCollectionExecutiveInput {
  seasonId: string;
  eventId: string;
  eventOrganizerId: string;
  fullName: string;
  username: string;
  password: string;
  email?: string;
  contactNumber: string;
  alternateContactNumber?: string;
  age?: number;
}

export type UpdateCollectionExecutiveInput = Partial<
  Omit<CreateCollectionExecutiveInput, 'seasonId' | 'eventId' | 'eventOrganizerId' | 'username' | 'password'>
>;

export const collectionExecutiveService = {
  async create(input: CreateCollectionExecutiveInput): Promise<ICollectionExecutive> {
    const organizer = await eventOrganizerService.getById(input.eventOrganizerId);

    const currentCount = await collectionExecutiveRepository.countByOrganizer(input.eventOrganizerId);
    if (currentCount >= organizer.collectionExecutiveLimit) {
      throw ApiError.forbidden(`Collection executive limit (${organizer.collectionExecutiveLimit}) reached, Contact to administrator for increasing limit.`);
    }

    const existing = await collectionExecutiveRepository.findByUsernameWithPassword(input.username);
    if (existing) throw ApiError.conflict('Username already in use');

    const passwordHash = await hashPassword(input.password);
    return collectionExecutiveRepository.create({
      ...input,
      username: input.username.toLowerCase(),
      passwordHash,
    });
  },

  async list(
    pagination: ParsedPagination,
    filters: { seasonId?: string; eventId?: string; eventOrganizerId?: string; search?: string },
  ) {
    const filter: Record<string, unknown> = { ...excludeSoftDeleted<ICollectionExecutive>() };
    if (filters.seasonId) filter.seasonId = filters.seasonId;
    if (filters.eventId) filter.eventId = filters.eventId;
    if (filters.eventOrganizerId) filter.eventOrganizerId = filters.eventOrganizerId;
    if (filters.search) {
      filter.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { username: { $regex: filters.search, $options: 'i' } },
      ];
    }
    return collectionExecutiveRepository.findMany(filter, pagination);
  },

  async getById(id: string): Promise<ICollectionExecutive> {
    const executive = await collectionExecutiveRepository.findById(id);
    if (!executive) throw ApiError.notFound('Collection executive not found');
    return executive;
  },

  async update(id: string, input: UpdateCollectionExecutiveInput): Promise<ICollectionExecutive> {
    const updated = await collectionExecutiveRepository.updateById(id, input);
    if (!updated) throw ApiError.notFound('Collection executive not found');
    return updated;
  },

  async setActive(id: string, isActive: boolean): Promise<ICollectionExecutive> {
    const executive = await collectionExecutiveRepository.setActive(id, isActive);
    if (!executive) throw ApiError.notFound('Collection executive not found');
    return executive;
  },

  async softDelete(id: string): Promise<void> {
    const executive = await collectionExecutiveRepository.softDeleteById(id);
    if (!executive) throw ApiError.notFound('Collection executive not found');
  },

  /** Used by donor/donation services to verify the executive truly owns this event. */
  async assertBelongsToEvent(executiveId: string, eventId: string): Promise<ICollectionExecutive> {
    const executive = await collectionExecutiveRepository.findOne({
      _id: executiveId,
      eventId,
      isDeleted: false,
    });
    if (!executive) throw ApiError.badRequest('Collection executive does not belong to the specified event');
    return executive;
  },
};
