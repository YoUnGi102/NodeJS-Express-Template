import { SchemaMap } from "@shared/types/validation.types";
import ZOD_CONFIG, { z } from "@src/config/zod.config";

const AUTH_SCHEMA_FIELDS = {
	ID: z.number().openapi({ example: 1 }),
	USERNAME: z
		.string()
		.min(ZOD_CONFIG.USER.MIN_USERNAME_LENGTH)
		.max(ZOD_CONFIG.USER.MAX_PASSWORD_LENGTH)
		.openapi({ example: "Example123" }),
	PASSWORD: z
		.string()
		.min(ZOD_CONFIG.USER.MIN_PASSWORD_LENGTH)
		.max(ZOD_CONFIG.USER.MAX_PASSWORD_LENGTH)
		.regex(ZOD_CONFIG.REGEX.PASSWORD, {
			message:
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		})
		.openapi({ example: "Passw0rd.+" }),
	EMAIL: z.string().email().openapi({ example: "exmpl123@example.com" }),
	UUID: z
		.string()
		.uuid()
		.openapi({ example: "2e696b5f-63f7-4ac6-b815-7f7c9888aa56" }),
	CREATED_AT: z.date().openapi({ example: "2025-03-19T08:47:58.398Z" }),
	REFRESH_TOKEN: z.string().regex(ZOD_CONFIG.REGEX.JWT).openapi({
		example:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZXhwIjoxNzE4NDA0MzY4fQ.zLOUGmMTU5E7D9Dk8CeHkq1bfp4XcmQtKRT-bZznZwA",
	}),
	ACCESS_TOKEN: z.string().regex(ZOD_CONFIG.REGEX.JWT).openapi({
		example:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZXhwIjoxNzE4NDA0MzY4fQ.zLOUGmMTU5E7D9Dk8CeHkq1bfp4XcmQtKRT-bZznZwA",
	}),
};

// ===============
// Request Schemas
// ===============

export const AuthRegisterRequestSchema = () =>
	z.object({
		username: AUTH_SCHEMA_FIELDS.USERNAME,
		password: AUTH_SCHEMA_FIELDS.PASSWORD,
		email: AUTH_SCHEMA_FIELDS.EMAIL,
	});

export const AuthLoginRequestSchema = () =>
	z.object({
		username: AUTH_SCHEMA_FIELDS.USERNAME,
		password: AUTH_SCHEMA_FIELDS.PASSWORD,
	});

export const AuthRefreshRequestSchema = () =>
	z.object({
		jid: AUTH_SCHEMA_FIELDS.REFRESH_TOKEN,
	});

// ==========
// DTO Schema
// ==========

export const AuthDTOSchema = () =>
	z.object({
		id: AUTH_SCHEMA_FIELDS.ID,
		username: AUTH_SCHEMA_FIELDS.USERNAME,
		email: AUTH_SCHEMA_FIELDS.EMAIL,
		password: AUTH_SCHEMA_FIELDS.PASSWORD.optional(),
		uuid: AUTH_SCHEMA_FIELDS.UUID,
		createdAt: AUTH_SCHEMA_FIELDS.CREATED_AT,
	});

// ================
// Response Schemas
// ================

export const AuthUserResponseSchema = () =>
	AuthDTOSchema().pick({
		username: true,
		email: true,
		uuid: true,
		createdAt: true,
	});

export const AuthResponseSchema = () =>
	z.object({
		token: AUTH_SCHEMA_FIELDS.ACCESS_TOKEN,
		user: AuthUserResponseSchema(),
	});

export const InternalAuthResponseSchema = () =>
	AuthResponseSchema().extend({
		refreshToken: AUTH_SCHEMA_FIELDS.REFRESH_TOKEN,
	});

// ==========
// Validators
// ==========

const POST_AUTH_REGISTER: SchemaMap = {
	body: AuthRegisterRequestSchema(),
};

const POST_AUTH_LOGIN: SchemaMap = {
	body: AuthLoginRequestSchema(),
};

const POST_AUTH_REFRESH: SchemaMap = {
	cookies: AuthRefreshRequestSchema(),
};

const POST_AUTH_LOGOUT: SchemaMap = {
	cookies: AuthRefreshRequestSchema(),
};

export default {
	POST_AUTH_LOGIN,
	POST_AUTH_REGISTER,
	POST_AUTH_REFRESH,
	POST_AUTH_LOGOUT,
};
