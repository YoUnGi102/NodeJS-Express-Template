import {
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
}
