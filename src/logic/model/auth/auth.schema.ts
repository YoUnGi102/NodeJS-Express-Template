import { SchemaMap } from "@shared/types/validation.types";
import ZOD_CONFIG from "@src/config/zod.config";
import { z } from "zod";

const AUTH_SCHEMA_FIELDS = {
	ID: z.number(),
	USERNAME: z
		.string()
		.min(ZOD_CONFIG.USER.MIN_USERNAME_LENGTH)
		.max(ZOD_CONFIG.USER.MAX_PASSWORD_LENGTH),
	PASSWORD: z
		.string()
		.min(ZOD_CONFIG.USER.MIN_PASSWORD_LENGTH)
		.max(ZOD_CONFIG.USER.MAX_PASSWORD_LENGTH)
		.regex(ZOD_CONFIG.REGEX.PASSWORD, {
			message:
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		}),
	EMAIL: z.string().email(),
	UUID: z.string().uuid(),
	CREATED_AT: z.date(),
	REFRESH_TOKEN: z.string().regex(ZOD_CONFIG.REGEX.JWT),
	ACCESS_TOKEN: z.string().regex(ZOD_CONFIG.REGEX.JWT),
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

export const AuthRefreshSchema = () =>
	z.object({
		refreshToken: AUTH_SCHEMA_FIELDS.REFRESH_TOKEN,
	});

// ==========
// DTO Schema
// ==========

export const AuthDTOSchema = () =>
	z.object({
		id: AUTH_SCHEMA_FIELDS.ID,
		username: AUTH_SCHEMA_FIELDS.USERNAME,
		email: AUTH_SCHEMA_FIELDS.EMAIL,
		password: AUTH_SCHEMA_FIELDS.PASSWORD,
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
		refreshToken: AUTH_SCHEMA_FIELDS.REFRESH_TOKEN,
		token: AUTH_SCHEMA_FIELDS.ACCESS_TOKEN,
		user: AuthUserResponseSchema(),
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
	body: AuthRefreshSchema(),
};

export default {
	POST_AUTH_LOGIN,
	POST_AUTH_REGISTER,
	POST_AUTH_REFRESH,
};
