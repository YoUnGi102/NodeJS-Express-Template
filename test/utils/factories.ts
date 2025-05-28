import { Express } from 'express';
import {
  AuthRegisterRequest,
  AuthResponse,
} from '../../src/logic/model/auth/auth.types';
import request from 'supertest';
import authUtils from '@src/logic/model/auth/utils/authUtils';
import { DataSource } from 'typeorm';
import { User, UserSession } from '@src/database/entities';

export const TEST_PASSWORD = 'Test123.+';

export const createTestUserRequest = (
  userOverrides: Partial<AuthRegisterRequest> = {},
) => {
  const user: AuthRegisterRequest = {
    username: 'TestUser_' + Math.random().toString(36).substring(2, 8),
    email: 'test_' + Date.now() + '@example.com',
    password: TEST_PASSWORD,
    ...userOverrides,
  };
  return user;
};

export const createTestUser = async (
  app: Express,
  userOverrides: Partial<AuthRegisterRequest> = {},
  count: number = 1,
): Promise<AuthResponse[]> => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = createTestUserRequest(userOverrides);
    const res = await request(app).post('/api/auth/register').send(user);

    if (res.status !== 201) {
      throw new Error(
        `Failed to create user: ${res.status} ${JSON.stringify(res.body)}`,
      );
    }
    users.push(res.body);
  }

  return users;
};

export const createTestSessionForUser = async (
  dataSource: DataSource,
  userUUID: string,
) => {
  const user = await dataSource
    .getRepository(User)
    .findOneByOrFail({ uuid: userUUID });
  const sessionCreate = dataSource.getRepository(UserSession).create({
    user,
    ipAddress: '102.229.30.1',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    refreshToken: authUtils.signRefreshToken(userUUID),
  });
  const session = await dataSource
    .getRepository(UserSession)
    .save(sessionCreate);
  return session;
};
