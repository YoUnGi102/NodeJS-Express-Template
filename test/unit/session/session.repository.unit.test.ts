import { Express } from 'express';
import { ISessionRepository } from '@src/logic/model/session/repository/session.repository.interface';
import { TypeormSessionRepository } from '@src/logic/model/session/repository/session.repository';
import {
  createTestSessionForUser,
  createTestUser,
} from '../../utils/factories';
import { setupUnit } from '../setup';
import { DataSource } from 'typeorm';
import { UserSession } from '@src/database/entities';

let sessionRepo: ISessionRepository;
let app: Express;
let testDataSource: DataSource;

beforeAll(async () => {
  const config = await setupUnit();
  app = config.app;
  testDataSource = config.testDataSource;
  sessionRepo = new TypeormSessionRepository(testDataSource);
});

afterAll(async () => {});

describe('ISessionRepository - createSession', () => {
  it('should create a session if valid user.UUID', async () => {
    // Arrange
    const { user } = (await createTestUser(app))[0];
    const refreshToken = 'Refresh token';
    const ipAddress = '102.229.30.1';
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

    // Act
    const session = await sessionRepo.createSession(
      user.uuid,
      refreshToken,
      ipAddress,
      userAgent,
    );

    // Assert
    expect(session).toBeDefined();
  });
});

describe('ISessionRepository - findByToken', () => {
  it('should return a valid session by refreshToken', async () => {
    // Arrange
    const { user } = (await createTestUser(app))[0];
    const session = await createTestSessionForUser(testDataSource, user.uuid);

    // Act
    const foundSession = await sessionRepo.findByToken(session.refreshToken);

    // Assert
    expect(foundSession).toBeDefined();
    expect(foundSession!.ipAddress).toEqual(session.ipAddress);
    expect(foundSession!.userAgent).toEqual(session.userAgent);
    expect(foundSession!.createdAt).toEqual(session.createdAt);
  });
});

describe('ISessionRepository - revokeSession', () => {
  it('should soft delete session if valid refreshToken passed', async () => {
    // Arrange
    const { user } = (await createTestUser(app))[0];
    const session = await createTestSessionForUser(testDataSource, user.uuid);

    // Act
    await sessionRepo.revokeSession(session.refreshToken);
    const foundSession = await sessionRepo.findByToken(session.refreshToken);

    // Assert
    expect(foundSession).toBeNull();
  });
});

describe('ISessionRepository - revokeAllForUser', () => {
  it('should soft delete session if valid refreshToken passed', async () => {
    // Arrange
    const { user } = (await createTestUser(app))[0];
    const sessions = await Promise.all(
      Array.from({ length: 5 }, async () =>
        createTestSessionForUser(testDataSource, user.uuid),
      ),
    );
    expect(sessions.length).toBe(5);

    // Act
    await sessionRepo.revokeAllForUser(user.uuid);
    const foundSession = await testDataSource
      .getRepository(UserSession)
      .findBy({ user: { uuid: user.uuid } });

    // Assert
    expect(foundSession.length).toEqual(0);
  });
});
