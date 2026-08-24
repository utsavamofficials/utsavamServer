import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination } from '../utils/queryBuilder';
import { userService } from '../services/user.service';

export const userController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    ApiResponse.created(res, user);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await userService.list(pagination, {
      role: req.query.role as never,
      search: req.query.search as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  platformList: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await userService.platformList(pagination, {
      role: req.query.role as never,
      search: req.query.search as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getById(req.params.id as string);
    ApiResponse.success(res, user);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.update(req.params.id as string, req.body);
    ApiResponse.success(res, user, 'User updated successfully');
  }),

  setActive: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.setActive(req.params.id as string, req.body.isActive);
    ApiResponse.success(res, user, 'User status updated successfully');
  }),

  softDelete: asyncHandler(async (req: Request, res: Response) => {
    await userService.softDelete(req.params.id as string);
    ApiResponse.success(res, null, 'User deleted successfully');
  }),
};
