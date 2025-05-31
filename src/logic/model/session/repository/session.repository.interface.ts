import { UserSessionDTO, UserSessionRequest } from '../session.types';

export interface ISessionRepository {
  createSession(sessionRequest: UserSessionRequest): Promise<UserSessionDTO>;
  findByToken(refreshToken: string): Promise<UserSessionDTO | null>;
  revokeSession(refreshToken: string): Promise<void>;
  revokeAllForUser(userUUID: string): Promise<void>;
  getActiveSessions(userUUID: string): Promise<UserSessionDTO[]>;
  updateRefreshToken(oldToken: string, newToken: string): Promise<void>;
}
