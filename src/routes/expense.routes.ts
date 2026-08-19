import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireActorType, requireRole } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { ActorType, Role } from '../constants/roles';
import {
  createExpenseSchema,
  decideExpenseSchema,
  expenseIdParamSchema,
  listExpenseSchema,
  updateExpenseDraftSchema,
  updateExpensePaymentStatusSchema,
} from '../validators/expense.validator';

export const expenseRouter = Router();

expenseRouter.use(requireAuth);

/**
 * @openapi
 * /expenses:
 *   post:
 *     summary: Create an expense as DRAFT
 *     tags: [Expenses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Expense draft created
 *   get:
 *     summary: List / filter expenses
 *     tags: [Expenses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of expenses
 */
expenseRouter.post(
  '/',
  requireActorType(ActorType.EVENT_ORGANIZER, ActorType.USER),
  validate(createExpenseSchema),
  expenseController.createDraft,
);
expenseRouter.get('/', validate(listExpenseSchema), expenseController.list);

/**
 * @openapi
 * /expenses/{id}:
 *   get:
 *     summary: Get an expense by ID
 *     tags: [Expenses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense found
 *   patch:
 *     summary: Update a DRAFT expense
 *     tags: [Expenses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense draft updated
 */
expenseRouter.get('/:id', validate(expenseIdParamSchema), expenseController.getById);
expenseRouter.patch(
  '/:id',
  requireActorType(ActorType.EVENT_ORGANIZER, ActorType.USER),
  validate(updateExpenseDraftSchema),
  expenseController.updateDraft,
);

/**
 * @openapi
 * /expenses/{id}/submit:
 *   post:
 *     summary: Submit a DRAFT expense for approval
 *     tags: [Expenses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense submitted
 */
expenseRouter.post(
  '/:id/submit',
  requireActorType(ActorType.EVENT_ORGANIZER, ActorType.USER),
  validate(expenseIdParamSchema),
  expenseController.submit,
);

/**
 * @openapi
 * /expenses/{id}/decision:
 *   post:
 *     summary: Approve, reject, or request revision on a SUBMITTED expense (Super Admin only)
 *     tags: [Expenses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Approval decision recorded
 */
expenseRouter.post(
  '/:id/decision',
  requireRole(Role.SUPER_ADMIN),
  validate(decideExpenseSchema),
  expenseController.decide,
);

/**
 * @openapi
 * /expenses/{id}/payment-status:
 *   patch:
 *     summary: Update payment status of an APPROVED expense
 *     tags: [Expenses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Payment status updated
 */
expenseRouter.patch(
  '/:id/payment-status',
  requireRole(Role.SUPER_ADMIN),
  validate(updateExpensePaymentStatusSchema),
  expenseController.updatePaymentStatus,
);
