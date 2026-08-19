import { Router } from 'express';
import { expenseApprovalController } from '../controllers/expenseApproval.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { Role } from '../constants/roles';
import {
  expenseApprovalIdParamSchema,
  listByExpenseSchema,
} from '../validators/expenseApproval.validator';

export const expenseApprovalRouter = Router();

expenseApprovalRouter.use(requireAuth, requireRole(Role.SUPER_ADMIN));

/**
 * @openapi
 * /expense-approvals/by-expense/{expenseId}:
 *   get:
 *     summary: List the approval audit trail for an expense (read-only)
 *     tags: [ExpenseApprovals]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Approval history
 */
expenseApprovalRouter.get(
  '/by-expense/:expenseId',
  validate(listByExpenseSchema),
  expenseApprovalController.listByExpense,
);

/**
 * @openapi
 * /expense-approvals/{id}:
 *   get:
 *     summary: Get a single expense approval audit record
 *     tags: [ExpenseApprovals]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Approval record found
 */
expenseApprovalRouter.get('/:id', validate(expenseApprovalIdParamSchema), expenseApprovalController.getById);
