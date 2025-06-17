import { INJECTION_TOKENS } from "@src/config";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthResponse, AuthSessionInfo } from "../auth.types";
import { IAuthService } from "../service/auth.service.interface";
import { IAuthController } from "./auth.controller.interface";
import ms from "ms";

@injectable()
export class AuthController implements IAuthController {
	constructor(
		@inject(INJECTION_TOKENS.IAuthService) private authService: IAuthService,
	) {}

	async login(req: Request, res: Response<AuthResponse>) {
		const authRequest = req.body;
		const sessionInfo: AuthSessionInfo = this.getSessionInfo(req);
		const auth = await this.authService.login(authRequest, sessionInfo);
		this.addCookie(res, auth.refreshToken);
		res.status(200).json({ token: auth.token, user: auth.user });
	}

	async register(req: Request, res: Response<AuthResponse>): Promise<void> {
		const authRequest = req.body;
		const sessionInfo: AuthSessionInfo = this.getSessionInfo(req);
		const auth = await this.authService.register(authRequest, sessionInfo);
		this.addCookie(res, auth.refreshToken);
		res.status(201).json({ token: auth.token, user: auth.user });
	}

	async refresh(req: Request, res: Response<AuthResponse>): Promise<void> {
		const refreshToken = req.cookies.jid;
		const auth = await this.authService.refreshAccessToken(refreshToken);
		this.addCookie(res, auth.refreshToken);
		res.status(200).json({ token: auth.token, user: auth.user });
	}

	async logout(req: Request, res: Response): Promise<void> {
		const refreshToken = req.cookies.jid;
		await this.authService.logout(refreshToken);
		this.clearCookie(res);
		res.status(204).json();
	}

	private getSessionInfo(req: Request): AuthSessionInfo {
		return {
			ipAddress: req.ip,
			userAgent: req.get("User-Agent"),
		};
	}

	private addCookie(res: Response, refreshToken: string): void {
		res.cookie("jid", refreshToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			maxAge: ms("28d"),
		});
	}

	private clearCookie(res: Response): void {
		res.clearCookie("jid", {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});
	}
}
