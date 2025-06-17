export interface JWTPayload {
	username: string;
	email: string;
	uuid: string;
	iat?: number;
	exp?: number;
}
