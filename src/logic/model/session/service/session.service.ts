import { UserSessionDTO } from '../session.types';
import { ISessionService } from './session.service.interface';
import { ISessionRepository } from '../repository/session.repository.interface';
import { inject, injectable } from 'tsyringe';
import { INJECTION_TOKENS } from '@src/config';

@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject(INJECTION_TOKENS.ISessionRepository)
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async createSession(
    userUUID: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSessionDTO> {
    return await this.sessionRepo.createSession(
      userUUID,
      refreshToken,
      ipAddress,
      userAgent,
    );
  }
  async findByToken(refreshToken: string): Promise<UserSessionDTO | null> {
    return await this.sessionRepo.findByToken(refreshToken);
  }
  async revokeAllForUser(userUUID: string): Promise<void> {
    await this.sessionRepo.revokeAllForUser(userUUID);
  }
  async revokeById(refreshToken: string): Promise<void> {
    await this.sessionRepo.revokeSession(refreshToken);
  }
  async getActiveSessions(userUUID: string): Promise<UserSessionDTO[]> {
    return await this.sessionRepo.getActiveSessions(userUUID);
  }
}
