import authUtils from "@src/logic/model/auth/utils/authUtils";
import { ISessionRepository } from "@src/logic/model/session/repository/session.repository.interface";
import { Express } from "express";
import request from "supertest";
import {
	AuthRegisterRequest,
	AuthSessionInfo,
	InternalAuthResponse,
} from "../../src/logic/model/auth/auth.types";
import { extractCookie } from "./helpers";

export const TEST_PASSWORD = "Test123.+";

export const SESSION_INFO: AuthSessionInfo = {
	ipAddress: "102.229.30.1",
	userAgent:
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
};

export const createTestUserRequest = (
	userOverrides: Partial<AuthRegisterRequest> = {},
) => {
	const user: AuthRegisterRequest = {
		username: `TestUser_${Math.random().toString(36).substring(2, 8)}`,
		email: `test_${Date.now()}@example.com`,
		password: TEST_PASSWORD,
		...userOverrides,
	};
	return user;
};

export const createTestUser = async (
	app: Express,
	userOverrides: Partial<AuthRegisterRequest> = {},
	count = 1,
): Promise<InternalAuthResponse[]> => {
	const users = [];
	for (let i = 0; i < count; i++) {
		const user = createTestUserRequest(userOverrides);
		const res = await request(app).post("/auth/register").send(user);

		const refreshToken = extractCookie(res, "jid");

		if (res.status !== 201) {
			throw new Error(
				`Failed to create user: ${res.status} ${JSON.stringify(res.body)}`,
			);
		}
		users.push({ ...res.body, refreshToken });
	}

	return users;
};

export const createTestSessionForUser = async (
	sessionRepo: ISessionRepository,
	userUUID: string,
) => {
	const session = await sessionRepo.create({
		...SESSION_INFO,
		userUUID: userUUID,
		refreshToken: authUtils.signRefreshToken(userUUID),
	});
	return session;
};

export const generateMockUUID = (): string => {
	return crypto.randomUUID();
};

export const generateMockJWT = (): string => {
	const base64url = () =>
		Buffer.from(Math.random().toString(36).substring(2))
			.toString("base64")
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");

	return `${base64url()}.${base64url()}.${base64url()}`;
};
