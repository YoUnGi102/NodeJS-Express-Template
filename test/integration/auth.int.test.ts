import request from "supertest";
import { Express } from "express";
import { AuthRegisterRequest, AuthResponse } from "@model/auth/auth.types";
import { MESSAGES } from "@src/logic/shared/utils/errors/errorMessages";
import { User, UserSession } from "@src/database/entities";
import { setupIntegration } from "./setup";
import {
	createTestUser,
	createTestUserRequest,
	TEST_PASSWORD,
} from "../utils/factories";
import authTokenUtils from "@src/logic/model/auth/utils/authUtils";
import { Repository } from "typeorm";
import hashUtils from "@src/logic/shared/utils/hashUtils";

let app: Express;
let userRepo: Repository<User>;
let sessionRepo: Repository<UserSession>;

beforeAll(async () => {
	const config = await setupIntegration();
	app = config.app;
	userRepo = config.testDataSource.getRepository(User);
	sessionRepo = config.testDataSource.getRepository(UserSession);
});

afterAll(async () => {});

const BASE_URL = "/api/auth";
describe("POST /auth/register", () => {
	const AUTH_REGISTER_URL = `${BASE_URL}/register`;

	it("should register the user and return user info", async () => {
		// Arange
		const userRequest = createTestUserRequest();

		// Act
		const res = await request(app).post(AUTH_REGISTER_URL).send(userRequest);

		// Assert
		const userInDB = await userRepo.findOneBy({ uuid: res.body.user.uuid });
		expect(res.status).toBe(201);
		expect(res.body).toBeDefined();
		expect(res.body).toEqual<AuthResponse>(
			expect.objectContaining({
				token: expect.any(String),
				refreshToken: expect.any(String),
				user: expect.objectContaining({
					uuid: expect.any(String),
					username: userRequest.username,
					email: userRequest.email,
					createdAt: expect.any(String),
				}),
			}),
		);

		expect(userInDB).not.toBeNull();
		expect(userInDB!.id).toBeDefined();
		expect(userInDB!.username).toEqual(userRequest.username);
		expect(userInDB!.email).toEqual(userRequest.email);
		expect(userInDB!.password).not.toEqual(userRequest.password); // Is HASHED?
	});

	it("should not create a user with a used username", async () => {
		// Arrange
		const { user } = (await createTestUser(app))[0];
		const req: AuthRegisterRequest = {
			username: user.username,
			email: "test@gmail.com",
			password: "Test123.+",
		};

		// Act
		const res = await request(app).post(AUTH_REGISTER_URL).send(req);

		expect(res.status).toBe(MESSAGES.AUTH_USERNAME_EXISTS.status);
		expect(res.body.title).toBe(MESSAGES.AUTH_USERNAME_EXISTS.title);
		expect(res.body.message).toBe(MESSAGES.AUTH_USERNAME_EXISTS.message);
	});

	it("should not create a user with a used email", async () => {
		// Arrange
		const { user } = (await createTestUser(app))[0];
		const req: AuthRegisterRequest = {
			username: "OriginalUsername123",
			email: user.email,
			password: "Test123.+",
		};

		// Act
		const res = await request(app).post(AUTH_REGISTER_URL).send(req);

		expect(res.status).toBe(MESSAGES.AUTH_EMAIL_EXISTS.status);
		expect(res.body.title).toBe(MESSAGES.AUTH_EMAIL_EXISTS.title);
		expect(res.body.message).toBe(MESSAGES.AUTH_EMAIL_EXISTS.message);
	});

	(
		[
			{ field: "username", message: MESSAGES.AUTH_USERNAME_EXISTS },
			{ field: "email", message: MESSAGES.AUTH_EMAIL_EXISTS },
		] as const
	).forEach(({ field, message }) => {
		it(`should not create a user with a used ${field}`, async () => {
			// Arrange
			const { user } = (await createTestUser(app))[0];
			const requestBody = {
				username: field === "username" ? user.username : "UniqueUsername",
				email: field === "email" ? user.email : "unique@example.com",
				password: "Test123.+",
			};

			// Act
			const res = await request(app)
				.post("/api/auth/register")
				.send(requestBody);

			// Assert
			expect(res.status).toBe(message.status);
			expect(res.body.title).toBe(message.title);
			expect(res.body.message).toBe(message.message);
		});
	});

	(["username", "email", "password"] as const).forEach((field) => {
		it(`should return 400 if ${field} is missing`, async () => {
			// Arrange
			const invalidPayload = createTestUserRequest();
			delete invalidPayload[field];

			// Act
			const res = await request(app)
				.post(AUTH_REGISTER_URL)
				.send(invalidPayload);

			// Assert
			expect(res.status).toBe(400);
			expect(res.body.title).toBe("BAD_REQUEST");
		});
	});

	it("should create a session when user registers", async () => {
		const { user, refreshToken } = (await createTestUser(app))[0];

		const session = await sessionRepo.findOne({
			where: { refreshToken: hashUtils.sha256(refreshToken) },
			relations: ["user"],
		});
		expect(session).toBeDefined();
		expect(session!.user.username).toEqual(user.username);
	});
});

