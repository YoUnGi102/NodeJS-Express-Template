import { UserSession } from '@src/database/entities/UserSession';
import { UserSessionDTO } from '../session.types';

export const toUserSessionDTO = (session: UserSession): UserSessionDTO => ({
  id: session.id,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
  deletedAt: session.deletedAt,
  refreshToken: session.refreshToken,
  userAgent: session.userAgent,
  ipAddress: session.ipAddress,
});
