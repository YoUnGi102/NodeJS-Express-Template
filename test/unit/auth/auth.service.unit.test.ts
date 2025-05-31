import { Express } from 'express';
import authTokenUtils from '@src/logic/model/auth/utils/authUtils';
import {
  createTestUser,
  createTestUserRequest,
  TEST_PASSWORD,
} from '../../utils/factories';
import { ERRORS } from '@src/logic/shared/utils/errors';
import { setupApp } from '../setup';
import { container } from 'tsyringe';
import { IAuthService } from '@src/logic/model/auth/service/auth.service.interface';
import { INJECTION_TOKENS } from '@src/config';
import { AuthLoginRequest } from '@src/logic/model/auth/auth.types';
import hashUtils from '@src/logic/shared/utils/hashUtils';
import { ISessionRepository } from '@src/logic/model/session/repository/session.repository.interface';

let authService: IAuthService;
let sessionRepo: ISessionRepository;
let app: Express;

beforeAll(async () => {
  app = await setupApp();
  authService = container.resolve<IAuthService>(INJECTION_TOKENS.IAuthService);
  sessionRepo = container.resolve<ISessionRepository>(
    INJECTION_TOKENS.ISessionRepository,
  );
});

afterAll(async () => {});

describe('IAuthService - generateRefreshToken', () => {
  // TODO put in utils
  it('should return a different refresh token on each call', async () => {
    // Arrange
    const userUUID = 'test-user-uuid';

    // Act
    const token1 = authTokenUtils.signRefreshToken(userUUID);
    const token2 = authTokenUtils.signRefreshToken(userUUID);

    // Assert
    expect(typeof token1).toBe('string');
    expect(typeof token2).toBe('string');
    expect(token1).not.toEqual(token2);
  });

  it('should not accept old refresh token for refresh', async () => {
    // Arrange
    const userRequest = createTestUserRequest();
    const userCreated = await authService.register(userRequest);

    // Act
    const userRefreshed = await authService.refreshAccessToken(
      userCreated.refreshToken,
    );

    // Assert
    expect(userRefreshed.refreshToken).not.toEqual(userCreated.refreshToken);
    expect(
      authService.refreshAccessToken(userCreated.refreshToken),
    ).rejects.toThrow(ERRORS.AUTH.REFRESH_TOKEN_INVALID().message);
  });

  describe('IAuthService - login', () => {
    it('should create a session when user logs in', async () => {
      // Arrange
      const { user } = (await createTestUser(app))[0];
      const loginReq: AuthLoginRequest = {
        username: user.username,
        password: TEST_PASSWORD,
      };

      // Act
      const loginRes = await authService.login(loginReq);

      const hashedToken = hashUtils.sha256(loginRes.refreshToken);
      const session = await sessionRepo.findByToken(hashedToken);

      // Assert
      expect(session).toBeDefined();
      expect(session!.refreshToken).toEqual(hashedToken);
      expect(session!.user.username).toEqual(user.username);
      expect(loginRes).toHaveProperty('refreshToken');
    });
  });
});
