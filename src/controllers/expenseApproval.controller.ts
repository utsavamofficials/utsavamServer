import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { expenseApprovalService } from '../services/expenseApproval.service';

export const expenseApprovalController = {
  listByExpense: asyncHandler(async (req: Request, res: Response) => {
    const records = await expenseApprovalService.listByExpense(req.params.expenseId as string);
    ApiResponse.success(res, records);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const record = await expenseApprovalService.getById(req.params.id as string);
    ApiResponse.success(res, record);
  }),
};
