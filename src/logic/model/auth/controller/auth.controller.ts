import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { INJECTION_TOKENS } from '@src/config';
import { IAuthService } from '../service/auth.service.interface';
import { IAuthController } from './auth.controller.interface';
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthSessionInfo,
  AuthResponse,
} from '../auth.types';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(INJECTION_TOKENS.IAuthService) private authService: IAuthService,
  ) {}

  async login(req: Request, res: Response<AuthResponse>, next: NextFunction) {
    try {
      const authRequest = req.body as AuthLoginRequest;
      const sessionInfo: AuthSessionInfo = this.getSessionInfo(req);
      const internal = await this.authService.login(authRequest, sessionInfo);
      this.attachRefreshToken(res, internal.refreshToken);
      const response = { token: internal.token, user: internal.user };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async register(
    req: Request,
    res: Response<AuthResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = req.body as AuthRegisterRequest;
      const sessionInfo: AuthSessionInfo = this.getSessionInfo(req);
      const internal = await this.authService.register(
        authRequest,
        sessionInfo,
      );
      this.attachRefreshToken(res, internal.refreshToken);
      const response = { token: internal.token, user: internal.user };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  async refresh(
    req: Request,
    res: Response<AuthResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.jid;
      const internal = await this.authService.refreshAccessToken(refreshToken);
      this.attachRefreshToken(res, internal.refreshToken);
      const response = { token: internal.token, user: internal.user };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.jid;
      await this.authService.logout(refreshToken);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  private attachRefreshToken(res: Response, token: string) {
    res.cookie('jid', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
  }

  private getSessionInfo(req: Request): AuthSessionInfo {
    return {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    };
  }
}
