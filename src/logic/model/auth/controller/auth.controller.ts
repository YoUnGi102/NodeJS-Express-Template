import { INJECTION_TOKENS } from "@src/config";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthResponse, AuthSessionInfo } from "../auth.types";
import { IAuthService } from "../service/auth.service.interface";
import { IAuthController } from "./auth.controller.interface";

@injectable()
export class AuthController implements IAuthController {
	constructor(
		@inject(INJECTION_TOKENS.IAuthService) private authService: IAuthService,
	) {}

	async login(req: Request, res: Response<AuthResponse>) {
		const authRequest = req.body;
		const sessionInfo: AuthSessionInfo = this.getSessionInfo(req);
		const auth = await this.authService.login(authRequest, sessionInfo);
		res.status(200).json(auth);
	}

	async register(
		req: Request,
		res: Response<AuthResponse>,
	): Promise<void> {
		const authRequest = req.body;
		const sessionInfo: AuthSessionInfo = this.getSessionInfo(req);
		const auth = await this.authService.register(authRequest, sessionInfo);
		res.status(201).json(auth);
	}

	async refresh(
		req: Request,
		res: Response<AuthResponse>,
	): Promise<void> {
		const { refreshToken } = req.body;
		const auth = await this.authService.refreshAccessToken(refreshToken);
		res.status(200).json(auth);
	}

	async logout(req: Request, res: Response): Promise<void> {
		const { refreshToken } = req.body;
		await this.authService.logout(refreshToken);
		res.status(204).json();
	}

	private getSessionInfo(req: Request): AuthSessionInfo {
		return {
			ipAddress: req.ip,
			userAgent: req.get("User-Agent"),
		};
	}
}
 