import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination } from '../utils/queryBuilder';
import { seasonService } from '../services/season.service';

export const seasonController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const season = await seasonService.create(req.body);
    ApiResponse.created(res, season);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await seasonService.list(pagination, {
      search: req.query.search as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const season = await seasonService.getById(req.params.id as string);
    ApiResponse.success(res, season);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const season = await seasonService.update(req.params.id as string, req.body);
    ApiResponse.success(res, season, 'Season updated successfully');
  }),

  setStatus: asyncHandler(async (req: Request, res: Response) => {
    const season = await seasonService.setActive(req.params.id as string, req.body.isActive);
    ApiResponse.success(res, season, 'Season status updated successfully');
  }),

  softDelete: asyncHandler(async (req: Request, res: Response) => {
    await seasonService.softDelete(req.params.id as string);
    ApiResponse.success(res, null, 'Season deleted successfully');
  }),
};
