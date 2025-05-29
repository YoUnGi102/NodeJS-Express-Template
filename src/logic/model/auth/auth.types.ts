import '@goodrequest/joi-type-extract/index.d.ts';
import Joi from 'joi';
import {
  authPostLogin,
  authPostRefresh,
  authPostRegister,
} from './auth.schema';

// DTO

export interface AuthDTO {
  id: number;
  username: string;
  email: string;
  password?: string;
  uuid: string;
  createdAt: Date;
}

// RESPONSE TYPES

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    username: string;
    email: string;
    uuid: string;
    createdAt: Date;
  };
}

// REQUEST TYPES - Extracted from "auth.schema.ts"

export type AuthLoginRequest = Joi.extractType<
  ReturnType<typeof authPostLogin>
>;
export type AuthRegisterRequest = Joi.extractType<
  ReturnType<typeof authPostRegister>
>;
export type AuthRefreshRequest = Joi.extractType<
  ReturnType<typeof authPostRefresh>
>;

export interface AuthSessionInfo {
  ipAddress?: string;
  userAgent?: string;
}
