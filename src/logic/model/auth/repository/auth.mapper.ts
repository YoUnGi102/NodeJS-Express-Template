import { User } from '@src/database/entities';
import { AuthDTO } from '../auth.types';

export const toAuthDTO = (user: User): AuthDTO => ({
  id: user.id,
  username: user.username,
  email: user.email,
  password: user.password,
  refreshToken: user.refreshToken,
  uuid: user.uuid,
  createdAt: user.createdAt,
});
