import { Express } from 'express';
import { ISessionService } from '@src/logic/model/session/service/session.service.interface';
import { setupApp } from '../setup';
import { container } from 'tsyringe';
import { INJECTION_TOKENS } from '@src/config';
import { createTestUser } from '@test/utils/factories';
import hashUtils from '@src/logic/shared/utils/hashUtils';
import { ISessionRepository } from '@src/logic/model/session/repository/session.repository.interface';

let sessionService: ISessionService;
let sessionRepo: ISessionRepository;
let app: Express;

beforeAll(async () => {
  app = await setupApp();
  sessionService = container.resolve<ISessionService>(
    INJECTION_TOKENS.ISessionService,
  );
  sessionRepo = container.resolve<ISessionRepository>(
    INJECTION_TOKENS.ISessionRepository,
  );
});

afterAll(async () => {});

describe('ISessionService', () => {
  describe('rotateRefreshToken', () => {
    it('should return a new token if valid refresh token provided', async () => {
      // Arrange
      const { user, refreshToken } = (await createTestUser(app))[0];

      const newToken = await sessionService.rotateRefreshToken(
        user.uuid,
        refreshToken,
      );

      // Act
      const session = await sessionRepo.findByToken(hashUtils.sha256(newToken));

      // Assert
      expect(newToken).not.toEqual(refreshToken);
      expect(hashUtils.sha256(newToken)).toEqual(session!.refreshToken);
      expect(hashUtils.sha256(refreshToken)).not.toEqual(session!.refreshToken);
    });
  });
});
