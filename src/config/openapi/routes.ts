import { postAuthLogin, postAuthRegister } from "@src/logic/model/auth/auth.schema";
import { ErrorMessage, MESSAGES } from "@src/logic/shared/utils/errors/errorMessages";
import { ZodObject } from "zod";

export interface OpenAPIRoute {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'trace';
    path: string;
    summary?: string;
    tags?: string[];
    requestSchema?: ZodObject<any>;
    responseSchema?: any,
    responses: ErrorMessage[]
}

// /AUTH/LOGIN
export const ROUTES: Record<string, Record<string, OpenAPIRoute>> = {
    AUTH: {
        LOGIN: {
            method: 'post',
            path: '/auth/login',
            summary: 'Log in user',
            tags: ['Auth'],
            requestSchema: postAuthLogin(),
            responses: [
                MESSAGES.AUTH_CREDENTIALS_INVALID,
            ]
        }, REGISTER: {
            method: 'post',
            path: '/auth/register',
            summary: 'Register user',
            tags: ['Auth'],
            requestSchema: postAuthRegister(),
            responses: [
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
            responses: [
                MESSAGES.AUTH_CREDENTIALS_INVALID,
                MESSAGES.AUTH_REFRESH_TOKEN_INVALID,
            ]
        }, REFRESH: {
            method: 'post',
            path: '/auth/refresh',
            summary: 'Refresh access token',
            tags: ['Auth'],
            responses: [
                MESSAGES.AUTH_TOKEN_NOT_PROVIDED,
                MESSAGES.AUTH_REFRESH_TOKEN_EXPIRED,
                MESSAGES.AUTH_REFRESH_TOKEN_INVALID
            ]
        }
    }
}