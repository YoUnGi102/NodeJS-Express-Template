import { UserSession } from '@src/database/entities/UserSession';
import { inject, injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { ISessionRepository } from './session.repository.interface';
import { UserSessionDTO } from '../session.types';
import { User } from '@src/database/entities';
import { toUserSessionDTO } from '../utils/helper';

@injectable()
export class TypeormSessionRepository implements ISessionRepository {
  private sessionRepo;
  private userRepo;
  constructor(@inject(DataSource) private dataSource: DataSource) {
    this.sessionRepo = this.dataSource.getRepository(UserSession);
    this.userRepo = this.dataSource.getRepository(User);
  }

  async createSession(
    userUUID: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSessionDTO> {
    const user = await this.userRepo.findOneOrFail({
      where: { uuid: userUUID },
    });
    const session = this.sessionRepo.create({
      user,
      ipAddress,
      refreshToken,
      userAgent,
    });
    const sessionCreated = await this.sessionRepo.save(session);
    return toUserSessionDTO(sessionCreated);
  }

  async findByToken(refreshToken: string): Promise<UserSessionDTO | null> {
    const session = await this.sessionRepo.findOneBy({ refreshToken });
    return session ? toUserSessionDTO(session) : null;
  }

  async revokeSession(refreshToken: string): Promise<void> {
    await this.sessionRepo.softDelete({ refreshToken });
  }

  async revokeAllForUser(userUUID: string): Promise<void> {
    const sessions = await this.sessionRepo.findBy({
      user: { uuid: userUUID },
    });
    for (const session of sessions) {
      await this.sessionRepo.softDelete({ id: session.id });
    }
  }

  async getActiveSessions(userUUID: string): Promise<UserSessionDTO[]> {
    const sessions = await this.sessionRepo.findBy({
      user: { uuid: userUUID },
    });
    return sessions;
  }
}
