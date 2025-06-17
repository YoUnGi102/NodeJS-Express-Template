import {
	AuthLoginRequestSchema,
	AuthRefreshRequestSchema,
	AuthRegisterRequestSchema,
	AuthUserResponseSchema,
	AuthDTOSchema,
} from "./auth.schema";
import z from "zod";

// ====================
// Data Transfer Objects (DTOs)
// ====================
export type AuthDTO = z.infer<ReturnType<typeof AuthDTOSchema>>;

// ====================
// Response Types
// ====================

export type AuthUserResponse = z.infer<
	ReturnType<typeof AuthUserResponseSchema>
>;
export interface AuthResponse {
	token: string;
	user: AuthUserResponse;
}
export interface InternalAuthResponse extends AuthResponse {
	refreshToken: string;
}

// ====================
// Request Types (from Zod)
// ====================

export type AuthRegisterRequest = z.infer<
	ReturnType<typeof AuthRegisterRequestSchema>
>;
export type AuthLoginRequest = z.infer<
	ReturnType<typeof AuthLoginRequestSchema>
>;
export type AuthRefreshRequest = z.infer<
	ReturnType<typeof AuthRefreshRequestSchema>
>;

// ====================
// Session Info Type
// ====================
export interface AuthSessionInfo {
	ipAddress?: string;
	userAgent?: string;
}
