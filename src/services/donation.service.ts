import { donationRepository } from "../repositories/donation.repository";
import { donorRepository } from "../repositories/donor.repository";
import { collectionExecutiveService } from "./collectionExecutive.service";
import { ApiError } from "../utils/ApiError";
import { generateReferenceNumber } from "../utils/referenceGenerator";
import { excludeSoftDeleted, ParsedPagination } from "../utils/queryBuilder";
import { IDonation } from "../models/donation.model";
import { DonationPaymentMode, DonationStatus } from "../constants/enums";
import { eventRepository } from "../repositories/event.repository";
import { eventOrganizerRepository } from "../repositories/eventOrganizer.repository";
import { IDonor } from "../models/donor.model";

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

export interface DonationFilterForEM {
  seasonId?: string;
  eventId?: string;
  collectionExecutiveId?: string;
}

// Only these transitions are allowed — no arbitrary status jumps.
const ALLOWED_TRANSITIONS: Record<DonationStatus, DonationStatus[]> = {
  [DonationStatus.PENDING]: [
    DonationStatus.PROCESSING,
    DonationStatus.FAILED,
    DonationStatus.COMPLETED,
    DonationStatus.REFUNDED,
  ],
  [DonationStatus.PROCESSING]: [
    DonationStatus.COMPLETED,
    DonationStatus.FAILED,
  ],
  [DonationStatus.COMPLETED]: [DonationStatus.REFUNDED],
  [DonationStatus.FAILED]: [DonationStatus.PENDING],
  [DonationStatus.REFUNDED]: [],
};

