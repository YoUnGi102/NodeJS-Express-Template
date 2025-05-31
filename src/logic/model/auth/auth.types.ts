import '@goodrequest/joi-type-extract/index.d.ts';
import Joi from 'joi';
import {
  postAuthLogin,
  postAuthRefresh,
  postAuthRegister,
} from './auth.schema';

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
  'username' | 'email' | 'createdAt' | 'uuid'
>;
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUserResponse;
}

// ====================
// Request Types (from Joi)
// ====================
export type AuthLoginRequest = Joi.extractType<
  ReturnType<typeof postAuthLogin>
>;
export type AuthRegisterRequest = Joi.extractType<
  ReturnType<typeof postAuthRegister>
>;
export type AuthRefreshRequest = Joi.extractType<
  ReturnType<typeof postAuthRefresh>
>;

// ====================
// Session Info Type
// ====================
export interface AuthSessionInfo {
  ipAddress?: string;
  userAgent?: string;
}
