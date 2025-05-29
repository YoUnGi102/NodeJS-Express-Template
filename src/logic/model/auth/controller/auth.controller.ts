import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { INJECTION_TOKENS } from '@src/config';
import { IAuthService } from '../service/auth.service.interface';
import { IAuthController } from './auth.controller.interface';
import {
  AuthLoginRequest,
  AuthRefreshRequest,
  AuthRegisterRequest,
  AuthSessionInfo,
} from '../auth.types';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(INJECTION_TOKENS.IAuthService) private authService: IAuthService,
  ) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const authRequest = req.body as AuthLoginRequest;
      const sessionInfo: AuthSessionInfo = {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      };
      const auth = await this.authService.login(authRequest, sessionInfo);
      res.status(200).json(auth);
    } catch (err) {
      next(err);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = req.body as AuthRegisterRequest;
      const sessionInfo: AuthSessionInfo = {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      };
      const auth = await this.authService.register(authRequest, sessionInfo);
      res.status(201).json(auth);
    } catch (err) {
      next(err);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { refreshToken } = req.body as AuthRefreshRequest;
      const auth = await this.authService.refreshAccessToken(refreshToken);
      res.status(200).json(auth);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body as AuthRefreshRequest;
      await this.authService.logout(refreshToken);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
