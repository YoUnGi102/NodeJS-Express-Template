import {
	postAuthLogin,
	postAuthRefresh,
	postAuthRegister,
} from "./auth.schema";
import z from "zod";

// ====================
// Data Transfer Objects (DTOs)
// ====================
export interface AuthDTO {
	id: number;
	username: string;
	email: string;
	password?: string;
	uuid: string;
	createdAt: Date;
}

// ====================
// Response Types
// ====================
export type AuthUserResponse = Pick<
	AuthDTO,
	"username" | "email" | "createdAt" | "uuid"
>;
export interface AuthResponse {
	token: string;
	refreshToken: string;
	user: AuthUserResponse;
}

// ====================
// Request Types (from Zod)
// ====================

export type AuthRegisterRequest = z.infer<ReturnType<typeof postAuthRegister>>;
export type AuthLoginRequest = z.infer<ReturnType<typeof postAuthLogin>>;
export type AuthRefreshRequest = z.infer<ReturnType<typeof postAuthRefresh>>;

// ====================
// Session Info Type
// ====================
export interface AuthSessionInfo {
	ipAddress?: string;
	userAgent?: string;
}
