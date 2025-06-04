import { UserSessionDTO } from "../session.types";
import { ISessionService } from "./session.service.interface";
import { ISessionRepository } from "../repository/session.repository.interface";
import { inject, injectable } from "tsyringe";
import { INJECTION_TOKENS } from "@src/config";
import { signRefreshToken, verifyRefreshToken } from "../utils/helper";
import hashUtils from "@src/logic/shared/utils/hashUtils";
import { ERRORS } from "@src/logic/shared/utils/errors";

@injectable()
export class SessionService implements ISessionService {
	constructor(
		@inject(INJECTION_TOKENS.ISessionRepository)
		private readonly sessionRepo: ISessionRepository,
	) {}

	async createSession(
		userUUID: string,
		ipAddress?: string,
		userAgent?: string,
	): Promise<UserSessionDTO> {
		const refreshToken = signRefreshToken(userUUID);
		const hashedRefreshToken = hashUtils.sha256(refreshToken);

		const session = await this.sessionRepo.create({
			userUUID,
			ipAddress,
			userAgent,
			refreshToken: hashedRefreshToken,
		});

		return { ...session, refreshToken };
	}
	async findByToken(refreshToken: string): Promise<UserSessionDTO> {
		verifyRefreshToken(refreshToken);

		const hash = hashUtils.sha256(refreshToken);

		const session = await this.sessionRepo.findByToken(hash);
		if (!session) {
			throw ERRORS.AUTH.REFRESH_TOKEN_INVALID();
		}

		return session;
	}

	async revokeAllForUser(userUUID: string): Promise<void> {
		await this.sessionRepo.deleteAllForUser(userUUID);
	}

	async revokeSession(refreshToken: string): Promise<void> {
		verifyRefreshToken(refreshToken);

		const hash = hashUtils.sha256(refreshToken);
		await this.sessionRepo.delete(hash);
	}

	async getActiveSessions(userUUID: string): Promise<UserSessionDTO[]> {
		return await this.sessionRepo.getActiveSessions(userUUID);
	}

	async rotateRefreshToken(
		userUUID: string,
		oldToken: string,
	): Promise<string> {
		const hashedOldToken = hashUtils.sha256(oldToken);

		const session = await this.sessionRepo.findByToken(hashedOldToken);
		if (!session) {
			throw ERRORS.AUTH.REFRESH_TOKEN_INVALID();
		}

		const newToken = signRefreshToken(userUUID);
		const hashedNewToken = hashUtils.sha256(newToken);
		await this.sessionRepo.updateRefreshToken(hashedOldToken, hashedNewToken);

		return newToken;
	}
}
