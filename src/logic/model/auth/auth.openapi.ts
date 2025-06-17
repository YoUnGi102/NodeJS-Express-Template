import { MESSAGES, STATUS } from "@src/logic/shared/utils/errors/errorMessages";
import {
	AuthLoginRequestSchema,
	AuthRefreshRequestSchema,
	AuthRegisterRequestSchema,
	AuthResponseSchema
} from "./auth.schema";
import VALIDATOR from "./auth.schema";
import { OpenAPIRoute } from "@src/config/openapi/openapi.helper";

// =======
// Schemas
// =======

export const AUTH_OPENAPI_SCHEMAS = {
	AuthResponse: AuthResponseSchema(),
	// AuthUserResponse: AuthUserResponseSchema(),
	AuthRegisterRequest: AuthRegisterRequestSchema(),
	AuthLoginRequest: AuthLoginRequestSchema(),
	AuthRefreshRequest: AuthRefreshRequestSchema(),
};

// ======
// Routes
// ======

export const AUTH_OPENAPI_ROUTES: Record<string, OpenAPIRoute> = {
	LOGIN: {
		method: "post",
		path: "/auth/login",
		summary: "Log in user",
		tags: ["Auth"],
		request: VALIDATOR.POST_AUTH_LOGIN,
		errorResponses: [MESSAGES.AUTH_CREDENTIALS_INVALID],
		successResponse: {
			status: STATUS.OK,
			schema: AuthResponseSchema(),
		},
	},
	REGISTER: {
		method: "post",
		path: "/auth/register",
		summary: "Register user",
		tags: ["Auth"],
		request: VALIDATOR.POST_AUTH_REGISTER,
		errorResponses: [
			MESSAGES.USER_ALREADY_EXISTS,
			MESSAGES.AUTH_EMAIL_EXISTS,
			MESSAGES.AUTH_USERNAME_EXISTS,
			MESSAGES.AUTH_REGISTRATION_FAILED,
		],
		successResponse: {
			status: STATUS.CREATED,
			schema: AuthResponseSchema(),
		},
	},
	REFRESH: {
		method: "post",
		path: "/auth/refresh",
		summary: "Refresh access token",
		tags: ["Auth"],
        request: VALIDATOR.POST_AUTH_REFRESH,
		errorResponses: [
			MESSAGES.AUTH_TOKEN_NOT_PROVIDED,
			MESSAGES.AUTH_REFRESH_TOKEN_EXPIRED,
			MESSAGES.AUTH_REFRESH_TOKEN_INVALID,
		],
		successResponse: {
			status: STATUS.OK,
			schema: AuthResponseSchema(),
		},
	},
	LOGOUT: {
		method: "post",
		path: "/auth/logout",
		summary: "Log out user",
		tags: ["Auth"],
        request: VALIDATOR.POST_AUTH_REFRESH,
		errorResponses: [
			MESSAGES.AUTH_CREDENTIALS_INVALID,
			MESSAGES.AUTH_REFRESH_TOKEN_INVALID,
		],
		successResponse: {
			status: STATUS.NO_CONTENT,
		},
	},
};
