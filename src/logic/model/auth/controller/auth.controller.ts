import { INJECTION_TOKENS } from "@src/config";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
	AuthLoginRequest,
	AuthRefreshRequest,
	AuthRegisterRequest,
	AuthResponse,
	AuthSessionInfo,
} from "../auth.types";
import { IAuthService } from "../service/auth.service.interface";
import { IAuthController } from "./auth.controller.interface";

@injectable()
export class AuthController implements IAuthController {
	constructor(
		@inject(INJECTION_TOKENS.IAuthService) private authService: IAuthService,
	) {}

	async login(req: Request, res: Response<AuthResponse>, next: NextFunction) {
		try {
			const authRequest = req.body as AuthLoginRequest;
			const sessionInfo: AuthSessionInfo = this.getSessionInfo(req);
			const auth = await this.authService.login(authRequest, sessionInfo);
			res.status(200).json(auth);
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
			const auth = await this.authService.register(authRequest, sessionInfo);
			res.status(201).json(auth);
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
			res.status(204).json();
		} catch (err) {
			next(err);
		}
	}

	private getSessionInfo(req: Request): AuthSessionInfo {
		return {
			ipAddress: req.ip,
			userAgent: req.get("User-Agent"),
		};
	}
}
