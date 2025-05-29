import { container } from 'tsyringe';
import { AuthService } from '@logic/model/auth/service/auth.service';
import { TypeormAuthRepository } from '@logic/model/auth/repository/auth.repository';
import { AuthController } from '@src/logic/model/auth/controller/auth.controller';
import { INJECTION_TOKENS } from '.';
import { TypeormSessionRepository } from '@src/logic/model/session/repository/session.repository';
import { SessionService } from '@src/logic/model/session/service/session.service';

// Auth
container.register(INJECTION_TOKENS.IAuthController, {
  useClass: AuthController,
});
container.register(INJECTION_TOKENS.IAuthService, { useClass: AuthService });
container.register(INJECTION_TOKENS.IAuthRepository, {
  useClass: TypeormAuthRepository,
});

// Session
container.register(INJECTION_TOKENS.ISessionService, {
  useClass: SessionService,
});
container.register(INJECTION_TOKENS.ISessionRepository, {
  useClass: TypeormSessionRepository,
});
