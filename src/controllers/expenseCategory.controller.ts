import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination } from '../utils/queryBuilder';
import { expenseCategoryService } from '../services/expenseCategory.service';

export const expenseCategoryController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const category = await expenseCategoryService.create(req.body);
    ApiResponse.created(res, category);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await expenseCategoryService.list(pagination, {
      seasonId: req.query.seasonId as string | undefined,
      eventId: req.query.eventId as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const category = await expenseCategoryService.getById(req.params.id as string);
    ApiResponse.success(res, category);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const category = await expenseCategoryService.update(req.params.id as string, req.body);
    ApiResponse.success(res, category, 'Expense category updated successfully');
  }),

  softDelete: asyncHandler(async (req: Request, res: Response) => {
    await expenseCategoryService.softDelete(req.params.id as string);
    ApiResponse.success(res, null, 'Expense category deleted successfully');
  }),
};
