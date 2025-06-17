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

export default router;
