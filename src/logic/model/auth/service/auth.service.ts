import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from '../repository/auth.repository';
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

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(AuthRepository) private authRepo: AuthRepository) {}

  async login({ username, password }: AuthLoginRequest): Promise<AuthResponse> {
    const auth = await this.authRepo.getUserWithPassword(username);
    if(!auth){
      throw ERRORS.AUTH.CREDENTIALS_INVALID();
    }

    // Check if password is valid
    const isValid = await bcrypt.compare(password, auth.password!);
    if (!isValid) {
      throw ERRORS.AUTH.CREDENTIALS_INVALID();
    }

    const token = this.generateAccessToken(
      auth.username,
      auth.uuid,
      auth.email,
    );
    const refreshToken = await this.generateRefreshToken(auth.uuid);

    return toAuthResponse(token, refreshToken, auth);
  }

  async register(request: AuthRegisterRequest): Promise<AuthResponse> {
    const user = await this.authRepo.registerUser(request);
    if (!user) {
      throw ERRORS.AUTH.REGISTRATION_FAILED();
    }

    const token = this.generateAccessToken(
      user.username,
      user.uuid,
      user.email,
    );
    const refreshToken = await this.generateRefreshToken(user.uuid);

    return toAuthResponse(token, refreshToken, user);
  }

  // TODO Fix - New token is not saved
  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    let jwtPayload;
    try {
      jwtPayload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as JWTPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw ERRORS.AUTH.ACCESS_TOKEN_EXPIRED();
      }
      throw err;
    }

    logger.debug(JSON.stringify(jwtPayload))

    const user = await this.authRepo.getUserByUUID(jwtPayload.uuid);
    if (!user) {
      throw ERRORS.AUTH.USER_NOT_FOUND();
    }

    logger.warn(JSON.stringify({refreshToken, user:user.refreshToken}));

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken!);
    if (!isValid) {
      throw ERRORS.AUTH.REFRESH_TOKEN_INVALID();
    }

    logger.debug(JSON.stringify(user))

    const newRefreshToken = await this.generateRefreshToken(user.uuid);
    const token = this.generateAccessToken(
      user.username,
      user.uuid,
      user.email,
    );

    return toAuthResponse(token, newRefreshToken, user);
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
          'Expired refresh token used for logout, using decoded payload',
        );
      } else {
        ERRORS.AUTH.REFRESH_TOKEN_INVALID();
      }
    }

    await this.authRepo.updateRefreshToken(refreshToken, null);
  }

  // Generate new Access Token
  private generateAccessToken(username: string, uuid: string, email: string) {
    const token = jwt.sign(
      { username, uuid, email },
      process.env.JWT_ACCESS_SECRET!,
      {
        expiresIn: (process.env.JWT_ACCESS_EXPIRATION ||
          '1h') as jwt.SignOptions['expiresIn'],
      },
    );
    return token;
  }

  // Generate new Refresh Token
  private async generateRefreshToken(userUUID: string): Promise<string> {
    const refreshToken = jwt.sign(
      {
        uuid: userUUID,
        tokenUUID: uuidv4(),
        type: 'refresh',
      },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: (process.env.JWT_ACCESS_EXPIRATION ||
          '7d') as jwt.SignOptions['expiresIn'],
      },
    );

    // Update Hashed Refresh Token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.authRepo.updateRefreshToken(userUUID, hashedRefreshToken);

    return refreshToken;
  }
}
