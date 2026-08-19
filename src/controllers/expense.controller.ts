import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { parsePagination } from '../utils/queryBuilder';
import { expenseService } from '../services/expense.service';

export const expenseController = {
  createDraft: asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseService.createDraft(req.body);
    ApiResponse.created(res, expense);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await expenseService.list(pagination, {
      seasonId: req.query.seasonId as string | undefined,
      eventId: req.query.eventId as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      approvalStatus: req.query.approvalStatus as never,
      paymentStatus: req.query.paymentStatus as never,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseService.getById(req.params.id as string);
    ApiResponse.success(res, expense);
  }),

  updateDraft: asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseService.updateDraft(req.params.id as string, req.body);
    ApiResponse.success(res, expense, 'Expense draft updated successfully');
  }),

  submit: asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseService.submit(req.params.id as string);
    ApiResponse.success(res, expense, 'Expense submitted for approval');
  }),

  decide: asyncHandler(async (req: Request, res: Response) => {
    if (!req.auth) throw ApiError.unauthorized('Authentication required');
    const expense = await expenseService.decide(
      req.params.id as string,
      req.auth.id,
      req.body.action,
      req.body.remarks,
    );
    ApiResponse.success(res, expense, 'Expense approval decision recorded');
  }),

  updatePaymentStatus: asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseService.updatePaymentStatus(req.params.id as string, req.body.paymentStatus);
    ApiResponse.success(res, expense, 'Expense payment status updated successfully');
  }),
};
