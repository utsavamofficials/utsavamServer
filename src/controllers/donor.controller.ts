import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination } from '../utils/queryBuilder';
import { donorService } from '../services/donor.service';

export const donorController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const donor = await donorService.create(req.body);
    ApiResponse.created(res, donor);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await donorService.list(pagination, {
      seasonId: req.query.seasonId as string | undefined,
      eventId: req.query.eventId as string | undefined,
      collectionExecutiveId: req.query.collectionExecutiveId as string | undefined,
      contactNumber: req.query.contactNumber as string | undefined,
      search: req.query.search as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const donor = await donorService.getById(req.params.id as string);
    ApiResponse.success(res, donor);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const donor = await donorService.update(req.params.id as string, req.body);
    ApiResponse.success(res, donor, 'Donor updated successfully');
  }),

  softDelete: asyncHandler(async (req: Request, res: Response) => {
    await donorService.softDelete(req.params.id as string);
    ApiResponse.success(res, null, 'Donor deleted successfully');
  }),
};
