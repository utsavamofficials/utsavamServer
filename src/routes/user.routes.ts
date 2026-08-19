import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { Role } from '../constants/roles';
import {
  createUserSchema,
  idParamOnlySchema,
  listUserSchema,
  setActiveSchema,
  updateUserSchema,
} from '../validators/user.validator';

export const userRouter = Router();

userRouter.use(requireAuth, requireRole(Role.SUPER_ADMIN));

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a Super Admin or Affiliate user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: User created
 *   get:
 *     summary: List users
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of users
 */
userRouter.post('/', validate(createUserSchema), userController.create);
userRouter.get('/', validate(listUserSchema), userController.list);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User found
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Soft delete a user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User deleted
 */
userRouter.get('/:id', validate(idParamOnlySchema), userController.getById);
userRouter.patch('/:id', validate(updateUserSchema), userController.update);
userRouter.delete('/:id', validate(idParamOnlySchema), userController.softDelete);

/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User status updated
 */
userRouter.patch('/:id/status', validate(setActiveSchema), userController.setActive);
