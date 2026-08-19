import { BaseRepository } from './base.repository';
import { IExpenseApproval, ExpenseApprovalModel } from '../models/expenseApproval.model';

class ExpenseApprovalRepository extends BaseRepository<IExpenseApproval> {
  constructor() {
    super(ExpenseApprovalModel);
  }

  async findByExpenseId(expenseId: string) {
    return ExpenseApprovalModel.find({ expenseId, isDeleted: false }).sort({ actionTimestamp: -1 }).exec();
  }
}

export const expenseApprovalRepository = new ExpenseApprovalRepository();
