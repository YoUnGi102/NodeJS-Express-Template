import { container } from 'tsyringe';
import { Router } from 'express';
import { IAuthController } from './controller/auth.controller.interface';
import { INJECTION_TOKENS } from '@src/config';
import { bindAll } from '@src/logic/shared/utils/bindAllMethods';
import validate from '@logic/shared/middleware/validation.middleware';
import VALIDATOR from '@logic/model/auth/auth.schema';
import { loggingMiddleware } from '@src/logic/shared/middleware/logging.middleware';

const rawController = container.resolve<IAuthController>(
  INJECTION_TOKENS.IAuthController,
);
const authController = bindAll(rawController);
const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */
router.post(
  '/login',
  validate(VALIDATOR.POST_AUTH_LOGIN),
  loggingMiddleware,
  authController.login,
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */

router.post(
  '/register',
  validate(VALIDATOR.POST_AUTH_REGISTER),
  loggingMiddleware,
  authController.register,
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
  '/refresh',
  validate(VALIDATOR.POST_AUTH_REFRESH),
  loggingMiddleware,
  authController.refresh,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user (invalidate session)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post(
  '/logout',
  validate(VALIDATOR.POST_AUTH_REFRESH),
  loggingMiddleware,
  authController.logout,
);

export default router;
