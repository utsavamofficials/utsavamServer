import { BaseRepository } from './base.repository';
import { IExpense, ExpenseModel } from '../models/expense.model';

class ExpenseRepository extends BaseRepository<IExpense> {
  constructor() {
    super(ExpenseModel);
  }

}

export const expenseRepository = new ExpenseRepository();
