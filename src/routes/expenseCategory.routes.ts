import { Router } from 'express';
import { expenseCategoryController } from '../controllers/expenseCategory.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { Role } from '../constants/roles';
import {
  createExpenseCategorySchema,
  expenseCategoryIdParamSchema,
  listExpenseCategorySchema,
  updateExpenseCategorySchema,
} from '../validators/expenseCategory.validator';

export const expenseCategoryRouter = Router();

expenseCategoryRouter.use(requireAuth);

/**
 * @openapi
 * /expense-categories:
 *   post:
 *     summary: Create an expense category
 *     tags: [ExpenseCategories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Expense category created
 *   get:
 *     summary: List expense categories
 *     tags: [ExpenseCategories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of expense categories
 */
expenseCategoryRouter.post(
  '/',
  validate(createExpenseCategorySchema),
  expenseCategoryController.create,
);
expenseCategoryRouter.get('/', validate(listExpenseCategorySchema), expenseCategoryController.list);

/**
 * @openapi
 * /expense-categories/{id}:
 *   get:
 *     summary: Get an expense category by ID
 *     tags: [ExpenseCategories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense category found
 *   patch:
 *     summary: Update an expense category
 *     tags: [ExpenseCategories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense category updated
 *   delete:
 *     summary: Soft delete an expense category
 *     tags: [ExpenseCategories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense category deleted
 */
expenseCategoryRouter.get('/:id', validate(expenseCategoryIdParamSchema), expenseCategoryController.getById);
expenseCategoryRouter.patch(
  '/:id',
  requireRole(Role.SUPER_ADMIN, Role.AFFILIATE),
  validate(updateExpenseCategorySchema),
  expenseCategoryController.update,
);
expenseCategoryRouter.delete(
  '/:id',
  requireRole(Role.SUPER_ADMIN),
  validate(expenseCategoryIdParamSchema),
  expenseCategoryController.softDelete,
);
