import { expenseCategoryRepository } from '../repositories/expenseCategory.repository';
import { ApiError } from '../utils/ApiError';
import { excludeSoftDeleted, ParsedPagination } from '../utils/queryBuilder';
import { IExpenseCategory } from '../models/expenseCategory.model';

export interface CreateExpenseCategoryInput {
  seasonId: string;
  eventOrganizerId: string;
  categoryName: string;
  description?: string;
  allocatedBudget?: number;
}

export type UpdateExpenseCategoryInput = Partial<Omit<CreateExpenseCategoryInput, 'seasonId' | 'eventOrganizerId'>>;

export const expenseCategoryService = {
  async create(input: CreateExpenseCategoryInput): Promise<IExpenseCategory> {
    return expenseCategoryRepository.create(
      input as unknown as Partial<IExpenseCategory>,
    );
  },

  async list(pagination: ParsedPagination, filters: { seasonId?: string; eventOrganizerId?: string }) {
    const filter: Record<string, unknown> = { ...excludeSoftDeleted<IExpenseCategory>() };
    if (filters.seasonId) filter.seasonId = filters.seasonId;
    if (filters.eventOrganizerId) filter.eventOrganizerId = filters.eventOrganizerId;
    return expenseCategoryRepository.findMany(filter, pagination);
  },

  async getById(id: string): Promise<IExpenseCategory> {
    const category = await expenseCategoryRepository.findById(id);
    if (!category) throw ApiError.notFound('Expense category not found');
    return category;
  },

  async update(id: string, input: UpdateExpenseCategoryInput): Promise<IExpenseCategory> {
    const updated = await expenseCategoryRepository.updateById(
      id,
      input as unknown as Partial<IExpenseCategory>,
    );
    if (!updated) throw ApiError.notFound('Expense category not found');
    return updated;
  },

  async softDelete(id: string): Promise<void> {
    const category = await expenseCategoryRepository.softDeleteById(id);
    if (!category) throw ApiError.notFound('Expense category not found');
  },
};
