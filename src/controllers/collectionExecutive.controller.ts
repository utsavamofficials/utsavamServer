import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination } from '../utils/queryBuilder';
import { collectionExecutiveService } from '../services/collectionExecutive.service';

export const collectionExecutiveController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const executive = await collectionExecutiveService.create(req.body);
    ApiResponse.created(res, executive);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await collectionExecutiveService.list(pagination, {
      seasonId: req.query.seasonId as string | undefined,
      eventId: req.query.eventId as string | undefined,
      eventOrganizerId: req.query.eventOrganizerId as string | undefined,
      search: req.query.search as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const executive = await collectionExecutiveService.getById(req.params.id as string);
    ApiResponse.success(res, executive);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const executive = await collectionExecutiveService.update(req.params.id as string, req.body);
    ApiResponse.success(res, executive, 'Collection executive updated successfully');
  }),

  setActive: asyncHandler(async (req: Request, res: Response) => {
    const executive = await collectionExecutiveService.setActive(req.params.id as string, req.body.isActive);
    ApiResponse.success(res, executive, 'Collection executive status updated successfully');
  }),

  softDelete: asyncHandler(async (req: Request, res: Response) => {
    await collectionExecutiveService.softDelete(req.params.id as string);
    ApiResponse.success(res, null, 'Collection executive deleted successfully');
  }),
};
