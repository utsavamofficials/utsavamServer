import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination } from '../utils/queryBuilder';
import { eventOrganizerService } from '../services/eventOrganizer.service';

export const eventOrganizerController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const organizer = await eventOrganizerService.create(req.body);
    ApiResponse.created(res, organizer);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await eventOrganizerService.list(pagination, {
      seasonId: req.query.seasonId as string | undefined,
      eventId: req.query.eventId as string | undefined,
      search: req.query.search as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const organizer = await eventOrganizerService.getById(req.params.id as string);
    ApiResponse.success(res, organizer);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const organizer = await eventOrganizerService.update(req.params.id as string, req.body);
    ApiResponse.success(res, organizer, 'Event organizer updated successfully');
  }),

  setActive: asyncHandler(async (req: Request, res: Response) => {
    const organizer = await eventOrganizerService.setActive(req.params.id as string, req.body.isActive);
    ApiResponse.success(res, organizer, 'Event organizer status updated successfully');
  }),

  softDelete: asyncHandler(async (req: Request, res: Response) => {
    await eventOrganizerService.softDelete(req.params.id as string);
    ApiResponse.success(res, null, 'Event organizer deleted successfully');
  }),
};
