<<<<<<< HEAD
import { AuthDTO, InternalAuthResponse } from '../auth.types';

export const toAuthResponse = (
  token: string,
  refreshToken: string,
  auth: AuthDTO,
): InternalAuthResponse => ({
  token,
  refreshToken,
  user: {
    username: auth.username,
    email: auth.email,
    uuid: auth.uuid,
    createdAt: auth.createdAt,
  },
=======
import { AuthDTO, AuthResponse } from "../auth.types";

export const toAuthResponse = (
	token: string,
	refreshToken: string,
	auth: AuthDTO,
): AuthResponse => ({
	token,
	refreshToken,
	user: {
		username: auth.username,
		email: auth.email,
		uuid: auth.uuid,
		createdAt: auth.createdAt,
	},
>>>>>>> origin/main
});
