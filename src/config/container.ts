import { TypeormAuthRepository } from "@logic/model/auth/repository/auth.repository";
import { AuthService } from "@logic/model/auth/service/auth.service";
import { AuthController } from "@src/logic/model/auth/controller/auth.controller";
import { TypeormSessionRepository } from "@src/logic/model/session/repository/session.repository";
import { SessionService } from "@src/logic/model/session/service/session.service";
import { container } from "tsyringe";
import { INJECTION_TOKENS } from ".";

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
