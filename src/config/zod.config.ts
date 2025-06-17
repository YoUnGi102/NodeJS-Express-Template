import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

const ZOD_CONFIG = {
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
		MAX_PASSWORD_LENGTH: 64,
		MAX_USERNAME_LENGTH: 50,
	},
	REGEX: {
		JWT: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
		PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
	},
};

export default ZOD_CONFIG;

extendZodWithOpenApi(z);
export { z };
