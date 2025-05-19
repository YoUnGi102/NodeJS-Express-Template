import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { INJECTION_TOKENS } from '@src/config';
import { IAuthService } from '../service/auth.service.interface';
import { IAuthController } from './auth.controller.interface';
import {
  AuthLoginRequest,
  AuthRefreshRequest,
  AuthRegisterRequest,
} from '../auth.types';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(INJECTION_TOKENS.IAuthService) private authService: IAuthService,
  ) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const authRequest = req.body as AuthLoginRequest;
      const auth = await this.authService.login(authRequest);
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
      const auth = await this.authService.register(authRequest);
      res.status(200).json(auth);
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
    throw new Error('Method not implemented.');
  }
}
