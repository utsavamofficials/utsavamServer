import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, refreshSchema } from '../validators/auth.validator';

export const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login for Users, Event Organizers, and Collection Executives
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Login successful, returns access + refresh tokens
 */
authRouter.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Exchange a refresh token for a new access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: New access token issued
 */
authRouter.post('/refresh', validate(refreshSchema), authController.refresh);
