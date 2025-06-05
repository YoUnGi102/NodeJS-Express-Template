import { SchemaMap } from "@src/logic/shared/types/validation.types";
import { ErrorMessage, MESSAGES } from "@src/logic/shared/utils/errors/errorMessages";
import AUTH_VALIDATOR from '@model/auth/auth.schema';

export interface OpenAPIRoute {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'trace';
    path: string;
    summary?: string;
    tags?: string[];
    request?: SchemaMap,
    successResponse?: any,
    errorResponses: ErrorMessage[]
}

export const ROUTES: Record<string, Record<string, OpenAPIRoute>> = {
    AUTH: {
        LOGIN: {
            method: 'post',
            path: '/auth/login',
            summary: 'Log in user',
            tags: ['Auth'],
            request: AUTH_VALIDATOR.POST_AUTH_LOGIN,
            errorResponses: [
                MESSAGES.AUTH_CREDENTIALS_INVALID,
            ]
        }, REGISTER: {
            method: 'post',
            path: '/auth/register',
            summary: 'Register user',
            tags: ['Auth'],
            request: AUTH_VALIDATOR.POST_AUTH_REGISTER,
            errorResponses: [
                MESSAGES.USER_ALREADY_EXISTS,
                MESSAGES.AUTH_EMAIL_EXISTS,
                MESSAGES.AUTH_USERNAME_EXISTS,
                MESSAGES.AUTH_REGISTRATION_FAILED
            ]
        }, LOGOUT: {
            method: 'post',
            path: '/auth/logout',
            summary: 'Log out user',
            tags: ['Auth'],
            errorResponses: [
                MESSAGES.AUTH_CREDENTIALS_INVALID,
                MESSAGES.AUTH_REFRESH_TOKEN_INVALID,
            ]
        }, REFRESH: {
            method: 'post',
            path: '/auth/refresh',
            summary: 'Refresh access token',
            tags: ['Auth'],
            errorResponses: [
                MESSAGES.AUTH_TOKEN_NOT_PROVIDED,
                MESSAGES.AUTH_REFRESH_TOKEN_EXPIRED,
                MESSAGES.AUTH_REFRESH_TOKEN_INVALID
            ]
        }
    }
}