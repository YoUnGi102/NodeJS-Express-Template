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
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 maxLength: 50
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     uuid:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   enum:
 *                     - AUTH_CREDENTIALS_INVALID
 *                 message:
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
 *                 minLength: 3
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 50
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$'
 *                 description: Must include uppercase, lowercase, number, and special character
 *               email:
 *                 type: string
 *                 format: email
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     uuid:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       409:
 *         description: Conflict due to duplicate user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   enum: [AUTH_USERNAME_EXISTS, AUTH_EMAIL_EXISTS]
 *                 message:
 *                   type: string
 *       500:
 *         description: Registration failed due to a server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   enum: [AUTH_REGISTRATION_FAILED]
 *                 message:
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     uuid:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   enum:
 *                     - AUTH_REFRESH_TOKEN_INVALID
 *                     - AUTH_REFRESH_TOKEN_EXPIRED
 *                 message:
 *                   type: string
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
 *       204:
 *         description: Logged out successfully. No content returned.
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   enum:
 *                     - AUTH_REFRESH_TOKEN_INVALID
 *                     - AUTH_REFRESH_TOKEN_EXPIRED
 *                 message:
 *                   type: string
 */
router.post(
  '/logout',
  validate(VALIDATOR.POST_AUTH_REFRESH),
  loggingMiddleware,
  authController.logout,
);

export default router;
