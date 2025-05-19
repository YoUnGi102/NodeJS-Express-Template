import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
} from '../auth.types';

export interface IAuthService {
  login(auth: AuthLoginRequest): Promise<AuthResponse>;
  register(auth: AuthRegisterRequest): Promise<AuthResponse>;
  refreshAccessToken(refreshToken: string): Promise<AuthResponse>;
  logout(refreshToken: string): Promise<void>;
}
