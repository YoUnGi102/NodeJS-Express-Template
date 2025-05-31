import { Express } from 'express';
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
import {
  AuthLoginRequest,
  AuthResponse,
} from '@src/logic/model/auth/auth.types';
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

describe('IAuthService', () => {
  describe('register', () => {
    it('should create a user if request is valid', async () => {
      // Arrange
      const userRequest = createTestUserRequest();

      // Act
      const authResponse: AuthResponse =
        await authService.register(userRequest);

      // Assert
      expect(authResponse).toBeDefined();
      expect(authResponse.user).toBeDefined();
      expect(authResponse.user.username).toEqual(userRequest.username);
    });
  });

  describe('generateRefreshToken', () => {
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

    describe('login', () => {
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
});
