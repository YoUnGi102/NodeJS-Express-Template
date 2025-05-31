import { Express } from 'express';
import { ISessionRepository } from '@src/logic/model/session/repository/session.repository.interface';
import {
  createTestSessionForUser,
  createTestUser,
} from '../../utils/factories';
import { setupApp } from '../setup';
import { AuthResponse } from '@src/logic/model/auth/auth.types';
import { UserSessionRequest } from '@src/logic/model/session/session.types';
import { container } from 'tsyringe';
import { INJECTION_TOKENS } from '@src/config';

let sessionRepo: ISessionRepository;
let app: Express;

beforeAll(async () => {
  app = await setupApp();
  sessionRepo = container.resolve(INJECTION_TOKENS.ISessionRepository);
});

afterAll(async () => {});

describe('ISessionRepository', () => {
  describe('create', () => {
    it('should create a session if valid user.UUID', async () => {
      // Arrange
      const { user }: AuthResponse = (await createTestUser(app))[0];

      const sessionRequest: UserSessionRequest = {
        userUUID: user.uuid,
        refreshToken: 'Refresh token',
        ipAddress: '102.229.30.1',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      };

      // Act
      const session = await sessionRepo.create(sessionRequest);

      // Assert
      expect(session).toBeDefined();
    });
  });

  describe('findByToken', () => {
    it('should return a valid session by refreshToken', async () => {
      // Arrange
      const { user }: AuthResponse = (await createTestUser(app))[0];
      const session = await createTestSessionForUser(sessionRepo, user.uuid);

      // Act
      const foundSession = await sessionRepo.findByToken(session.refreshToken);

      // Assert
      expect(foundSession).toBeDefined();
      expect(foundSession!.ipAddress).toEqual(session.ipAddress);
      expect(foundSession!.userAgent).toEqual(session.userAgent);
      expect(foundSession!.createdAt).toEqual(session.createdAt);
    });
  });

  describe('delete', () => {
    it('should soft delete session if valid refreshToken passed', async () => {
      // Arrange
      const { user }: AuthResponse = (await createTestUser(app))[0];
      const session = await createTestSessionForUser(sessionRepo, user.uuid);

      // Act
      await sessionRepo.delete(session.refreshToken);
      const foundSession = await sessionRepo.findByToken(session.refreshToken);

      // Assert
      expect(foundSession).toBeNull();
    });
  });

  describe('deleteAllForUser', () => {
    it('should soft delete session if valid refreshToken passed', async () => {
      // Arrange
      const { user }: AuthResponse = (await createTestUser(app))[0];
      const sessions = await Promise.all(
        Array.from({ length: 5 }, async () =>
          createTestSessionForUser(sessionRepo, user.uuid),
        ),
      );

      // Act
      await sessionRepo.deleteAllForUser(user.uuid);
      const foundSession = await sessionRepo.getActiveSessions(user.uuid);

      // Assert
      expect(sessions.length).toBe(5);
      expect(foundSession.length).toEqual(0);
    });
  });
});
