import { Router } from 'express';
import { donorController } from '../controllers/donor.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireActorType } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { ActorType } from '../constants/roles';
import {
  createDonorSchema,
  donorIdParamSchema,
  listDonorSchema,
  updateDonorSchema,
} from '../validators/donor.validator';

export const donorRouter = Router();

donorRouter.use(requireAuth);

/**
 * @openapi
 * /donors:
 *   post:
 *     summary: Create a donor
 *     tags: [Donors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Donor created
 *   get:
 *     summary: List / search donors
 *     tags: [Donors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of donors
 */
donorRouter.post(
  '/',
  requireActorType(ActorType.USER, ActorType.EVENT_ORGANIZER, ActorType.COLLECTION_EXECUTIVE),
  validate(createDonorSchema),
  donorController.create,
);
donorRouter.get('/', validate(listDonorSchema), donorController.donorWithDonation);
// donorRouter.get('/doner-donation', validate(listDonorSchema), donorController.donorWithDonation);

/**
 * @openapi
 * /donors/{id}:
 *   get:
 *     summary: Get a donor by ID
 *     tags: [Donors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Donor found
 *   patch:
 *     summary: Update a donor
 *     tags: [Donors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Donor updated
 *   delete:
 *     summary: Soft delete a donor
 *     tags: [Donors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Donor deleted
 */
donorRouter.get('/:id', validate(donorIdParamSchema), donorController.getById);
donorRouter.patch(
  '/:id',
  requireActorType(ActorType.USER, ActorType.EVENT_ORGANIZER, ActorType.COLLECTION_EXECUTIVE),
  validate(updateDonorSchema),
  donorController.update,
);
donorRouter.delete('/:id', validate(donorIdParamSchema), donorController.softDelete);
