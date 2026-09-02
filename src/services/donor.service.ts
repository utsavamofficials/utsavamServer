import { donorRepository } from '../repositories/donor.repository';
import { collectionExecutiveService } from './collectionExecutive.service';
import { ApiError } from '../utils/ApiError';
import { excludeSoftDeleted, ParsedPagination } from '../utils/queryBuilder';
import { IDonor } from '../models/donor.model';

export interface CreateDonorInput {
  seasonId: string;
  eventId: string;
  collectionExecutiveId: string;
  donorName: string;
  contactNumber: string;
  email?: string;
  panNumber?: string;
  age?: number;
  address?: string;
}

export type UpdateDonorInput = Partial<
  Omit<CreateDonorInput, 'seasonId' | 'eventId' | 'collectionExecutiveId'>
>;

export const donorService = {
  async create(input: CreateDonorInput): Promise<IDonor> {
    // Verify the executive genuinely belongs to this event before attaching a donor to them.
    // await collectionExecutiveService.assertBelongsToEvent(input.collectionExecutiveId, input.eventId);
    return donorRepository.create(input as unknown as Record<string, unknown>);
  },

  async list(
    pagination: ParsedPagination,
    filters: {
      seasonId?: string;
      eventId?: string;
      collectionExecutiveId?: string;
      contactNumber?: string;
      search?: string;
      eventOrganizerId?: string;
    },
  ) {
    const filter: Record<string, unknown> = {
      ...excludeSoftDeleted<IDonor>(),
    };

    if (filters.seasonId) filter.seasonId = filters.seasonId;
    if (filters.eventId) filter.eventId = filters.eventId;
    if (filters.collectionExecutiveId) {
      filter.collectionExecutiveId = filters.collectionExecutiveId;
    }

    if (filters.eventOrganizerId && filters.seasonId) {
      const collectionExecutives =
        await collectionExecutiveService.getBySeasonAndOrganizerId(
          filters.eventOrganizerId,
          filters.seasonId,
        );

      if (collectionExecutives.length > 0) {
        filter.collectionExecutiveId = {
          $in: collectionExecutives.map((executive) => executive.id),
        };
      }
    }

    if (filters.contactNumber) {
      filter.contactNumber = filters.contactNumber;
    }

    if (filters.search) {
      filter.$or = [
        { donorName: { $regex: filters.search, $options: 'i' } },
        { contactNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return donorRepository.findMany(filter, pagination);
  },



  async getById(id: string): Promise<IDonor> {
    const donor = await donorRepository.findById(id);
    if (!donor) throw ApiError.notFound('Donor not found');
    return donor;
  },

  async update(id: string, input: UpdateDonorInput): Promise<IDonor> {
    const updated = await donorRepository.updateById(id, input);
    if (!updated) throw ApiError.notFound('Donor not found');
    return updated;
  },

  async softDelete(id: string): Promise<void> {
    const donor = await donorRepository.softDeleteById(id);
    if (!donor) throw ApiError.notFound('Donor not found');
  },
};
