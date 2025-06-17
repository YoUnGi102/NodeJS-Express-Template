import {
<<<<<<< HEAD
  AuthLoginRequest,
  AuthRegisterRequest,
  InternalAuthResponse,
  AuthSessionInfo,
} from '../auth.types';

export interface IAuthService {
  login(
    auth: AuthLoginRequest,
    sessionInfo?: AuthSessionInfo,
  ): Promise<InternalAuthResponse>;
  register(
    auth: AuthRegisterRequest,
    sessionInfo?: AuthSessionInfo,
  ): Promise<InternalAuthResponse>;
  refreshAccessToken(refreshToken: string): Promise<InternalAuthResponse>;
  logout(refreshToken: string): Promise<void>;
=======
	AuthLoginRequest,
	AuthRegisterRequest,
	AuthResponse,
	AuthSessionInfo,
} from "../auth.types";

export interface IAuthService {
	login(
		auth: AuthLoginRequest,
		sessionInfo?: AuthSessionInfo,
	): Promise<AuthResponse>;
	register(
		auth: AuthRegisterRequest,
		sessionInfo?: AuthSessionInfo,
	): Promise<AuthResponse>;
	refreshAccessToken(refreshToken: string): Promise<AuthResponse>;
	logout(refreshToken: string): Promise<void>;
>>>>>>> origin/main
}