export const donationService = {
  async create(input: CreateDonationInput): Promise<IDonation> {
    // Verify hierarchy: donor exists and executive genuinely owns this event.
    const donor = await donorRepository.findById(input.donorId);
    if (!donor || donor.eventId.toString() !== input.eventId) {
      throw ApiError.badRequest("Donor does not belong to the specified event");
    }
    await collectionExecutiveService.assertBelongsToEvent(
      input.collectionExecutiveId,
      input.eventId,
    );

    const receiptNumber = await generateReferenceNumber("UTS");

    return donationRepository.create({
      ...input,
      receiptNumber,
      donationAmount:
        input.donationAmount as unknown as IDonation["donationAmount"],
      donationStatus: DonationStatus.PENDING,
    });
  },

  // async list(pagination: ParsedPagination, filters: DonationFilters) {
  //   const filter: Record<string, unknown> = { ...excludeSoftDeleted<IDonation>() };
  //   if (filters.seasonId) filter.seasonId = filters.seasonId;
  //   if (filters.eventId) filter.eventId = filters.eventId;
  //   if (filters.collectionExecutiveId) filter.collectionExecutiveId = filters.collectionExecutiveId;
  //   if (filters.paymentMode) filter.paymentMode = filters.paymentMode;
  //   if (filters.donationStatus) filter.donationStatus = filters.donationStatus;
  //   if (filters.receiptNumber) filter.receiptNumber = filters.receiptNumber;
  //   if (filters.startDate || filters.endDate) {
  //     const range: Record<string, Date> = {};
  //     if (filters.startDate) range.$gte = new Date(filters.startDate);
  //     if (filters.endDate) range.$lte = new Date(filters.endDate);
  //     filter.createdAt = range;
  //   }
  //   return donationRepository.findMany(filter, pagination);
  // },

  async getById(id: string): Promise<IDonation> {
    const donation = await donationRepository.findById(id);
    if (!donation) throw ApiError.notFound("Donation not found");
    return donation;
  },

  async getByReceiptNumber(receiptNumber: string): Promise<any> {
    const donation =
      await donationRepository.findByReceiptNumber(receiptNumber);
    if (!donation) {
      throw ApiError.notFound("Donation not found");
    }
    const donationAmount = donation?.donationAmount
      ? Number(donation?.donationAmount.toString())
      : 0;

    const donor = donation.donorId
      ? await donorRepository.findById(donation.donorId.toString())
      : null;
    const event = donation.eventId
      ? await eventRepository.findById(donation.eventId.toString())
      : null;

    const eventOrganizer = event?.id
      ? await eventOrganizerRepository.findOne({
          eventId: event?.id.toString(),
        })
      : null;

    return {
      donation,
      event,
      donorName: donor?.donorName || null,
      donorMail: donor?.email || null,
      eventName: event?.eventName || null,
      organizingMandalName: event?.organizingMandalName || null,
      eventOrganizer,
      donationAmount,
    };
  },

  async update(
    id: string,
    input: Partial<
      Pick<
        CreateDonationInput,
        | "donationType"
        | "donationDescription"
        | "happyStatus"
        | "paymentDetails"
      >
    >,
  ): Promise<IDonation> {
    const donation = await this.getById(id);
    if (
      donation.donationStatus === DonationStatus.COMPLETED ||
      donation.donationStatus === DonationStatus.REFUNDED
    ) {
      throw ApiError.badRequest(
        "Cannot modify a completed or refunded donation",
      );
    }
    const updated = await donationRepository.updateById(id, input);
    if (!updated) throw ApiError.notFound("Donation not found");
    return updated;
  },

  async updateStatus(
    id: string,
    nextStatus: DonationStatus,
  ): Promise<IDonation> {
    const donation = await this.getById(id);
    const allowed = ALLOWED_TRANSITIONS[donation.donationStatus];
    if (!allowed.includes(nextStatus)) {
      throw ApiError.badRequest(
        `Cannot transition donation from ${donation.donationStatus} to ${nextStatus}`,
      );
    }
    const updated = await donationRepository.updateById(id, {
      donationStatus: nextStatus,
    });
    if (!updated) throw ApiError.notFound("Donation not found");
    return updated;
  },

  async getEventSummary(eventId: string) {
    return donationRepository.getEventSummary(eventId);
  },

  async list(pagination: ParsedPagination, filters: DonationFilters) {
    const filter: Record<string, unknown> = {
      ...excludeSoftDeleted<IDonation>(),
    };

    // Filter by Season
    if (filters.seasonId) {
      filter.seasonId = filters.seasonId;
    }

    // Filter by Event
    if (filters.eventId) {
      filter.eventId = filters.eventId;
    }

    // Filter by Collection Executive
    if (filters.collectionExecutiveId) {
      filter.collectionExecutiveId = filters.collectionExecutiveId;
    }

    // Filter by Payment Mode
    if (filters.paymentMode) {
      filter.paymentMode = filters.paymentMode;
    }

    // Filter by Donation Status
    if (filters.donationStatus) {
      filter.donationStatus = filters.donationStatus;
    }

    // Filter by Receipt Number
    if (filters.receiptNumber) {
      filter.receiptNumber = filters.receiptNumber;
    }

    // Filter by Created Date
    if (filters.startDate || filters.endDate) {
      const range: Record<string, Date> = {};

      if (filters.startDate) {
        range.$gte = new Date(`${filters.startDate}T00:00:00.000Z`);
      }

      if (filters.endDate) {
        range.$lte = new Date(`${filters.endDate}T23:59:59.999Z`);
      }

      filter.createdAt = range;
    }

    return donationRepository.findMany(filter, pagination);
  },

  async filter(pagination: ParsedPagination, filters: DonationFilterForEM) {
    const filter: Record<string, unknown> = {
      ...excludeSoftDeleted<IDonation>(),
    };

    // Filter by Season
    if (filters.seasonId) {
      filter.seasonId = filters.seasonId;
    }

    // Filter by Event
    if (filters.eventId) {
      filter.eventId = filters.eventId;
    }

    // Filter by Collection Executive
    if (filters.collectionExecutiveId) {
      filter.collectionExecutiveId = filters.collectionExecutiveId;
    }

    // Get donations
    const { records, meta } = await donationRepository.findMany(
      filter,
      pagination,
    );

    // Enrich each donation with donor information
    const enrichedRecords = await Promise.all(
      records.map(async (donation) => {
        const donor = donation.donorId
          ? await donorRepository.findById(donation.donorId.toString())
          : null;

        return {
          donation,
          donorName: donor?.donorName ?? null,
          donorContactNumber: donor?.contactNumber ?? null,
          donorEmail: donor?.email ?? null,
          donationAmount: donation.donationAmount
            ? Number(donation.donationAmount.toString())
            : 0,
        };
      }),
    );

    return {
      records: enrichedRecords,
      meta,
    };
  },

  async donorWithDonation(
    pagination: ParsedPagination,
    filters: {
      seasonId?: string;
      eventId?: string;
      collectionExecutiveId?: string;
      contactNumber?: string;
      search?: string;
    },
  ) {
    // -----------------------------
    // DONATION FILTER
    // -----------------------------
    const donationFilter: Record<string, unknown> = {
      ...excludeSoftDeleted<IDonation>(),
    };

    if (filters.seasonId) {
      donationFilter.seasonId = filters.seasonId;
    }

    if (filters.eventId) {
      donationFilter.eventId = filters.eventId;
    }

    if (filters.collectionExecutiveId) {
      donationFilter.collectionExecutiveId = filters.collectionExecutiveId;
    }

    // -----------------------------
    // GET DONATIONS
    // -----------------------------
    const donationList = await donationRepository.findMany(
      donationFilter,
      pagination,
    );

    // -----------------------------
    // GROUP DONATIONS BY DONOR
    // -----------------------------
    const donationSummary = new Map<
      string,
      {
        totalDonationAmount: number;
        donationCount: number;
      }
    >();

    for (const donation of donationList.records) {
      const donorId = donation.donorId.toString();

      const existing = donationSummary.get(donorId);

      const amount = Number(donation.donationAmount?.toString() ?? 0);

      if (existing) {
        existing.totalDonationAmount += amount;
        existing.donationCount += 1;
      } else {
        donationSummary.set(donorId, {
          totalDonationAmount: amount,
          donationCount: 1,
        });
      }
    }

    // -----------------------------
    // GET ONLY DONORS WHO DONATED
    // -----------------------------
    const donorIds = Array.from(donationSummary.keys());

    const donorFilter: Record<string, unknown> = {
      ...excludeSoftDeleted<IDonor>(),
      _id: {
        $in: donorIds,
      },
    };

    // Optional donor filters
    if (filters.contactNumber) {
      donorFilter.contactNumber = filters.contactNumber;
    }

    if (filters.search) {
      donorFilter.$or = [
        {
          donorName: {
            $regex: filters.search,
            $options: "i",
          },
        },
        {
          contactNumber: {
            $regex: filters.search,
            $options: "i",
          },
        },
      ];
    }

    const donorList = await donorRepository.findMany(donorFilter, pagination);

    // -----------------------------
    // ATTACH DONATION SUMMARY
    // -----------------------------
    const records = donorList.records.map((donor) => {
      const summary = donationSummary.get(donor._id.toString());

      return {
        ...donor.toObject(),

        totalDonationAmount: summary?.totalDonationAmount ?? 0,

        donationCount: summary?.donationCount ?? 0,
      };
    });

    return {
      records,
      meta: donationList.meta,
    };
  },
};
