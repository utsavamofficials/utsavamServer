import { eventRepository } from "../repositories/event.repository";
import { seasonRepository } from "../repositories/season.repository";
import { ApiError } from "../utils/ApiError";
import { excludeSoftDeleted, ParsedPagination } from "../utils/queryBuilder";
import { IEvent } from "../models/event.model";
import { eventOrganizerService } from "./eventOrganizer.service";

export interface CreateEventInput {
  seasonId: string;
  eventOrganizerId: string;
  eventName: string;
  organizingMandalName?: string;
  description?: string;
  donationUpiQrCode1?: string;
  donationUpiQrCode2?: string;
  startDate: Date;
  endDate: Date;
  referenceBy?: string;
}

export type UpdateEventInput = Partial<Omit<CreateEventInput, "seasonId">>;

function assertValidDateRange(startDate: Date, endDate: Date): void {
  if (new Date(startDate) >= new Date(endDate)) {
    throw ApiError.badRequest("endDate must be after startDate");
  }
}

async function assertSeasonExists(seasonId: string): Promise<void> {
  const season = await seasonRepository.findById(seasonId);
  if (!season) throw ApiError.badRequest("Referenced season does not exist");
}

export const eventService = {
  async create(input: CreateEventInput): Promise<IEvent> {

    // const organizer = await eventOrganizerService.assertOwnsEvent(input.eventOrganizerId, input.eventOrganizerId);
    if (input.eventOrganizerId == null || input.eventOrganizerId == undefined) {
      throw ApiError.forbidden(
        `Event Organizer ${input.eventOrganizerId} not found`,
      );
    }

    const organizer = await eventOrganizerService.getById(
      input.eventOrganizerId,
    );

    const currentCount = await eventRepository.countByOrganizer(
      input.eventOrganizerId,
    );
    if (currentCount >= organizer.eventLimit) {
      throw ApiError.forbidden(
        `Event limit (${organizer.eventLimit}) reached, Contact to administrator for increasing limit.`,
      );
    }

    assertValidDateRange(input.startDate, input.endDate);
    await assertSeasonExists(input.seasonId);

    return eventRepository.create(input as unknown as Record<string, unknown>);
  },

  async list(
    pagination: ParsedPagination,
    filters: { seasonId?: string; eventOrganizerId?: string; search?: string },
  ) {
    const filter: Record<string, unknown> = { ...excludeSoftDeleted<IEvent>() };
    if (filters.seasonId) filter.seasonId = filters.seasonId;
    if (filters.eventOrganizerId) filter.eventOrganizerId = filters.eventOrganizerId;
    if (filters.search) {
      filter.$or = [
        { eventName: { $regex: filters.search, $options: "i" } },
        { organizingMandalName: { $regex: filters.search, $options: "i" } },
      ];
    }
    return eventRepository.findMany(filter, pagination);
  },

  async getById(id: string): Promise<IEvent> {
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    return event;
  },

  async update(id: string, input: UpdateEventInput): Promise<IEvent> {
    const current = await this.getById(id);
    const startDate = input.startDate ?? current.startDate;
    const endDate = input.endDate ?? current.endDate;
    assertValidDateRange(startDate, endDate);

    const updated = await eventRepository.updateById(id, input);
    if (!updated) throw ApiError.notFound("Event not found");
    return updated;
  },

  async setActive(id: string, isActive: boolean): Promise<IEvent> {
    const event = await eventRepository.setActive(id, isActive);
    if (!event) throw ApiError.notFound("Event not found");
    return event;
  },

  async softDelete(id: string): Promise<void> {
    const event = await eventRepository.softDeleteById(id);
    if (!event) throw ApiError.notFound("Event not found");
  },

  /** Used by dependent modules (organizers, expenses, etc.) to verify eventId belongs to seasonId. */
  async assertBelongsToSeason(seasonId: string): Promise<IEvent> {
    const event = await eventRepository.findBySeasonId(seasonId);
    if (!event)
      throw ApiError.badRequest(
        "Event does not belong to the specified season",
      );
    return event;
  },
};
