import { UserSessionDTO } from '../session.types';

export interface ISessionRepository {
  createSession(
    userUUID: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSessionDTO>;
  findByToken(refreshToken: string): Promise<UserSessionDTO | null>;
  revokeSession(refreshToken: string): Promise<void>;
  revokeAllForUser(userUUID: string): Promise<void>;
  getActiveSessions(userUUID: string): Promise<UserSessionDTO[]>;
}
