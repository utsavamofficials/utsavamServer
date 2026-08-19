import { BaseRepository } from './base.repository';
import { IExpenseCategory, ExpenseCategoryModel } from '../models/expenseCategory.model';

class ExpenseCategoryRepository extends BaseRepository<IExpenseCategory> {
  constructor() {
    super(ExpenseCategoryModel);
  }
}

export const expenseCategoryRepository = new ExpenseCategoryRepository();