describe("POST auth/login", () => {
	const POST_AUTH_LOGIN = `${BASE_URL}/login`;

	it("should log in user with correct credentials and return user info", async () => {
		// Arrange
		const { user } = (await createTestUser(app))[0];

		// Act
		const res = await request(app)
			.post(POST_AUTH_LOGIN)
			.send({ username: user.username, password: TEST_PASSWORD });

		// Assert
		expect(res.status).toBe(200);
		expect(res.body.user).toEqual(user);
	});

	it("should log in user with correct credentials and return valid auth token", async () => {
		// Arrange
		const { user } = (await createTestUser(app))[0];

		// Act
		const res = await request(app)
			.post(POST_AUTH_LOGIN)
			.send({ username: user.username, password: TEST_PASSWORD });

		const token = res.body.token;
		const payload = authTokenUtils.verifyAccessToken(token);

		expect(res.status).toBe(200);
		expect(token).toBeDefined();
		expect(payload).toEqual(
			expect.objectContaining({
				username: user.username,
				email: user.email,
				uuid: user.uuid,
				iat: expect.any(Number),
				exp: expect.any(Number),
			}),
		);
	});

	it("should return new access and refresh token after successfull login", async () => {
		// Arrange
		const { user, refreshToken, token } = (await createTestUser(app))[0];

		// Act
		const res = await request(app)
			.post(POST_AUTH_LOGIN)
			.send({ username: user.username, password: TEST_PASSWORD });

		const newRefreshToken = res.body.refreshToken;
		const newAccessToken = res.body.token;

		expect(newRefreshToken).not.toEqual(refreshToken);
		expect(newAccessToken).not.toEqual(token);
	});

	it("should return 401 if password is incorrect", async () => {
		const { user } = (await createTestUser(app))[0];

		const res = await request(app)
			.post(POST_AUTH_LOGIN)
			.send({ username: user.username, password: "wrongPassword" });

		const { status, message, title } = MESSAGES.AUTH_CREDENTIALS_INVALID;

		expect(res.status).toBe(status);
		expect(res.body).toEqual(
			expect.objectContaining({
				message,
				title,
			}),
		);
	});

	it("should return 401 if username is incorrect", async () => {
		const res = await request(app)
			.post(POST_AUTH_LOGIN)
			.send({ username: "user", password: "wrongPassword" });

		const { status, message, title } = MESSAGES.AUTH_CREDENTIALS_INVALID;

		expect(res.status).toBe(status);
		expect(res.body).toEqual(
			expect.objectContaining({
				message,
				title,
			}),
		);
	});

	it("should create a session with correct user-agent and IP address", async () => {
		const userAgent = "jest-test-agent";
		const fakeIP = "123.45.67.89";
		const { user } = (await createTestUser(app))[0];

		const res = await request(app)
			.post(POST_AUTH_LOGIN)
			.set("User-Agent", userAgent)
			.set("X-Forwarded-For", fakeIP)
			.send({
				username: user.username,
				password: TEST_PASSWORD,
			});

		// fetch the session from DB
		const hashedToken = hashUtils.sha256(res.body.refreshToken);
		const session = await sessionRepo.findOneBy({ refreshToken: hashedToken });

		expect(session!.userAgent).toBe(userAgent);
		expect(session!.ipAddress).toBe(fakeIP);
	});
});

describe("POST /auth/refresh", () => {
	const POST_AUTH_REFRESH = `${BASE_URL}/refresh`;

	it("should return new refresh and access token", async () => {
		// Arrange
		const { refreshToken, token } = (await createTestUser(app))[0];

		// Act
		const res = await request(app)
			.post(POST_AUTH_REFRESH)
			.send({ refreshToken });

		// Assert
		expect(res.body.token).toBeDefined();
		expect(res.body.refreshToken).toBeDefined();
		expect(res.body.token).not.toEqual(token);
		expect(res.body.refreshToken).not.toEqual(refreshToken);
	});

	it("should return 401 if invalid refresh token is passed", async () => {
		// Arrange
		const { refreshToken } = (await createTestUser(app))[0];

		await request(app).post(POST_AUTH_REFRESH).send({ refreshToken });

		// Act
		const res = await request(app)
			.post(POST_AUTH_REFRESH)
			.send({ refreshToken });

		// Assert
		const { status, message, title } = MESSAGES.AUTH_REFRESH_TOKEN_INVALID;
		expect(res.status).toBe(status);
		expect(res.body).toEqual(
			expect.objectContaining({
				message,
				title,
			}),
		);
	});
});

describe("POST /auth/logout", () => {
	const POST_AUTH_LOGOUT = `${BASE_URL}/logout`;

	it("it should invalidate the session when user logs out", async () => {
		// Arrange
		const { refreshToken } = (await createTestUser(app))[0];

		// Act
		const res = await request(app)
			.post(POST_AUTH_LOGOUT)
			.send({ refreshToken });

		const session = await sessionRepo.findOneBy({
			refreshToken: hashUtils.sha256(refreshToken),
		});

		// Assert
		expect(res.status).toBe(204);
		expect(session).toBeNull();
	});

	it("should return 401 if refresh token is invalid", async () => {
		// Act
		const res = await request(app)
			.post(POST_AUTH_LOGOUT)
			.send({ refreshToken: "Invalid refresh token" });
		const { message, title, status } = MESSAGES.AUTH_REFRESH_TOKEN_INVALID;

		// Assert
		expect(res.status).toBe(status);
		expect(res.body.message).toBe(message);
		expect(res.body.title).toBe(title);
	});
});
