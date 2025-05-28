import {Express} from 'express';
import { TypeormAuthRepository } from '@src/logic/model/auth/repository/auth.repository';
import { AuthService } from '@src/logic/model/auth/service/auth.service';
import authTokenUtils from '@src/logic/model/auth/utils/authUtils';
import { createTestUserRequest } from '../../utils/factories';
import { ERRORS } from '@src/logic/shared/utils/errors';
import { setupUnit } from '../setup';

let authRepository: TypeormAuthRepository;
let authService: AuthService;
let app: Express;

beforeAll(async () => {
  const config = await setupUnit();
  app = config.app;
  authRepository = new TypeormAuthRepository(config.testDataSource);
  authService = new AuthService(authRepository);
});

afterAll(async () => {});

describe('AuthService - generateRefreshToken', () => {
  it('should return a different refresh token on each call', async () => {
    const userUUID = 'test-user-uuid';

    const token1 = authTokenUtils.signRefreshToken(userUUID);
    const token2 = authTokenUtils.signRefreshToken(userUUID);

    expect(typeof token1).toBe('string');
    expect(typeof token2).toBe('string');
    expect(token1).not.toEqual(token2);
  });

  it('should not accept old refresh token for refresh', async () => {
    const userRequest = createTestUserRequest();
    const userCreated = await authService.register(userRequest);
    const userRefreshed = await authService.refreshAccessToken(
      userCreated.refreshToken,
    );

    expect(userRefreshed.refreshToken).not.toEqual(userCreated.refreshToken);
    expect(
      authService.refreshAccessToken(userCreated.refreshToken),
    ).rejects.toThrow(ERRORS.AUTH.REFRESH_TOKEN_INVALID().message);
  });
});
