import { Router } from 'express';
import { eventOrganizerController } from '../controllers/eventOrganizer.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validation.middleware';
import { Role } from '../constants/roles';
import {
  createEventOrganizerSchema,
  eventOrganizerIdParamSchema,
  listEventOrganizerSchema,
  setEventOrganizerStatusSchema,
  updateEventOrganizerSchema,
} from '../validators/eventOrganizer.validator';

export const eventOrganizerRouter = Router();

eventOrganizerRouter.use(requireAuth);

/**
 * @openapi
 * /event-organizers:
 *   post:
 *     summary: Create an event organizer
 *     tags: [EventOrganizers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Event organizer created
 *   get:
 *     summary: List event organizers
 *     tags: [EventOrganizers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of event organizers
 */
eventOrganizerRouter.post(
  '/',
  requireRole(Role.SUPER_ADMIN, Role.AFFILIATE),
  validate(createEventOrganizerSchema),
  eventOrganizerController.create,
);
eventOrganizerRouter.get('/', validate(listEventOrganizerSchema), eventOrganizerController.list);

/**
 * @openapi
 * /event-organizers/{id}:
 *   get:
 *     summary: Get an event organizer by ID
 *     tags: [EventOrganizers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Event organizer found
 *   patch:
 *     summary: Update an event organizer
 *     tags: [EventOrganizers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Event organizer updated
 *   delete:
 *     summary: Soft delete an event organizer
 *     tags: [EventOrganizers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Event organizer deleted
 */
eventOrganizerRouter.get('/:id', validate(eventOrganizerIdParamSchema), eventOrganizerController.getById);
eventOrganizerRouter.patch(
  '/:id',
  requireRole(Role.SUPER_ADMIN, Role.AFFILIATE),
  validate(updateEventOrganizerSchema),
  eventOrganizerController.update,
);
eventOrganizerRouter.delete(
  '/:id',
  requireRole(Role.SUPER_ADMIN),
  validate(eventOrganizerIdParamSchema),
  eventOrganizerController.softDelete,
);

/**
 * @openapi
 * /event-organizers/{id}/status:
 *   patch:
 *     summary: Activate or deactivate an event organizer
 *     tags: [EventOrganizers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Event organizer status updated
 */
eventOrganizerRouter.patch(
  '/:id/status',
  requireRole(Role.SUPER_ADMIN, Role.AFFILIATE),
  validate(setEventOrganizerStatusSchema),
  eventOrganizerController.setActive,
);
