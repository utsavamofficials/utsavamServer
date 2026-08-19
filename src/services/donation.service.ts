import { donationRepository } from '../repositories/donation.repository';
import { donorRepository } from '../repositories/donor.repository';
import { collectionExecutiveService } from './collectionExecutive.service';
import { ApiError } from '../utils/ApiError';
import { generateReferenceNumber } from '../utils/referenceGenerator';
import { excludeSoftDeleted, ParsedPagination } from '../utils/queryBuilder';
import { IDonation } from '../models/donation.model';
import { DonationPaymentMode, DonationStatus } from '../constants/enums';

export interface CreateDonationInput {
  donorId: string;
  seasonId: string;
  eventId: string;
  collectionExecutiveId: string;
  donationType?: string;
  donationAmount: number;
  paymentMode: DonationPaymentMode;
  donationDescription?: string;
  happyStatus?: boolean;
  paymentDetails?: Record<string, unknown>;
}

export interface DonationFilters {
  seasonId?: string;
  eventId?: string;
  collectionExecutiveId?: string;
  paymentMode?: DonationPaymentMode;
  donationStatus?: DonationStatus;
  startDate?: string;
  endDate?: string;
  receiptNumber?: string;
}

// Only these transitions are allowed — no arbitrary status jumps.
const ALLOWED_TRANSITIONS: Record<DonationStatus, DonationStatus[]> = {
  [DonationStatus.PENDING]: [DonationStatus.PROCESSING, DonationStatus.FAILED],
  [DonationStatus.PROCESSING]: [DonationStatus.COMPLETED, DonationStatus.FAILED],
  [DonationStatus.COMPLETED]: [DonationStatus.REFUNDED],
  [DonationStatus.FAILED]: [DonationStatus.PENDING],
  [DonationStatus.REFUNDED]: [],
};

export const donationService = {
  async create(input: CreateDonationInput): Promise<IDonation> {
    // Verify hierarchy: donor exists and executive genuinely owns this event.
    const donor = await donorRepository.findById(input.donorId);
    if (!donor || donor.eventId.toString() !== input.eventId) {
      throw ApiError.badRequest('Donor does not belong to the specified event');
    }
    await collectionExecutiveService.assertBelongsToEvent(input.collectionExecutiveId, input.eventId);

    const receiptNumber = await generateReferenceNumber('UTS');

    return donationRepository.create({
      ...input,
      receiptNumber,
      donationAmount: input.donationAmount as unknown as IDonation['donationAmount'],
      donationStatus: DonationStatus.PENDING,
    });
  },

  async list(pagination: ParsedPagination, filters: DonationFilters) {
    const filter: Record<string, unknown> = { ...excludeSoftDeleted<IDonation>() };
    if (filters.seasonId) filter.seasonId = filters.seasonId;
    if (filters.eventId) filter.eventId = filters.eventId;
    if (filters.collectionExecutiveId) filter.collectionExecutiveId = filters.collectionExecutiveId;
    if (filters.paymentMode) filter.paymentMode = filters.paymentMode;
    if (filters.donationStatus) filter.donationStatus = filters.donationStatus;
    if (filters.receiptNumber) filter.receiptNumber = filters.receiptNumber;
    if (filters.startDate || filters.endDate) {
      const range: Record<string, Date> = {};
      if (filters.startDate) range.$gte = new Date(filters.startDate);
      if (filters.endDate) range.$lte = new Date(filters.endDate);
      filter.createdAt = range;
    }
    return donationRepository.findMany(filter, pagination);
  },

  async getById(id: string): Promise<IDonation> {
    const donation = await donationRepository.findById(id);
    if (!donation) throw ApiError.notFound('Donation not found');
    return donation;
  },

  async getByReceiptNumber(receiptNumber: string): Promise<IDonation> {
    const donation = await donationRepository.findByReceiptNumber(receiptNumber);
    if (!donation) throw ApiError.notFound('Donation not found');
    return donation;
  },

  async update(
    id: string,
    input: Partial<Pick<CreateDonationInput, 'donationType' | 'donationDescription' | 'happyStatus' | 'paymentDetails'>>,
  ): Promise<IDonation> {
    const donation = await this.getById(id);
    if (donation.donationStatus === DonationStatus.COMPLETED || donation.donationStatus === DonationStatus.REFUNDED) {
      throw ApiError.badRequest('Cannot modify a completed or refunded donation');
    }
    const updated = await donationRepository.updateById(id, input);
    if (!updated) throw ApiError.notFound('Donation not found');
    return updated;
  },

  async updateStatus(id: string, nextStatus: DonationStatus): Promise<IDonation> {
    const donation = await this.getById(id);
    const allowed = ALLOWED_TRANSITIONS[donation.donationStatus];
    if (!allowed.includes(nextStatus)) {
      throw ApiError.badRequest(
        `Cannot transition donation from ${donation.donationStatus} to ${nextStatus}`,
      );
    }
    const updated = await donationRepository.updateById(id, { donationStatus: nextStatus });
    if (!updated) throw ApiError.notFound('Donation not found');
    return updated;
  },

  async getEventSummary(eventId: string) {
    return donationRepository.getEventSummary(eventId);
  },
};
