import { UserSessionDTO } from '../session.types';

export interface ISessionService {
  createSession(
    userUUID: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSessionDTO>;
  findByToken(refreshToken: string): Promise<UserSessionDTO | null>;
  revokeAllForUser(userUUID: string): Promise<void>;
  revokeById(sessionId: string): Promise<void>;
  getActiveSessions(userUUID: string): Promise<UserSessionDTO[]>;
}
