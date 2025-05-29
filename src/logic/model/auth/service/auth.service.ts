import jwt from 'jsonwebtoken';
import {
  AuthLoginRequest,
  AuthResponse,
  AuthRegisterRequest,
} from '../auth.types';
import { ERRORS } from '@src/logic/shared/utils/errors';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from './auth.service.interface';
import { JWTPayload } from '@src/logic/shared/types/auth.types';
import { toAuthResponse } from '../utils/helpers';
import logger from '@src/logic/shared/utils/logger';
import authTokenUtils from '../utils/authUtils';
import hashUtils from '@src/logic/shared/utils/hashUtils';
import { INJECTION_TOKENS } from '@src/config';
import { IAuthRepository } from '../repository/auth.repository.interface';
import { ISessionService } from '../../session/service/session.service.interface';
import { verifyRefreshToken } from '../../session/utils/helper';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(INJECTION_TOKENS.IAuthRepository) private authRepo: IAuthRepository,
    @inject(INJECTION_TOKENS.ISessionService) private sessionService: ISessionService
  ) {}

  async login({ username, password }: AuthLoginRequest): Promise<AuthResponse> {
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

    // TODO Add IP and User Agent
    const {refreshToken} = await this.sessionService.createSession(auth.uuid);

    return toAuthResponse(token, refreshToken, auth);
  }

  async register(request: AuthRegisterRequest): Promise<AuthResponse> {
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
    
    // TODO Add IP and User Agent
    const {refreshToken} = await this.sessionService.createSession(user.uuid);

    return toAuthResponse(token, refreshToken, user);
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    const jwtPayload = verifyRefreshToken(refreshToken);

    const user = await this.authRepo.getUserByUUID(jwtPayload.uuid);
    if (!user) {
      throw ERRORS.AUTH.USER_NOT_FOUND();
    }

    const isValid = await hashUtils.compare(refreshToken, user.refreshToken!);
    if (!isValid) {
      throw ERRORS.AUTH.REFRESH_TOKEN_INVALID();
    }

    const newRefreshToken = await this.generateRefreshToken(user.uuid);
    const token = authTokenUtils.signAccessToken(
      user.username,
      user.uuid,
      user.email,
    );

    const updatedUser = await this.authRepo.getUserByUUID(user.uuid);

    return toAuthResponse(token, newRefreshToken, updatedUser!);
  }

  async logout(refreshToken: string): Promise<void> {
    let jwtPayload: JWTPayload | null = null;
    try {
      jwtPayload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as JWTPayload;
    } catch (err) {
      // If expired, attempts to decode it
      const decoded = jwt.decode(refreshToken) as JWTPayload | null;

      if (decoded && decoded.uuid) {
        jwtPayload = decoded;
        logger.warn(
          `Expired refresh token used for logout, using decoded payload ${err}`,
        );
      } else {
        throw ERRORS.AUTH.REFRESH_TOKEN_INVALID();
      }
    }

    await this.authRepo.updateRefreshToken(jwtPayload.uuid, null);
  }

  // Generate, Hash and Save new Refresh Token
  private async generateRefreshToken(userUUID: string): Promise<string> {
    const refreshToken = authTokenUtils.signRefreshToken(userUUID);

    // Update Hashed Refresh Token
    const hashedRefreshToken = await hashUtils.hash(refreshToken, 10);
    await this.authRepo.updateRefreshToken(userUUID, hashedRefreshToken);

    return refreshToken;
  }
}
