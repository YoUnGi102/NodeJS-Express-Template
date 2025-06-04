export const STATUS = {
	// SUCCESS
	CREATED: 201,
	OK: 200,

	// CLIENT ERROR
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	CONFLICT: 409,

	// SERVER ERROR
	INTERNAL_SERVER_ERROR: 500,
};

export interface Message {
	title: string;
	message: string;
	status: number;
}

export const MESSAGES = {
	// AUTH
	AUTH_USER_NOT_FOUND: {
		title: "USER_NOT_FOUND",
		message: "User not found",
		status: STATUS.NOT_FOUND,
	},
	AUTH_CREDENTIALS_INVALID: {
		title: "AUTH_CREDENTIALS_INVALID",
		message: "Invalid username or password",
		status: STATUS.UNAUTHORIZED,
	},
	AUTH_TOKEN_NOT_PROVIDED: {
		title: "AUTH_TOKEN_NOT_PROVIDED",
		message: "Token was not provided",
		status: STATUS.UNAUTHORIZED,
	},
	AUTH_ACCESS_TOKEN_INVALID: {
		title: "AUTH_ACCESS_TOKEN_INVALID",
		message: "Access token is invalid",
		status: STATUS.UNAUTHORIZED,
	},
	AUTH_ACCESS_TOKEN_EXPIRED: {
		title: "AUTH_ACCESS_TOKEN_EXPIRED",
		message: "Access token has expired",
		status: STATUS.UNAUTHORIZED,
	},
	AUTH_REFRESH_TOKEN_INVALID: {
		title: "AUTH_REFRESH_TOKEN_INVALID",
		message: "Refresh token is invalid",
		status: STATUS.UNAUTHORIZED,
	},
	AUTH_REFRESH_TOKEN_EXPIRED: {
		title: "AUTH_REFRESH_TOKEN_EXPIRED",
		message: "Refresh token has expired",
		status: STATUS.UNAUTHORIZED,
	},
	AUTH_REGISTRATION_FAILED: {
		title: "AUTH_REGISTRATION_FAILED",
		message: "User could not be registered",
		status: STATUS.INTERNAL_SERVER_ERROR,
	},
	AUTH_USERNAME_EXISTS: {
		title: "AUTH_USERNAME_EXISTS",
		message: "User with this username already exists",
		status: STATUS.CONFLICT,
	},
	AUTH_EMAIL_EXISTS: {
		title: "AUTH_EMAIL_EXISTS",
		message: "User with this email already exists",
		status: STATUS.CONFLICT,
	},

	// USER
	USER_ALREADY_EXISTS: {
		title: "USER_ALREADY_EXISTS",
		message: "User already exists",
		status: STATUS.CONFLICT,
	},
	USER_NOT_FOUND: {
		title: "USER_NOT_FOUND",
		message: "User not found",
		status: STATUS.NOT_FOUND,
	},
	USER_FORBIDDEN_ACTION: {
		title: "USER_FORBIDDEN_ACTION",
		message: "User is not allowed to perform this action",
		status: STATUS.FORBIDDEN,
	},
	USER_USERNAME_MISSING: {
		title: "USER_USERNAME_MISSING",
		message: "User username is missing",
		status: STATUS.BAD_REQUEST,
	},
	USER_PASSWORD_MISSING: {
		title: "USER_PASSWORD_MISSING",
		message: "User password is missing",
		status: STATUS.BAD_REQUEST,
	},

	// SESSION

	SESSION_NOT_FOUND: {
		title: "SESSION_NOT_FOUND",
		message: "No session found",
		status: STATUS.NOT_FOUND,
	},
};
