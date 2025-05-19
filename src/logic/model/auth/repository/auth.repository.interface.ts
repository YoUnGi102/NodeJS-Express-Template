import { AuthDTO, AuthRegisterRequest } from '../auth.types';

export interface IAuthRepository {
  getUserWithPassword(username: string): Promise<AuthDTO | null>;
  getUserByUUID(uuid: string): Promise<AuthDTO | null>;
  updateRefreshToken(userUUID: string, refreshToken: string): Promise<void>;
  registerUser(auth: AuthRegisterRequest): Promise<AuthDTO>;
}
