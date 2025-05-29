import { Express } from 'express';
import { ISessionService } from '@src/logic/model/session/service/session.service.interface';
import { DataSource } from 'typeorm';
import { setupUnit } from '../setup';
import { container } from 'tsyringe';
import { INJECTION_TOKENS } from '@src/config';
import { createTestUser } from '@test/utils/factories';
import { UserSession } from '@src/database/entities';
import hashUtils from '@src/logic/shared/utils/hashUtils';
// import { ISessionRepository } from '@src/logic/model/session/repository/session.repository.interface';

// let sessionRepo: ISessionRepository;
let testDataSource: DataSource;
let sessionService: ISessionService;
let app: Express;

beforeAll(async () => {
  const config = await setupUnit();
  app = config.app;
  testDataSource = config.testDataSource;
  // sessionRepo = container.resolve<ISessionRepository>(
  //   INJECTION_TOKENS.ISessionRepository,
  // );
  sessionService = container.resolve<ISessionService>(
    INJECTION_TOKENS.ISessionService,
  );
});

afterAll(async () => {});

describe('ISessionService - rotateRefreshToken', () => {
  it('should return a new token if valid refresh token provided', async () => {
    const { user, refreshToken } = (await createTestUser(app))[0];

    const newToken = await sessionService.rotateRefreshToken(
      user.uuid,
      refreshToken,
    );

    const session = await testDataSource
      .getRepository(UserSession)
      .findOneBy({ refreshToken: hashUtils.sha256(newToken) });

    expect(newToken).not.toEqual(refreshToken);
    expect(hashUtils.sha256(newToken)).toEqual(session!.refreshToken);
    expect(hashUtils.sha256(refreshToken)).not.toEqual(session!.refreshToken);
  });
});
