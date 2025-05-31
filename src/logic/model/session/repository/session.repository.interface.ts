import { UserSessionDTO, UserSessionRequest } from '../session.types';

export interface ISessionRepository {
  create(sessionRequest: UserSessionRequest): Promise<UserSessionDTO>;
  findByToken(refreshToken: string): Promise<UserSessionDTO | null>;
  delete(refreshToken: string): Promise<void>;
  deleteAllForUser(userUUID: string): Promise<void>;
  getActiveSessions(userUUID: string): Promise<UserSessionDTO[]>;
  updateRefreshToken(oldToken: string, newToken: string): Promise<void>;
}
