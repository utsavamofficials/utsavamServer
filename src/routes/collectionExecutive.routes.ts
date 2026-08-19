import { Router } from 'express';
import { collectionExecutiveController } from '../controllers/collectionExecutive.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireActorType, requireRole } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { Role, ActorType } from '../constants/roles';
import {
  collectionExecutiveIdParamSchema,
  createCollectionExecutiveSchema,
  listCollectionExecutiveSchema,
  setCollectionExecutiveStatusSchema,
  updateCollectionExecutiveSchema,
} from '../validators/collectionExecutive.validator';

export const collectionExecutiveRouter = Router();

collectionExecutiveRouter.use(requireAuth);

/**
 * @openapi
 * /collection-executives:
 *   post:
 *     summary: Create a collection executive (created by an Event Organizer)
 *     tags: [CollectionExecutives]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Collection executive created
 *   get:
 *     summary: List collection executives
 *     tags: [CollectionExecutives]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of collection executives
 */
collectionExecutiveRouter.post(
  '/',
  requireActorType(ActorType.USER, ActorType.EVENT_ORGANIZER),
  validate(createCollectionExecutiveSchema),
  collectionExecutiveController.create,
);
collectionExecutiveRouter.get('/', validate(listCollectionExecutiveSchema), collectionExecutiveController.list);

/**
 * @openapi
 * /collection-executives/{id}:
 *   get:
 *     summary: Get a collection executive by ID
 *     tags: [CollectionExecutives]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Collection executive found
 *   patch:
 *     summary: Update a collection executive
 *     tags: [CollectionExecutives]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Collection executive updated
 *   delete:
 *     summary: Soft delete a collection executive
 *     tags: [CollectionExecutives]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Collection executive deleted
 */
collectionExecutiveRouter.get(
  '/:id',
  validate(collectionExecutiveIdParamSchema),
  collectionExecutiveController.getById,
);
collectionExecutiveRouter.patch(
  '/:id',
  requireActorType(ActorType.USER, ActorType.EVENT_ORGANIZER),
  validate(updateCollectionExecutiveSchema),
  collectionExecutiveController.update,
);
collectionExecutiveRouter.delete(
  '/:id',
  requireRole(Role.SUPER_ADMIN),
  validate(collectionExecutiveIdParamSchema),
  collectionExecutiveController.softDelete,
);

/**
 * @openapi
 * /collection-executives/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a collection executive
 *     tags: [CollectionExecutives]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Collection executive status updated
 */
collectionExecutiveRouter.patch(
  '/:id/status',
  requireActorType(ActorType.USER, ActorType.EVENT_ORGANIZER),
  validate(setCollectionExecutiveStatusSchema),
  collectionExecutiveController.setActive,
);
