import { expenseRepository } from "../repositories/expense.repository";
import { expenseCategoryService } from "./expenseCategory.service";
import { expenseApprovalRepository } from "../repositories/expenseApproval.repository";
import { ApiError } from "../utils/ApiError";
import { generateReferenceNumber } from "../utils/referenceGenerator";
import { excludeSoftDeleted, ParsedPagination } from "../utils/queryBuilder";
import { IExpense } from "../models/expense.model";
import {
  ExpenseApprovalAction,
  ExpenseApprovalStatus,
  ExpensePaymentStatus,
} from "../constants/enums";

// ExpensePaymentMode,
export interface CreateExpenseInput {
  seasonId: string;
  eventId?: string;
  categoryId: string;
  eventOrganizerId: string;
  vendorName?: string;
  vendorGstin?: string;
  amount: number;
  // paymentMode: ExpensePaymentMode;
  receiptUrls?: string[];
  expenseDate?: Date;
}

export type UpdateExpenseDraftInput = Partial<
  Omit<
    CreateExpenseInput,
    "seasonId" | "categoryId" | "eventOrganizerId"
  >
>;

export interface ExpenseFilters {
  seasonId?: string;
  eventId?: string;
  categoryId?: string;
  approvalStatus?: ExpenseApprovalStatus;
  paymentStatus?: ExpensePaymentStatus;
}

export const expenseService = {
  async createDraft(input: CreateExpenseInput): Promise<IExpense> {
    // Verify the category genuinely belongs to this event/season.
    const category = await expenseCategoryService.getById(input.categoryId);
    if (category.seasonId.toString() !== input.seasonId) {
      throw ApiError.badRequest(
        "Expense category does not belong to the specified event/season",
      );
    }

    // const expenseVoucherNumber = await generateReferenceNumber("EXP");
    return expenseRepository.create({
      ...input,
    } as unknown as Partial<IExpense>);
  },

  async list(pagination: ParsedPagination, filters: ExpenseFilters) {
    const filter: Record<string, unknown> = {
      ...excludeSoftDeleted<IExpense>(),
    };
    if (filters.seasonId) filter.seasonId = filters.seasonId;
    if (filters.eventId) filter.eventId = filters.eventId;
    if (filters.categoryId) filter.categoryId = filters.categoryId;
    if (filters.approvalStatus) filter.approvalStatus = filters.approvalStatus;
    if (filters.paymentStatus) filter.paymentStatus = filters.paymentStatus;
    return expenseRepository.findMany(filter, pagination);
  },

  async getById(id: string): Promise<IExpense> {
    const expense = await expenseRepository.findById(id);
    if (!expense) throw ApiError.notFound("Expense not found");
    return expense;
  },

  async updateDraft(
    id: string,
    input: UpdateExpenseDraftInput,
  ): Promise<IExpense> {
    const expense = await this.getById(id);
    // if (expense.approvalStatus !== ExpenseApprovalStatus.DRAFT) {
    //   throw ApiError.badRequest('Only DRAFT expenses can be edited');
    // }
    const updated = await expenseRepository.updateById(
      id,
      input as unknown as Partial<IExpense>,
    );
    if (!updated) throw ApiError.notFound("Expense not found");
    return updated;
  },

  async submit(id: string): Promise<IExpense> {
    const expense = await this.getById(id);
    // if (expense.approvalStatus !== ExpenseApprovalStatus.DRAFT) {
    //   throw ApiError.badRequest('Only DRAFT expenses can be submitted');
    // }
    const updated = await expenseRepository.updateById(id, {
      approvalStatus: ExpenseApprovalStatus.SUBMITTED,
    });
    if (!updated) throw ApiError.notFound("Expense not found");
    return updated;
  },

  /**
   * Approve/reject/request-revision. Writes an immutable ExpenseApproval
   * audit record alongside the status transition. Only SUBMITTED expenses
   * can be acted on — no arbitrary status manipulation.
   */
  async decide(
    id: string,
    approvedByUserId: string,
    action: ExpenseApprovalAction,
    remarks?: string,
  ): Promise<IExpense> {
    const expense = await this.getById(id);
    // if (expense.approvalStatus !== ExpenseApprovalStatus.SUBMITTED) {
    //   throw ApiError.badRequest('Only SUBMITTED expenses can be approved, rejected, or sent back for revision');
    // }

    const nextStatus =
      action === ExpenseApprovalAction.APPROVED
        ? ExpenseApprovalStatus.APPROVED
        : action === ExpenseApprovalAction.REJECTED
          ? ExpenseApprovalStatus.REJECTED
          : ExpenseApprovalStatus.DRAFT; // NEEDS_REVISION sends it back to draft for editing

    await expenseApprovalRepository.create({
      expenseId: expense._id,
      approvedByUserId,
      action,
      remarks,
      actionTimestamp: new Date(),
    } as never);

    const updated = await expenseRepository.updateById(id, {
      approvalStatus: nextStatus,
    });
    if (!updated) throw ApiError.notFound("Expense not found");
    return updated;
  },

  async updatePaymentStatus(
    id: string,
    paymentStatus: ExpensePaymentStatus,
  ): Promise<IExpense> {
    const expense = await this.getById(id);
    // if (expense.approvalStatus !== ExpenseApprovalStatus.APPROVED) {
    //   throw ApiError.badRequest('Only APPROVED expenses can have their payment status updated');
    // }
    const updated = await expenseRepository.updateById(id, { paymentStatus });
    if (!updated) throw ApiError.notFound("Expense not found");
    return updated;
  },
};
