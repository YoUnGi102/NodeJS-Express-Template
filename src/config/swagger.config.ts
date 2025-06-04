import swaggerJsdoc from "swagger-jsdoc";
import { SWAGGER_CONFIG } from ".";

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: SWAGGER_CONFIG.APP_TITLE,
			version: "1.0.0",
			description: SWAGGER_CONFIG.APP_DESCRIPTION,
		},
		servers: [
			{
				url: process.env.BASE_URL ?? "http://localhost:5000/api",
			},
		],
	},
	apis: ["./src/logic/model/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
