import { BaseRepository } from './base.repository';
import { IExpense, ExpenseModel } from '../models/expense.model';

class ExpenseRepository extends BaseRepository<IExpense> {
  constructor() {
    super(ExpenseModel);
  }

  async findByVoucherNumber(expenseVoucherNumber: string) {
    return ExpenseModel.findOne({ expenseVoucherNumber, isDeleted: false }).exec();
  }
}

export const expenseRepository = new ExpenseRepository();
