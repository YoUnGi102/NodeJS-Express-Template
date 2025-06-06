export const SWAGGER_CONFIG = {
	APP_TITLE: "Node.js/Express Template w/ Typescript",
	APP_DESCRIPTION:
		"My personal template to use to accelerate project setup in Node.js/Express",
};

export const ZOD_CONFIG = {
	CUSTOM_FUNCTIONS: {
		round: (decimals: number) => (value: number) =>
			Math.round((value * 10 ** decimals) / 10 ** decimals),
	},
	DEFAULT_PARAMS: {
		PAGE_INDEX: 0,
		PAGE_SIZE: 10,
	},
	USER: {
		MIN_PASSWORD_LENGTH: 8,
		MIN_USERNAME_LENGTH: 5,
	},
};

export const INJECTION_TOKENS = {
	IAuthController: "AuthController",
	IAuthService: "IAuthService",
	IAuthRepository: "IAuthRepository",

	ISessionService: "ISessionService",
	ISessionRepository: "ISessionRepository",
};
