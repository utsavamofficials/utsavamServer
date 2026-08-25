import { Router } from "express";
import { eventController } from "../controllers/event.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireActorType, requireRole } from "../middleware/authorization.middleware";
import { validate } from "../middleware/validation.middleware";
import { ActorType, Role } from "../constants/roles";
import {
  createEventSchema,
  eventIdParamSchema,
  listEventSchema,
  setEventStatusSchema,
  updateEventSchema,
} from "../validators/event.validator";

export const eventRouter = Router();
eventRouter.use(requireAuth);

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Create an event (festival) — Event Organizer only
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Event created
 *   get:
 *     summary: List events
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of events
 */
eventRouter.post(
  "/",
  requireActorType(ActorType.EVENT_ORGANIZER),
  validate(createEventSchema),
  eventController.create,
);
eventRouter.get("/", validate(listEventSchema), eventController.list);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Event found
 *   patch:
 *     summary: Update an event — Event Organizer only
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Event updated
 *   delete:
 *     summary: Soft delete an event
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Event deleted
 */
eventRouter.get("/:id", validate(eventIdParamSchema), eventController.getById);
eventRouter.patch(
  "/:id",
  requireActorType(ActorType.EVENT_ORGANIZER),
  validate(updateEventSchema),
  eventController.update,
);
eventRouter.delete(
  "/:id",
  requireRole(Role.SUPER_ADMIN),
  validate(eventIdParamSchema),
  eventController.softDelete,
);

/**
 * @openapi
 * /events/{id}/status:
 *   patch:
 *     summary: Activate or deactivate an event
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Event status updated
 */
eventRouter.patch(
  "/:id/status",
  requireRole(Role.SUPER_ADMIN),
  validate(setEventStatusSchema),
  eventController.setStatus,
);
