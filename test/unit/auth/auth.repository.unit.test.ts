import { INJECTION_TOKENS } from "@src/config";
import {
	AuthDTO,
	AuthRegisterRequest,
	AuthResponse,
} from "@src/logic/model/auth/auth.types";
import { IAuthRepository } from "@src/logic/model/auth/repository/auth.repository.interface";
import { createTestUser, createTestUserRequest } from "@test/utils/factories";
import { Express } from "express";
import { container } from "tsyringe";
import { setupApp } from "../setup";

let authRepository: IAuthRepository;
let app: Express;

beforeAll(async () => {
	app = await setupApp();
	authRepository = container.resolve<IAuthRepository>(
		INJECTION_TOKENS.IAuthRepository,
	);
});

afterAll(async () => {});

describe("IAuthRepository", () => {
	describe("findByUUID", () => {
		it("should return user if valid UUID passed", async () => {
			// Arrange
			const { user }: AuthResponse = (await createTestUser(app))[0];

			// Act
			const userFound = await authRepository.findByUUID(user.uuid);

			// Assert
			expect(userFound).toBeDefined();
			expect(userFound).toMatchObject(
				expect.objectContaining<AuthDTO>({
					id: expect.any(Number),
					username: expect.any(String),
					uuid: expect.any(String),
					email: expect.any(String),
					password: undefined,
					createdAt: expect.any(Date),
				}),
			);
		});

		// TODO 'should not return user if user exists but is deleted'
		// TODO 'should not return user if user exists but is not active'
	});

	describe("findByUsernameOrEmail", () => {
		it("should return user if user exists", async () => {
			// Arrange
			const { user }: AuthResponse = (await createTestUser(app))[0];

			// Act
			const userFound = await authRepository.findByUsernameOrEmail(
				user.username,
				user.email,
			);

			// Assert
			expect(userFound).toBeDefined();
			expect(userFound).toMatchObject(
				expect.objectContaining<AuthDTO>({
					id: expect.any(Number),
					username: expect.any(String),
					uuid: expect.any(String),
					email: expect.any(String),
					password: undefined,
					createdAt: expect.any(Date),
				}),
			);
		});

		it("should return null if user doesn't exist", async () => {
			// Arrange
			const username = "John Doe";
			const email = "john.doe@example.com";

			// Act
			const userFound = await authRepository.findByUsernameOrEmail(
				username,
				email,
			);

			// Assert
			expect(userFound).toBeNull();
		});
	});

	describe("getUserWithPassword", () => {
		it("should return a user with password if valid username", async () => {
			// Arrange
			const { user }: AuthResponse = (await createTestUser(app))[0];

			// Act
			const userFound = await authRepository.findByUsernameWithPassword(
				user.username,
			);

			// Assert
			expect(userFound).toBeDefined();
			expect(userFound).toMatchObject(
				expect.objectContaining<AuthDTO>({
					id: expect.any(Number),
					username: expect.any(String),
					uuid: expect.any(String),
					email: expect.any(String),
					password: expect.any(String),
					createdAt: expect.any(Date),
				}),
			);
		});
	});

	describe("create", () => {
		it("should create user if valid request provided", async () => {
			// Arrange
			const userRequest: AuthRegisterRequest = createTestUserRequest();

			// Act
			const userCreated = await authRepository.create(userRequest);

			// Assert
			expect(userCreated).toBeDefined();
			expect(userCreated).toMatchObject(
				expect.objectContaining<AuthDTO>({
					id: expect.any(Number),
					username: expect.any(String),
					uuid: expect.any(String),
					email: expect.any(String),
					password: expect.any(String),
					createdAt: expect.any(Date),
				}),
			);
		});
	});
});
