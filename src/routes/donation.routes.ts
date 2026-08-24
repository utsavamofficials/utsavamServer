import { Router } from 'express';
import { donationController } from '../controllers/donation.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireActorType } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { ActorType } from '../constants/roles';
import {
  createDonationSchema,
  donationEventIdParamSchema,
  donationIdParamSchema,
  listDonationSchema,
  receiptNumberParamSchema,
  updateDonationSchema,
  updateDonationStatusSchema,
  donationFilterSchema,
} from '../validators/donation.validator';

export const donationRouter = Router();

donationRouter.use(requireAuth);

/**
 * @openapi
 * /donations:
 *   post:
 *     summary: Create a donation (server generates the receipt number)
 *     tags: [Donations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Donation created
 *   get:
 *     summary: List / filter donations
 *     tags: [Donations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of donations
 */
donationRouter.post(
  '/',
  requireActorType(ActorType.COLLECTION_EXECUTIVE, ActorType.USER),
  validate(createDonationSchema),
  donationController.create,
);
donationRouter.get('/', validate(listDonationSchema), donationController.list);



/**
 * @openapi
 * /donations/filter:
 *   get:
 *     summary: Filter donations
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: seasonId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: query
 *         name: collectionExecutiveId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Donations filtered successfully
 */
donationRouter.get(
  '/filter',
  validate(donationFilterSchema),
  donationController.filter,
);


/**
 * @openapi
 * /donations/receipt/{receiptNumber}:
 *   get:
 *     summary: Get a donation by receipt number
 *     tags: [Donations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Donation found
 */
donationRouter.get(
  '/receipt/:receiptNumber',
  validate(receiptNumberParamSchema),
  donationController.getByReceiptNumber,
);

/**
 * @openapi
 * /donations/summary/{eventId}:
 *   get:
 *     summary: Donation totals/counts by status for an event
 *     tags: [Donations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Summary statistics
 */
donationRouter.get('/summary/:eventId', validate(donationEventIdParamSchema), donationController.eventSummary);

/**
 * @openapi
 * /donations/{id}:
 *   get:
 *     summary: Get a donation by ID
 *     tags: [Donations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Donation found
 *   patch:
 *     summary: Update donation details (not allowed once completed/refunded)
 *     tags: [Donations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Donation updated
 */
donationRouter.get('/:id', validate(donationIdParamSchema), donationController.getById);
donationRouter.patch(
  '/:id',
  requireActorType(ActorType.COLLECTION_EXECUTIVE, ActorType.USER),
  validate(updateDonationSchema),
  donationController.update,
);

/**
 * @openapi
 * /donations/{id}/status:
 *   patch:
 *     summary: Transition donation status (state machine enforced)
 *     tags: [Donations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Donation status updated
 */
donationRouter.patch(
  '/:id/status',
  requireActorType(ActorType.COLLECTION_EXECUTIVE, ActorType.USER),
  validate(updateDonationStatusSchema),
  donationController.updateStatus,
);
