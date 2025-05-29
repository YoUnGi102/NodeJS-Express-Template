import { UserSessionDTO } from '../session.types';

export interface ISessionService {
  createSession(
    userUUID: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSessionDTO>;
  findByToken(refreshToken: string): Promise<UserSessionDTO>;
  revokeAllForUser(userUUID: string): Promise<void>;
  revokeSession(sessionId: string): Promise<void>;
  getActiveSessions(userUUID: string): Promise<UserSessionDTO[]>;
  rotateRefreshToken(userUUID: string, oldToken: string): Promise<string>;
}
