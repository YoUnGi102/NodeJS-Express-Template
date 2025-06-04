import { SchemaMap } from "@shared/types/validation.types";
import { ZOD_CONFIG } from "@src/config";
import { z } from "zod";

// ===============
// Schema Creators
// ===============

export const postAuthRegister = () =>
	z.object({
		username: z.string().min(ZOD_CONFIG.USER.MIN_USERNAME_LENGTH).max(50),
		password: z
			.string()
			.min(ZOD_CONFIG.USER.MIN_PASSWORD_LENGTH)
			.max(50)
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
				message:
					"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
			}),
		email: z.string().email(),
	});

export const postAuthLogin = () =>
	z.object({
		username: z.string().max(50),
		password: z.string().max(50),
	});

export const postAuthRefresh = () =>
	z.object({
		refreshToken: z.string(),
	});

// ==========
// Validators
// ==========

const POST_AUTH_REGISTER: SchemaMap = {
	body: postAuthRegister(),
};

const POST_AUTH_LOGIN: SchemaMap = {
	body: postAuthLogin(),
};

const POST_AUTH_REFRESH: SchemaMap = {
	body: postAuthRefresh(),
};

export default {
	POST_AUTH_LOGIN,
	POST_AUTH_REGISTER,
	POST_AUTH_REFRESH,
};
