import { UserSession } from '@src/database/entities/UserSession';
import { inject, injectable } from 'tsyringe';
import {
  DataSource,
  FindOptionsRelations,
  FindOptionsWhere,
  IsNull,
} from 'typeorm';
import { ISessionRepository } from './session.repository.interface';
import { UserSessionDTO, UserSessionRequest } from '../session.types';
import { User } from '@src/database/entities';
import { toUserSessionDTO } from '../utils/helper';

const USER_RELATION = {
  user: true,
};

const SESSION_ACTIVE_CONDITION = {
  deletedAt: IsNull(),
};

@injectable()
export class TypeormSessionRepository implements ISessionRepository {
  private sessionRepo;
  private userRepo;
  constructor(@inject(DataSource) private dataSource: DataSource) {
    this.sessionRepo = this.dataSource.getRepository(UserSession);
    this.userRepo = this.dataSource.getRepository(User);
  }

  async createSession(
    sessionRequest: UserSessionRequest,
  ): Promise<UserSessionDTO> {
    const { userUUID, userAgent, ipAddress, refreshToken }: UserSessionRequest =
      sessionRequest;

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

    const sessionFound = await this.findOneBy(
      { id: sessionCreated.id },
      USER_RELATION,
    );
    if (!sessionFound) {
      throw new Error('User not created');
    }

    return toUserSessionDTO(sessionFound);
  }

  async findByToken(refreshToken: string): Promise<UserSessionDTO | null> {
    const session = await this.findOneBy({ refreshToken }, USER_RELATION);
    return session ? toUserSessionDTO(session) : null;
  }

  async revokeSession(refreshToken: string): Promise<void> {
    await this.sessionRepo.softDelete({ refreshToken });
  }

  async revokeAllForUser(userUUID: string): Promise<void> {
    const sessions = await this.findByUserUUID(userUUID);
    for (const session of sessions) {
      await this.sessionRepo.softDelete({ id: session.id });
    }
  }

  async getActiveSessions(userUUID: string): Promise<UserSessionDTO[]> {
    const sessions = await this.findByUserUUID(userUUID, USER_RELATION);
    return sessions.map((s) => toUserSessionDTO(s));
  }

  async updateRefreshToken(oldToken: string, newToken: string): Promise<void> {
    await this.sessionRepo.update(
      { refreshToken: oldToken },
      { refreshToken: newToken },
    );
  }

  private async findOneBy(
    condition: FindOptionsWhere<UserSession>,
    relations: FindOptionsRelations<UserSession> = {},
  ): Promise<UserSession | null> {
    const where = {
      ...SESSION_ACTIVE_CONDITION,
      ...condition,
    };
    const session = await this.sessionRepo.findOne({ where, relations });
    return session;
  }

  private async findByUserUUID(
    uuid: string,
    relations: FindOptionsRelations<UserSession> = {},
  ): Promise<UserSession[]> {
    const where = {
      ...SESSION_ACTIVE_CONDITION,
      user: {
        uuid,
      },
    };
    const sessions = await this.sessionRepo.find({ where, relations });
    return sessions;
  }
}
