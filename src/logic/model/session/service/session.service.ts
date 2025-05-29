import { UserSessionDTO } from '../session.types';
import { ISessionService } from './session.service.interface';
import { ISessionRepository } from '../repository/session.repository.interface';
import { inject, injectable } from 'tsyringe';
import { INJECTION_TOKENS } from '@src/config';
import { signRefreshToken, toUserSessionDTO } from '../utils/helper';
import hashUtils from '@src/logic/shared/utils/hashUtils';

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
    const session =  await this.sessionRepo.createSession(
      userUUID,
      hashedRefreshToken,
      ipAddress,
      userAgent,
    );
    return {...session, refreshToken};
  }
  async findByToken(refreshToken: string): Promise<UserSessionDTO | null> {
    const hash = hashUtils.sha256(refreshToken);
    return await this.sessionRepo.findByToken(hash);
  }
  async revokeAllForUser(userUUID: string): Promise<void> {
    await this.sessionRepo.revokeAllForUser(userUUID);
  }
  async revokeById(refreshToken: string): Promise<void> {
    const hash = hashUtils.sha256(refreshToken);
    await this.sessionRepo.revokeSession(hash);
  }
  async getActiveSessions(userUUID: string): Promise<UserSessionDTO[]> {
    return await this.sessionRepo.getActiveSessions(userUUID);
  }
}
