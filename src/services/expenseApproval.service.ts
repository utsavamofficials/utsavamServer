import { expenseApprovalRepository } from '../repositories/expenseApproval.repository';
import { ApiError } from '../utils/ApiError';
import { IExpenseApproval } from '../models/expenseApproval.model';

export const expenseApprovalService = {
  /** Approval history is an audit trail — read-only, never editable/deletable via API. */
  async listByExpense(expenseId: string): Promise<IExpenseApproval[]> {
    return expenseApprovalRepository.findByExpenseId(expenseId);
  },

  async getById(id: string): Promise<IExpenseApproval> {
    const record = await expenseApprovalRepository.findById(id);
    if (!record) throw ApiError.notFound('Expense approval record not found');
    return record;
  },
};
