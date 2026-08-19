import { Router } from 'express';
import { seasonController } from '../controllers/season.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { Role } from '../constants/roles';
import {
  createSeasonSchema,
  listSeasonSchema,
  seasonIdParamSchema,
  setSeasonStatusSchema,
  updateSeasonSchema,
} from '../validators/season.validator';

export const seasonRouter = Router();

seasonRouter.use(requireAuth);

/**
 * @openapi
 * /seasons:
 *   post:
 *     summary: Create a season
 *     tags: [Seasons]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Season created
 *   get:
 *     summary: List seasons
 *     tags: [Seasons]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of seasons
 */
seasonRouter.post('/', requireRole(Role.SUPER_ADMIN), validate(createSeasonSchema), seasonController.create);
seasonRouter.get('/', validate(listSeasonSchema), seasonController.list);

/**
 * @openapi
 * /seasons/{id}:
 *   get:
 *     summary: Get a season by ID
 *     tags: [Seasons]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Season found
 *   patch:
 *     summary: Update a season
 *     tags: [Seasons]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Season updated
 *   delete:
 *     summary: Soft delete a season
 *     tags: [Seasons]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Season deleted
 */
seasonRouter.get('/:id', validate(seasonIdParamSchema), seasonController.getById);
seasonRouter.patch(
  '/:id',
  requireRole(Role.SUPER_ADMIN),
  validate(updateSeasonSchema),
  seasonController.update,
);
seasonRouter.delete(
  '/:id',
  requireRole(Role.SUPER_ADMIN),
  validate(seasonIdParamSchema),
  seasonController.softDelete,
);

/**
 * @openapi
 * /seasons/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a season
 *     tags: [Seasons]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Season status updated
 */
seasonRouter.patch(
  '/:id/status',
  requireRole(Role.SUPER_ADMIN),
  validate(setSeasonStatusSchema),
  seasonController.setStatus,
);
