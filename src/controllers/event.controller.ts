import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination } from '../utils/queryBuilder';
import { eventService } from '../services/event.service';

export const eventController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.create(req.body);
    ApiResponse.created(res, event);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await eventService.list(pagination, {
      seasonId: req.query.seasonId as string | undefined,
      search: req.query.search as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.getById(req.params.id as string);
    ApiResponse.success(res, event);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.update(req.params.id as string, req.body);
    ApiResponse.success(res, event, 'Event updated successfully');
  }),

  setStatus: asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.setActive(req.params.id as string, req.body.isActive);
    ApiResponse.success(res, event, 'Event status updated successfully');
  }),

  softDelete: asyncHandler(async (req: Request, res: Response) => {
    await eventService.softDelete(req.params.id as string);
    ApiResponse.success(res, null, 'Event deleted successfully');
  }),
};
