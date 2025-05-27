import { Express } from 'express';
import { AuthRegisterRequest } from '../../src/logic/model/auth/auth.types';
import request from 'supertest';

export const createTestUserRequest = (
  userOverrides: Partial<AuthRegisterRequest> = {},
) => {
  const user: AuthRegisterRequest = {
    username: 'TestUser_' + Math.random().toString(36).substring(2, 8),
    email: 'test_' + Date.now() + '@example.com',
    password: 'Test123.+',
    ...userOverrides,
  };
  return user;
};

export const createTestUser = async (
  app: Express,
  userOverrides: Partial<AuthRegisterRequest> = {},
  count: number = 1,
) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = createTestUserRequest(userOverrides);
    const res = await request(app).post('/api/auth/register').send(user);

    if (res.status !== 201) {
      throw new Error(
        `Failed to create user: ${res.status} ${JSON.stringify(res.body)}`,
      );
    }
    users.push({ user, res: res.body });
  }

  return users;
};
