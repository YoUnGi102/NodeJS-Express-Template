import {
  AuthLoginRequest,
  AuthResponse,
  AuthRegisterRequest,
  AuthSessionInfo,
} from '../auth.types';
import { ERRORS } from '@src/logic/shared/utils/errors';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from './auth.service.interface';
import { toAuthResponse } from '../utils/helpers';
import authTokenUtils from '../utils/authUtils';
import hashUtils from '@src/logic/shared/utils/hashUtils';
import { INJECTION_TOKENS } from '@src/config';
import { IAuthRepository } from '../repository/auth.repository.interface';
import { ISessionService } from '../../session/service/session.service.interface';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(INJECTION_TOKENS.IAuthRepository) private authRepo: IAuthRepository,
    @inject(INJECTION_TOKENS.ISessionService)
    private sessionService: ISessionService,
  ) {}

  async login({ username, password }: AuthLoginRequest, {ipAddress, userAgent}: AuthSessionInfo): Promise<AuthResponse> {
    const auth = await this.authRepo.getUserWithPassword(username);
    if (!auth) {
      throw ERRORS.AUTH.CREDENTIALS_INVALID();
    }

    // Check if password is valid
    const isValid = await hashUtils.compare(password, auth.password!);
    if (!isValid) {
      throw ERRORS.AUTH.CREDENTIALS_INVALID();
    }

    const token = authTokenUtils.signAccessToken(
      auth.username,
      auth.uuid,
      auth.email,
    );

    const { refreshToken } = await this.sessionService.createSession(auth.uuid, ipAddress, userAgent);

    return toAuthResponse(token, refreshToken, auth);
  }

  async register(request: AuthRegisterRequest, {ipAddress, userAgent}: AuthSessionInfo): Promise<AuthResponse> {
    const userExists = await this.authRepo.checkUserExists(
      request.username,
      request.email,
    );
    if (userExists && userExists.username === request.username) {
      throw ERRORS.AUTH.USERNAME_EXISTS();
    } else if (userExists && userExists.email === request.email) {
      throw ERRORS.AUTH.EMAIL_EXISTS();
    }

    const hashedPassword = await hashUtils.hash(request.password, 10);
    request.password = hashedPassword;

    const user = await this.authRepo.registerUser(request);
    if (!user) {
      throw ERRORS.AUTH.REGISTRATION_FAILED();
    }

    const token = authTokenUtils.signAccessToken(
      user.username,
      user.uuid,
      user.email,
    );

    const { refreshToken } = await this.sessionService.createSession(user.uuid, ipAddress, userAgent);

    return toAuthResponse(token, refreshToken, user);
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    const session = await this.sessionService.findByToken(refreshToken);

    const user = await this.authRepo.getUserByUUID(session.user.uuid);
    if (!user) {
      throw ERRORS.AUTH.USER_NOT_FOUND();
    }

    const newRefreshToken = await this.sessionService.rotateRefreshToken(
      user.uuid,
      refreshToken,
    );

    const token = authTokenUtils.signAccessToken(
      user.username,
      user.uuid,
      user.email,
    );

    const updatedUser = await this.authRepo.getUserByUUID(user.uuid);

    return toAuthResponse(token, newRefreshToken, updatedUser!);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.sessionService.revokeSession(refreshToken);
  }
}
