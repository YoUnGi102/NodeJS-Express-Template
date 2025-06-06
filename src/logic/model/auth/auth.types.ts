import {
	AuthLoginRequestSchema,
	AuthRefreshSchema,
	AuthRegisterRequestSchema,
	AuthUserResponseSchema,
	AuthResponseSchema,
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
export type AuthResponse = z.infer<ReturnType<typeof AuthResponseSchema>>;

// ====================
// Request Types (from Zod)
// ====================

export type AuthRegisterRequest = z.infer<
	ReturnType<typeof AuthRegisterRequestSchema>
>;
export type AuthLoginRequest = z.infer<
	ReturnType<typeof AuthLoginRequestSchema>
>;
export type AuthRefreshRequest = z.infer<ReturnType<typeof AuthRefreshSchema>>;

// ====================
// Session Info Type
// ====================
export interface AuthSessionInfo {
	ipAddress?: string;
	userAgent?: string;
}
