import { container } from 'tsyringe';
import { AuthService } from '@logic/model/auth/service/auth.service';
import { AuthRepository } from '@logic/model/auth/repository/auth.repository';
import { AuthController } from '@src/logic/model/auth/controller/auth.controller';
import { INJECTION_TOKENS } from '.';

// Auth
container.register(INJECTION_TOKENS.IAuthController, {
  useClass: AuthController,
});
container.register(INJECTION_TOKENS.IAuthService, { useClass: AuthService });
container.register(INJECTION_TOKENS.IAuthRepository, {
  useClass: AuthRepository,
});
