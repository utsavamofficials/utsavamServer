import { seasonRepository } from '../repositories/season.repository';
import { ApiError } from '../utils/ApiError';
import { excludeSoftDeleted, ParsedPagination } from '../utils/queryBuilder';
import { ISeason } from '../models/season.model';

export interface CreateSeasonInput {
  seasonName: string;
  seasonCode: string;
  seasonDescription?: string;
  startDate: Date;
  endDate: Date;
}

export type UpdateSeasonInput = Partial<CreateSeasonInput>;

function assertValidDateRange(startDate: Date, endDate: Date): void {
  if (new Date(startDate) >= new Date(endDate)) {
    throw ApiError.badRequest('endDate must be after startDate');
  }
}

export const seasonService = {
  async create(input: CreateSeasonInput): Promise<ISeason> {
    assertValidDateRange(input.startDate, input.endDate);
    const existing = await seasonRepository.findBySeasonCode(input.seasonCode);
    if (existing) throw ApiError.conflict('seasonCode already in use');

    return seasonRepository.create({ ...input, seasonCode: input.seasonCode.toUpperCase() });
  },

  async list(pagination: ParsedPagination, filters: { search?: string }) {
    const filter: Record<string, unknown> = { ...excludeSoftDeleted<ISeason>() };
    if (filters.search) {
      filter.$or = [
        { seasonName: { $regex: filters.search, $options: 'i' } },
        { seasonCode: { $regex: filters.search, $options: 'i' } },
      ];
    }
    return seasonRepository.findMany(filter, pagination);
  },

  async getById(id: string): Promise<ISeason> {
    const season = await seasonRepository.findById(id);
    if (!season) throw ApiError.notFound('Season not found');
    return season;
  },

  async update(id: string, input: UpdateSeasonInput): Promise<ISeason> {
    const current = await this.getById(id);
    const startDate = input.startDate ?? current.startDate;
    const endDate = input.endDate ?? current.endDate;
    assertValidDateRange(startDate, endDate);

    if (input.seasonCode && input.seasonCode.toUpperCase() !== current.seasonCode) {
      const existing = await seasonRepository.findBySeasonCode(input.seasonCode);
      if (existing) throw ApiError.conflict('seasonCode already in use');
    }

    const updated = await seasonRepository.updateById(id, {
      ...input,
      seasonCode: input.seasonCode?.toUpperCase(),
    });
    if (!updated) throw ApiError.notFound('Season not found');
    return updated;
  },

  async setActive(id: string, isActive: boolean): Promise<ISeason> {
    const season = await seasonRepository.setActive(id, isActive);
    if (!season) throw ApiError.notFound('Season not found');
    return season;
  },

  async softDelete(id: string): Promise<void> {
    const season = await seasonRepository.softDeleteById(id);
    if (!season) throw ApiError.notFound('Season not found');
  },
};
