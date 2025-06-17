import VALIDATOR from "@logic/model/auth/auth.schema";
import validate from "@logic/shared/middleware/validation.middleware";
import { INJECTION_TOKENS } from "@src/config";
import { loggingMiddleware } from "@src/logic/shared/middleware/logging.middleware";
import { bindAll } from "@src/logic/shared/utils/bindAllMethods";
import { Router } from "express";
import { container } from "tsyringe";
import { IAuthController } from "./controller/auth.controller.interface";

const rawController = container.resolve<IAuthController>(
	INJECTION_TOKENS.IAuthController,
);
const authController = bindAll(rawController);
const router = Router();

// =====
// Login
// =====

router.post(
	"/login",
	validate(VALIDATOR.POST_AUTH_LOGIN),
	loggingMiddleware,
	authController.login,
);

// ========
// Register
// ========

router.post(
	"/register",
	validate(VALIDATOR.POST_AUTH_REGISTER),
	loggingMiddleware,
	authController.register,
);

<<<<<<< HEAD
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
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
router.post('/refresh', loggingMiddleware, authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user (invalidate session)
 *     tags: [Auth]
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
router.post('/logout', loggingMiddleware, authController.logout);
=======
// =======
// Refresh
// =======

router.post(
	"/refresh",
	validate(VALIDATOR.POST_AUTH_REFRESH),
	loggingMiddleware,
	authController.refresh,
);

// ======
// Logout
// ======

router.post(
	"/logout",
	validate(VALIDATOR.POST_AUTH_REFRESH),
	loggingMiddleware,
	authController.logout,
);
>>>>>>> origin/main

export default router;
