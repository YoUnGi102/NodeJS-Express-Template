import request from 'supertest';
import { Express } from 'express';
import { AuthRegisterRequest, AuthResponse } from '@model/auth/auth.types';
import { MESSAGES } from '@src/logic/shared/utils/errors/errorMessages';
import { User } from '@src/database/entities';
import { setupApp, destroyApp, testDataSource } from '../setup';
import { createTestUser, createTestUserRequest } from '../utils/factories';

let app: Express;
beforeAll(async () => {
  app = await setupApp();
});

afterAll(async () => {
  await destroyApp();
});

const userRepo = testDataSource.getRepository(User);

const BASE_URL = '/api/auth';
describe('POST /auth/register', () => {
  const AUTH_REGISTER_URL = `${BASE_URL}/register`;

  it('should register the user and return user info', async () => {
    // Arange
    const user = createTestUserRequest();

    // Act
    const res = await request(app).post(AUTH_REGISTER_URL).send(user);

    const userInDB = await userRepo.findOneBy({ uuid: res.body.user.uuid });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body).toEqual<AuthResponse>(
      expect.objectContaining({
        token: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          uuid: expect.any(String),
          username: user.username,
          email: user.email,
          createdAt: expect.any(String),
        }),
      }),
    );

    expect(userInDB).not.toBeNull();
    expect(userInDB!.id).toBeDefined();
    expect(userInDB!.username).toEqual(user.username);
    expect(userInDB!.email).toEqual(user.email);
    expect(userInDB!.password).not.toEqual(user.password); // Is HASHED?
  });

  it('should not create a user with a used username', async () => {
    // Arrange
    const { user } = (await createTestUser(app))[0];
    const req: AuthRegisterRequest = {
      username: user.username,
      email: 'test@gmail.com',
      password: 'Test123.+',
    };

    // Act
    const res = await request(app).post(AUTH_REGISTER_URL).send(req);

    expect(res.status).toBe(MESSAGES.AUTH_USERNAME_EXISTS.status);
    expect(res.body.title).toBe(MESSAGES.AUTH_USERNAME_EXISTS.title);
    expect(res.body.message).toBe(MESSAGES.AUTH_USERNAME_EXISTS.message);
  });

  it('should not create a user with a used email', async () => {
    // Arrange
    const { user } = (await createTestUser(app))[0];
    const req: AuthRegisterRequest = {
      username: 'OriginalUsername123',
      email: user.email,
      password: 'Test123.+',
    };

    // Act
    const res = await request(app).post(AUTH_REGISTER_URL).send(req);

    expect(res.status).toBe(MESSAGES.AUTH_EMAIL_EXISTS.status);
    expect(res.body.title).toBe(MESSAGES.AUTH_EMAIL_EXISTS.title);
    expect(res.body.message).toBe(MESSAGES.AUTH_EMAIL_EXISTS.message);
  });

  (
    [
      { field: 'username', message: MESSAGES.AUTH_USERNAME_EXISTS },
      { field: 'email', message: MESSAGES.AUTH_EMAIL_EXISTS },
    ] as const
  ).forEach(({ field, message }) => {
    it(`should not create a user with a used ${field}`, async () => {
      const { user } = (await createTestUser(app))[0];

      const requestBody = {
        username: field === 'username' ? user.username : 'UniqueUsername',
        email: field === 'email' ? user.email : 'unique@example.com',
        password: 'Test123.+',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(requestBody);

      expect(res.status).toBe(message.status);
      expect(res.body.title).toBe(message.title);
      expect(res.body.message).toBe(message.message);
    });
  });

  (['username', 'email', 'password'] as const).forEach((field) => {
    it(`should return 400 if ${field} is missing`, async () => {
      const invalidPayload = createTestUserRequest();
      delete invalidPayload[field];

      const res = await request(app)
        .post(AUTH_REGISTER_URL)
        .send(invalidPayload);

      expect(res.status).toBe(400);
    });
  });
});
