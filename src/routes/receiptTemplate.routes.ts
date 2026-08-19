import { Router } from 'express';
import { receiptTemplateController } from '../controllers/receiptTemplate.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireActorType } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { ActorType } from '../constants/roles';
import {
  createReceiptTemplateSchema,
  receiptTemplateEventIdParamSchema,
  setReceiptTemplateStatusSchema,
  updateReceiptTemplateSchema,
} from '../validators/receiptTemplate.validator';

export const receiptTemplateRouter = Router();

receiptTemplateRouter.use(requireAuth);

/**
 * @openapi
 * /receipt-templates:
 *   post:
 *     summary: Create a receipt template for an event (one per event)
 *     tags: [ReceiptTemplates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Receipt template created
 */
receiptTemplateRouter.post(
  '/',
  requireActorType(ActorType.USER, ActorType.EVENT_ORGANIZER),
  validate(createReceiptTemplateSchema),
  receiptTemplateController.create,
);

/**
 * @openapi
 * /receipt-templates/event/{eventId}:
 *   get:
 *     summary: Get the receipt template for an event
 *     tags: [ReceiptTemplates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Receipt template found
 */
receiptTemplateRouter.get(
  '/event/:eventId',
  validate(receiptTemplateEventIdParamSchema),
  receiptTemplateController.getByEventId,
);

/**
 * @openapi
 * /receipt-templates/{id}:
 *   patch:
 *     summary: Update a receipt template
 *     tags: [ReceiptTemplates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Receipt template updated
 */
receiptTemplateRouter.patch(
  '/:id',
  requireActorType(ActorType.USER, ActorType.EVENT_ORGANIZER),
  validate(updateReceiptTemplateSchema),
  receiptTemplateController.update,
);

/**
 * @openapi
 * /receipt-templates/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a receipt template
 *     tags: [ReceiptTemplates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Receipt template status updated
 */
receiptTemplateRouter.patch(
  '/:id/status',
  requireActorType(ActorType.USER, ActorType.EVENT_ORGANIZER),
  validate(setReceiptTemplateStatusSchema),
  receiptTemplateController.setActive,
);
